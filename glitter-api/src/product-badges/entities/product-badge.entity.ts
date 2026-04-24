import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

export type BadgeType =
  | 'new'
  | 'sale'
  | 'bestseller'
  | 'limited'
  | 'exclusive'
  | 'hot'
  | 'featured'
  | 'coming_soon';

@Entity('product_badges')
@Index(['productId', 'badgeType'], { unique: true })
export class ProductBadgeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.badges, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @Column({
    type: 'enum',
    enum: [
      'new',
      'sale',
      'bestseller',
      'limited',
      'exclusive',
      'hot',
      'featured',
      'coming_soon',
    ],
    name: 'badge_type',
  })
  badgeType!: BadgeType;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'badge_label_en',
  })
  badgeLabelEn!: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'badge_label_km',
  })
  badgeLabelKm!: string | null;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'badge_icon_color',
  })
  badgeIconColor!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'badge_start_date',
  })
  badgeStartDate!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'badge_end_date',
  })
  badgeEndDate!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
