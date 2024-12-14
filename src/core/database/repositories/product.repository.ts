import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductType } from 'src/enums/product-types.enum';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async findProductWithCompositions(productId: number): Promise<ProductEntity> {
    const productType = await this.findOne({
      where: { id: productId },
      select: {
        productType: true,
      },
    });

    if (!productType) {
      return null;
    }

    const isFlower = productType.productType === ProductType.FLOWER;

    return this.findOne({
      where: { id: productId },
      relations: ['compositions.childProduct', 'store'],
      select: {
        id: true,
        productType: true,
        name: true,
        variety: isFlower,
        description: true,
        imageUrl: true,
        price: true,
        currency: true,
        minimumOrderQuantity: true,
        arrivalDate: true,
        isFresh: true,
        colors: isFlower,
        originCountry: isFlower,
        notes: true,
        isAvailable: true,
        heightCm: true,
        fragranceIntensity: isFlower,
        seasonality: true,
        isPackagingRequired: !isFlower,
        packagingType: !isFlower,
        packagingColor: !isFlower,
        stockQuantity: true,
        flowersCount: !isFlower,
        tags: true,
        store: {
          id: true,
          name: true,
        },
        compositions: {
          quantity: true,
          childProduct: {
            id: true,
            name: true,
            productType: true,
            variety: true,
            description: true,
            imageUrl: true,
            colors: true,
            originCountry: true,
            heightCm: true,
            fragranceIntensity: true,
            seasonality: true,
          },
        },
      },
    });
  }
}
