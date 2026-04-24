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
import { UserEntity } from './user.entity';

export type AuthProvider = 'email' | 'google' | 'facebook' | 'telegram';

@Entity('auth_accounts')
@Index(['provider', 'providerAccountId'], { unique: true })
@Index(['userId', 'provider'], { unique: true })
export class AuthAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.authAccounts, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({
    type: 'enum',
    enum: ['email', 'google', 'facebook', 'telegram'],
  })
  provider!: AuthProvider;

  @Column({ type: 'varchar', length: 255, name: 'provider_account_id' })
  providerAccountId!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'password_hash',
    select: false,
  })
  passwordHash!: string | null;

  @Column({
    type: 'text',
    nullable: true,
    name: 'access_token',
    select: false,
  })
  accessToken!: string | null;

  @Column({
    type: 'text',
    nullable: true,
    name: 'refresh_token',
    select: false,
  })
  refreshToken!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'token_expires_at',
  })
  tokenExpiresAt!: Date | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'provider_profile',
  })
  providerProfile!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
