import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('product_compositions')
export class ProductCompositionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Exclude()
  @ManyToOne(() => ProductEntity, (product) => product.compositions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_product_id' })
  public parentProduct: ProductEntity;

  @ManyToOne(() => ProductEntity, (product) => product.includedIn, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'child_product_id' })
  public childProduct: ProductEntity;

  @Column({ type: 'int', default: 1 })
  public quantity: number;
}
