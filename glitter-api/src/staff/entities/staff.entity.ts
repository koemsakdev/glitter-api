import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BranchEntity } from '../../branch/entities/branch.entity';

export type EmploymentStatus = 'active' | 'inactive' | 'terminated';

@Entity('staff')
@Index('idx_staff_branch', ['branchId'])
@Index('idx_staff_email', ['email'], { unique: true })
export class StaffEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'uuid' })
  declare branchId: string;

  @ManyToOne(() => BranchEntity, { nullable: false, onDelete: 'CASCADE' })
  declare branch: BranchEntity;

  @Column({ type: 'varchar', length: 100 })
  declare name: string;

  @Column({ type: 'varchar', length: 100 })
  declare role: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  declare phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  declare email: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'terminated'],
    default: 'active',
  })
  declare employmentStatus: EmploymentStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
