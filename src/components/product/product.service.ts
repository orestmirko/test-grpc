import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity, AdminEntity, StoreEntity } from '@entities';
import { CreateProductDto } from '@dtos';
import { ProductType, PackagingType } from '@enums';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  public async createProduct(
    adminId: number,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    try {
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

  private async createFlowerProduct(
    dto: CreateProductDto,
    store: StoreEntity,
  ): Promise<ProductEntity> {
    this.validatePackaging(dto);
    
    if (dto.flowersCount !== undefined) {
      throw new BadRequestException('Field flowersCount is not allowed for flower');
    }

    const product = this.productRepository.create({
      ...dto,
      store,
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
      store,
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
      store,
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
      store,
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
}
