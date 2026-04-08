import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CategoryType = 'main' | 'sub' | 'featured';

@Entity('categories')
@Index('idx_category_slug', ['slug'], { unique: true })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  declare slug: string;

  @Column({ type: 'varchar', length: 150 })
  declare nameEn: string;

  @Column({ type: 'varchar', length: 150 })
  declare nameKm: string;

  @Column({ type: 'text', nullable: true })
  declare descriptionEn: string | null;

  @Column({ type: 'text', nullable: true })
  declare descriptionKm: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  declare iconUrl: string | null;

  @Column({ type: 'integer', default: 0 })
  declare displayOrder: number;

  @Column({
    type: 'enum',
    enum: ['main', 'sub', 'featured'],
    default: 'main',
  })
  declare categoryType: CategoryType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  declare createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  declare updatedAt: Date;
}
