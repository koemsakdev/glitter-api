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

export type AuthProvider =
  | 'email'
  | 'google'
  | 'facebook'
  | 'apple'
  | 'telegram';

/**
 * An auth_account represents ONE way a user can log in.
 * A user can have multiple auth_accounts linked to the same UserEntity.
 *
 * Examples:
 *   - Alice signed up with email/password → 1 auth_account (provider: 'email')
 *   - Bob signed up with Google, later added password → 2 auth_accounts (google + email)
 *   - Carol signed up with Google, then Facebook → 2 auth_accounts (google + facebook)
 */
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

  /**
   * Which provider this account uses for auth.
   * 'email' = our own email+password system
   * Others = OAuth federated identity providers
   */
  @Column({
    type: 'enum',
    enum: ['email', 'google', 'facebook', 'apple', 'telegram'],
  })
  provider!: AuthProvider;

  /**
   * The user's identifier AT the provider.
   *   - For 'email': same as user.email (lowercase)
   *   - For 'google': Google's sub (subject) claim
   *   - For 'facebook': Facebook's user ID
   *   - For 'apple': Apple's user identifier
   *   - For 'telegram': Telegram user id
   *
   * This is what we match against when a user signs in with that provider.
   */
  @Column({ type: 'varchar', length: 255, name: 'provider_account_id' })
  providerAccountId!: string;

  /**
   * bcrypt hash. Only set when provider === 'email'. NULL for OAuth providers.
   * Excluded from default queries (select: false).
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'password_hash',
    select: false,
  })
  passwordHash!: string | null;

  /**
   * OAuth access token from the provider. Used if we want to call provider APIs
   * later (e.g., fetch updated profile picture from Google).
   * Stored as text because some tokens are very long.
   */
  @Column({
    type: 'text',
    nullable: true,
    name: 'access_token',
    select: false,
  })
  accessToken!: string | null;

  /**
   * OAuth refresh token. Used to get a new access token without user interaction.
   */
  @Column({
    type: 'text',
    nullable: true,
    name: 'refresh_token',
    select: false,
  })
  refreshToken!: string | null;

  /**
   * When the OAuth access token expires. Not relevant for 'email' provider.
   */
  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'token_expires_at',
  })
  tokenExpiresAt!: Date | null;

  /**
   * Snapshot of the raw profile JSON from the provider at signup/last link.
   * Useful for debugging or migrating later (e.g., if we add more fields).
   */
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
