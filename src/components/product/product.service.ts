import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity, AdminEntity, StoreEntity, ProductCompositionEntity } from '@entities';
import { CreateProductDto, UpdateProductDto } from '@dtos';
import { ProductType, PackagingType } from '@enums';
import { ProductRepository } from '@repositories';
import { Cached, ClearCache } from '@decorators';
import { RedisService } from 'src/core/cache/redis.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    // need for cache decorator
    private readonly redisService: RedisService,
  ) {}

  @ClearCache('product')
  public async createProduct(
    adminId: number,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    try {
      const admin = await this.validateAdmin(adminId);

      await this.validateProductName(createProductDto.name, admin.store.id);

      let product: ProductEntity;

      switch (createProductDto.productType) {
        case ProductType.FLOWER:
          product = await this.createFlowerProduct(createProductDto, admin.store);
          break;
        case ProductType.BOUQUET:
          product = await this.createBouquetProduct(createProductDto, admin.store);
          break;
        case ProductType.BASKET:
          product = await this.createBasketProduct(createProductDto, admin.store);
          break;
        case ProductType.PACKAGE:
          product = await this.createPackageProduct(createProductDto, admin.store);
          break;
        default:
          throw new BadRequestException('Unknown product type');
      }

      this.logger.log(`Product created with ID: ${product.id} for store: ${admin.store.id}`);

      return product;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }

  @Cached('product', 3600)
  public async getProduct(productId: number): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findProductWithCompositions(productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      this.logger.log(`Product retrieved with ID: ${productId}`);
      return product;
    } catch (error) {
      this.logger.error(`Failed to get product: ${error.message}`);
      throw error;
    }
  }

  @ClearCache('product')
  public async addFlowersToProduct(
    adminId: number,
    parentProductId: number,
    flowers: { flowerId: number; quantity: number }[],
  ): Promise<ProductEntity> {
    try {
      const admin = await this.validateAdmin(adminId);

      const parentProduct = await this.productRepository.findOne({
        where: { id: parentProductId, store: { id: admin.store.id } },
        relations: ['compositions.childProduct', 'store'],
      });

      if (!parentProduct) {
        throw new NotFoundException('Parent product not found');
      }

      if (
        ![ProductType.BOUQUET, ProductType.BASKET, ProductType.PACKAGE].includes(
          parentProduct.productType,
        )
      ) {
        throw new BadRequestException('Can only add flowers to bouquet, basket or package');
      }

      const childProducts = await Promise.all(
        flowers.map(async ({ flowerId }) => {
          const product = await this.productRepository.findOne({
            where: {
              id: flowerId,
              store: { id: admin.store.id },
              productType: ProductType.FLOWER,
            },
          });

          if (!product) {
            throw new NotFoundException(`Flower with ID ${flowerId} not found`);
          }

          return product;
        }),
      );

      const existingCompositionsMap = new Map(
        parentProduct.compositions?.map((comp) => [comp.childProduct.id, comp]) || [],
      );

      const newFlowerIds = new Set(flowers.map((f) => f.flowerId));

      const compositionsToUpdate: ProductCompositionEntity[] = [];
      const compositionsToCreate: ProductCompositionEntity[] = [];
      const compositionsToDelete: ProductCompositionEntity[] = [];

      existingCompositionsMap.forEach((composition, flowerId) => {
        if (!newFlowerIds.has(flowerId)) {
          compositionsToDelete.push(composition);
        }
      });

      flowers.forEach((flower, index) => {
        const existingComposition = existingCompositionsMap.get(flower.flowerId);

        if (existingComposition) {
          existingComposition.quantity = flower.quantity;
          compositionsToUpdate.push(existingComposition);
        } else {
          const composition = new ProductCompositionEntity();
          composition.parentProduct = parentProduct;
          composition.childProduct = childProducts[index];
          composition.quantity = flower.quantity;
          compositionsToCreate.push(composition);
        }
      });

      await this.productRepository.manager.transaction(async (manager) => {
        if (compositionsToDelete.length > 0) {
          await manager.remove(compositionsToDelete);
        }
        if (compositionsToUpdate.length > 0) {
          await manager.save(compositionsToUpdate);
        }
        if (compositionsToCreate.length > 0) {
          await manager.save(compositionsToCreate);
        }
      });

      const updatedProduct =
        await this.productRepository.findProductWithCompositions(parentProductId);

      this.logger.log(
        `Updated ${compositionsToUpdate.length}, added ${compositionsToCreate.length}, and removed ${compositionsToDelete.length} flowers from product (ID: ${parentProductId})`,
      );

      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to add flowers to product: ${error.message}`);
      throw error;
    }
  }

  @ClearCache('product')
  public async updateProduct(
    adminId: number,
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    try {
      const admin = await this.validateAdmin(adminId);

      const product = await this.productRepository.findOne({
        where: { id: productId, store: { id: admin.store.id } },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (updateProductDto.name && updateProductDto.name !== product.name) {
        await this.validateProductName(updateProductDto.name, admin.store.id);
      }

      if (
        updateProductDto.isPackagingRequired !== undefined ||
        updateProductDto.packagingType !== undefined ||
        updateProductDto.packagingColor !== undefined
      ) {
        this.validatePackaging({
          isPackagingRequired: updateProductDto.isPackagingRequired ?? product.isPackagingRequired,
          packagingType: updateProductDto.packagingType ?? product.packagingType,
          packagingColor: updateProductDto.packagingColor ?? product.packagingColor,
        } as CreateProductDto);
      }

      if (product.productType !== ProductType.FLOWER) {
        if (
          updateProductDto.variety ||
          updateProductDto.colors ||
          updateProductDto.originCountry ||
          updateProductDto.fragranceIntensity
        ) {
          this.validateCompositeProduct(
            { ...product, ...updateProductDto } as CreateProductDto,
            product.productType,
          );
        }
      } else if (updateProductDto.flowersCount) {
        throw new BadRequestException('Field flowersCount is not allowed for flower');
      }

      await this.productRepository.update(productId, updateProductDto);

      const updatedProduct = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['compositions.childProduct'],
      });

      this.logger.log(`Product updated with ID: ${productId}`);

      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update product: ${error.message}`);
      throw error;
    }
  }

  @ClearCache('product')
  public async deleteProduct(adminId: number, productId: number): Promise<void> {
    try {
      const admin = await this.validateAdmin(adminId);

      const product = await this.productRepository.findOne({
        where: { id: productId, store: { id: admin.store.id } },
        relations: ['compositions', 'includedIn'],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.remove(product);

      this.logger.log(`Product deleted with ID: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      throw error;
    }
  }

  private async createFlowerProduct(
    dto: CreateProductDto,
    store: StoreEntity,
  ): Promise<ProductEntity> {
    this.validatePackaging(dto);

    if (dto.flowersCount) {
      throw new BadRequestException('Field flowersCount is not allowed for flower');
    }

    const product = this.productRepository.create({
      ...dto,
      store: { id: store.id } as StoreEntity,
    });

    return this.productRepository.save(product);
  }

  private async createBouquetProduct(
    dto: CreateProductDto,
    store: StoreEntity,
  ): Promise<ProductEntity> {
    this.validateCompositeProduct(dto, ProductType.BOUQUET);
    this.validatePackaging(dto);

    const product = this.productRepository.create({
      ...dto,
      store: { id: store.id } as StoreEntity,
    });

    return this.productRepository.save(product);
  }

  private async createBasketProduct(
    dto: CreateProductDto,
    store: StoreEntity,
  ): Promise<ProductEntity> {
    this.validateCompositeProduct(dto, ProductType.BASKET);
    this.validatePackaging(dto);

    const product = this.productRepository.create({
      ...dto,
      store: { id: store.id } as StoreEntity,
    });

    return this.productRepository.save(product);
  }

  private async createPackageProduct(
    dto: CreateProductDto,
    store: StoreEntity,
  ): Promise<ProductEntity> {
    this.validateCompositeProduct(dto, ProductType.PACKAGE);
    this.validatePackaging(dto);

    const product = this.productRepository.create({
      ...dto,
      store: { id: store.id } as StoreEntity,
    });

    return this.productRepository.save(product);
  }

  private validatePackaging(dto: CreateProductDto): void {
    if (dto.isPackagingRequired) {
      if (!dto.packagingType || dto.packagingType === PackagingType.NONE) {
        throw new BadRequestException(
          'Packaging type is required when isPackagingRequired is true',
        );
      }
      if (!dto.packagingColor) {
        throw new BadRequestException(
          'Packaging color is required when isPackagingRequired is true',
        );
      }
    } else {
      if (dto.packagingType && dto.packagingType !== PackagingType.NONE) {
        throw new BadRequestException(
          'Packaging type is not allowed when isPackagingRequired is false',
        );
      }
      if (dto.packagingColor) {
        throw new BadRequestException(
          'Packaging color is not allowed when isPackagingRequired is false',
        );
      }
    }
  }

  private validateCompositeProduct(dto: CreateProductDto, type: ProductType): void {
    const forbiddenFields = [];

    if (dto.variety) forbiddenFields.push('variety');
    if (dto.colors) forbiddenFields.push('colors');
    if (dto.originCountry) forbiddenFields.push('originCountry');
    if (dto.fragranceIntensity) forbiddenFields.push('fragranceIntensity');

    if (forbiddenFields.length > 0) {
      throw new BadRequestException(
        `Fields [${forbiddenFields.join(', ')}] are not allowed for ${type}`,
      );
    }

    if (type === ProductType.BASKET || type === ProductType.PACKAGE) {
      if (!dto.isPackagingRequired) {
        throw new BadRequestException(`Packaging is required for ${type}`);
      }
      if (!dto.packagingType || dto.packagingType === PackagingType.NONE) {
        throw new BadRequestException(`Packaging type is required for ${type}`);
      }
      if (!dto.packagingColor) {
        throw new BadRequestException(`Packaging color is required for ${type}`);
      }
    }
  }

  private async validateProductName(name: string, storeId: number): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: {
        name,
        store: { id: storeId },
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists in your store');
    }
  }

  private async validateAdmin(adminId: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['store'],
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (!admin.store) {
      throw new UnauthorizedException('Admin has no associated store');
    }

    return admin;
  }
}
