import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthAccountEntity } from './auth-account.entity';

export type AccountStatus = 'active' | 'suspended' | 'deleted';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Primary email. Nullable because some OAuth providers (Facebook, phone-only
   * logins) may not return an email. Unique when set.
   */
  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'email_verified_at',
  })
  emailVerifiedAt!: Date | null;

  /**
   * Phone number is nullable at signup (social sign-in doesn't provide it).
   * Required before the user can place an order — enforced in the Orders API, not here.
   */
  @Index({ unique: true, where: '"phone_number" IS NOT NULL' })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'phone_verified_at',
  })
  phoneVerifiedAt!: Date | null;

  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  fullName!: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'profile_image_url',
  })
  profileImageUrl!: string | null;

  @Column({
    type: 'enum',
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
    name: 'account_status',
  })
  accountStatus!: AccountStatus;

  /**
   * True once the user has provided all info required for ordering
   * (name + phone + email). Auto-computed in service on each update.
   * Frontend checks this to decide whether to show "Complete your profile" prompt.
   */
  @Column({ type: 'boolean', default: false, name: 'is_profile_complete' })
  isProfileComplete!: boolean;

  /**
   * Bumped on password change / forced logout to invalidate all existing JWTs.
   */
  @Column({ type: 'int', default: 0, name: 'token_version' })
  tokenVersion!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => AuthAccountEntity, (account) => account.user)
  authAccounts?: AuthAccountEntity[];
}
