import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariantEntity } from '../../product-variants/entities/product-variant.entity';
import { BranchEntity } from '../../branch/entities/branch.entity';

@Entity('inventory_branch')
@Index(['productVariantId', 'branchId'], { unique: true })
export class InventoryBranchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'product_variant_id' })
  productVariantId!: string;

  @ManyToOne(() => ProductVariantEntity, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant?: ProductVariantEntity;

  @Column({ type: 'uuid', name: 'branch_id' })
  branchId!: string;

  @ManyToOne(() => BranchEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'branch_id' })
  branch?: BranchEntity;

  @Column({ type: 'int', default: 0, name: 'quantity_available' })
  quantityAvailable!: number;

  @Column({ type: 'int', default: 0, name: 'quantity_reserved' })
  quantityReserved!: number;

  @Column({ type: 'int', default: 0, name: 'quantity_damaged' })
  quantityDamaged!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
