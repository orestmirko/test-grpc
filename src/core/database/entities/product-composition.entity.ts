import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
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
  @JoinColumn({ name: 'parent_product_id' })
  public parentProduct: ProductEntity;

  // троянда (FLOWER) + quantity = 10
  // тюльпан (FLOWER) + quantity = 5
  @ManyToOne(() => ProductEntity, (product) => product.includedIn, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'child_product_id' })
  public childProduct: ProductEntity;

  @Column({ type: 'int', default: 1 })
  public quantity: number;
}
