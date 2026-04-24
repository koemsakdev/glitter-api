import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'app_settings' })
@Index('uq_app_settings_group_key', ['settingGroup', 'settingKey'], {
  unique: true,
})
export class AppSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'setting_group', type: 'varchar', length: 100 })
  settingGroup!: string;

  @Column({ name: 'setting_key', type: 'varchar', length: 100 })
  settingKey!: string;

  @Column({ name: 'setting_value', type: 'text' })
  settingValue!: string;

  @Column({ name: 'value_type', type: 'varchar', length: 30 })
  valueType!: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic!: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
