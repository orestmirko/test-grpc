import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_compositions')
export class ProductCompositionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // "букет Літній набір"
  @ManyToOne(() => ProductEntity, (product) => product.compositions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public parentProduct: ProductEntity;

  // троянда (FLOWER) + quantity = 10
  // тюльпан (FLOWER) + quantity = 5
  @ManyToOne(() => ProductEntity, (product) => product.includedIn, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public childProduct: ProductEntity;

  @Column({ type: 'int', default: 1 })
  public quantity: number;
}
