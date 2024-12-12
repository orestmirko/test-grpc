import { Column, Entity, ManyToOne, Index, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { Currency, Season, ProductType, PackagingType } from '../../../enums';
import { ProductCompositionEntity } from './product-composition.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.FLOWER,
  })
  @Index()
  public productType: ProductType;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  @Index()
  public name: string;

  @Column({
    name: 'variety',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  public variety: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public imageUrl: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  public price: number;

  @Column({
    name: 'currency',
    type: 'enum',
    enum: Currency,
    default: Currency.UAH,
  })
  public currency: Currency;

  @Column({
    name: 'minimum_order_quantity',
    type: 'int',
    nullable: true,
    default: 1,
  })
  public minimumOrderQuantity: number;

  @Column({
    name: 'arrival_date',
    type: 'date',
    nullable: true,
  })
  public arrivalDate: Date;

  @Column({
    name: 'is_fresh',
    type: 'boolean',
    default: true,
  })
  @Index()
  public isFresh: boolean;

  @Column('varchar', { array: true, nullable: true })
  public colors: string[];

  @Column({
    name: 'origin_country',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public originCountry: string;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  public notes: string;

  @Column({
    name: 'is_available',
    type: 'boolean',
    default: true,
  })
  @Index()
  public isAvailable: boolean;

  @Column({
    name: 'height_cm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  public heightCm: number;

  @Column({
    name: 'fragrance_intensity',
    type: 'int',
    nullable: true,
  })
  public fragranceIntensity: number;

  @Column({
    type: 'enum',
    enum: Season,
    nullable: true,
  })
  public seasonality: Season;

  @Column({
    name: 'is_packaging_required',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  public isPackagingRequired: boolean;

  @Column({
    name: 'packaging_type',
    type: 'enum',
    enum: PackagingType,
    default: PackagingType.NONE,
    nullable: false,
  })
  public packagingType: PackagingType;

  @Column({
    name: 'packaging_color',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public packagingColor: string;

  @Column({
    name: 'stock_quantity',
    type: 'int',
    default: 0,
    nullable: false,
  })
  public stockQuantity: number;

  @Column({
    name: 'tags',
    type: 'varchar',
    array: true,
    nullable: true,
  })

  @Index('IDX_PRODUCT_TAGS_GIN', { synchronize: false })
  public tags: string[];

  @ManyToOne(() => StoreEntity, (store) => store.products, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  public store: StoreEntity;

  @OneToMany(() => ProductCompositionEntity, (pc) => pc.parentProduct)
  public compositions: ProductCompositionEntity[];

  @OneToMany(() => ProductCompositionEntity, (pc) => pc.childProduct)
  public includedIn: ProductCompositionEntity[];
}
