import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hashPassword } from '../auth/helpers/password.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserEntity } from './entities/user.entity';
import {
  AuthAccountEntity,
  AuthProvider,
} from './entities/auth-account.entity';
import {
  UserDetailResponse,
  UserListResponse,
  UserResponse,
} from './types/user-response.type';

/**
 * Data needed to create/link an OAuth account.
 * The Auth service builds this from each provider's callback response.
 */
export interface OAuthProfileData {
  provider: AuthProvider;
  providerAccountId: string;
  email: string | null;
  fullName: string;
  profileImageUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  rawProfile: Record<string, unknown>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthAccountEntity)
    private readonly authAccountRepository: Repository<AuthAccountEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // ==========================================================================
  // ADMIN-FACING CRUD
  // ==========================================================================

  async create(dto: CreateUserDto): Promise<UserDetailResponse> {
    if (dto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingEmail !== null) {
        throw new ConflictException(
          `Email "${dto.email}" is already registered`,
        );
      }
    }

    if (dto.phoneNumber) {
      const existingPhone = await this.userRepository.findOne({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (existingPhone !== null) {
        throw new ConflictException(
          `Phone "${dto.phoneNumber}" is already registered`,
        );
      }
    }

    const entity = this.userRepository.create({
      email: dto.email ? dto.email.toLowerCase() : null,
      phoneNumber: dto.phoneNumber ?? null,
      fullName: dto.fullName,
      profileImageUrl: dto.profileImageUrl ?? null,
      accountStatus: dto.accountStatus ?? 'active',
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      tokenVersion: 0,
    });
    entity.isProfileComplete = this.computeProfileComplete(entity);

    const saved = await this.userRepository.save(entity);
    return { data: await this.toResponseWithProviders(saved) };
  }

  async findAll(query: UserQueryDto): Promise<UserListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.authAccounts', 'authAccounts');

    if (query.accountStatus) {
      qb.andWhere('user.accountStatus = :accountStatus', {
        accountStatus: query.accountStatus,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(user.email ILIKE :search OR user.phoneNumber ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.provider) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM auth_accounts aa WHERE aa.user_id = user.id AND aa.provider = :provider)',
        { provider: query.provider },
      );
    }

    qb.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users.map((u: UserEntity) => this.toResponse(u)),
      total: Number(total),
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<UserDetailResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['authAccounts'],
    });

    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { data: this.toResponse(user) };
  }

  async findByEmail(email: string): Promise<UserDetailResponse> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['authAccounts'],
    });

    if (user === null) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return { data: this.toResponse(user) };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDetailResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['authAccounts'],
    });

    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (existing !== null && existing.id !== id) {
        throw new ConflictException(
          `Email "${dto.email}" is already registered`,
        );
      }
      user.email = dto.email.toLowerCase();
      user.emailVerifiedAt = null; // re-verification required on email change
    }

    if (dto.phoneNumber && dto.phoneNumber !== user.phoneNumber) {
      const existing = await this.userRepository.findOne({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (existing !== null && existing.id !== id) {
        throw new ConflictException(
          `Phone "${dto.phoneNumber}" is already registered`,
        );
      }
      user.phoneNumber = dto.phoneNumber;
      user.phoneVerifiedAt = null;
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.profileImageUrl !== undefined)
      user.profileImageUrl = dto.profileImageUrl;
    if (dto.accountStatus !== undefined) user.accountStatus = dto.accountStatus;

    user.isProfileComplete = this.computeProfileComplete(user);

    const updated = await this.userRepository.save(user);
    return { data: await this.toResponseWithProviders(updated) };
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.accountStatus = 'deleted';
    user.tokenVersion += 1;
    await this.userRepository.save(user);
  }

  async hardDelete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }

  // ==========================================================================
  // AUTH-FACING METHODS (called by AuthService)
  // ==========================================================================

  /**
   * Register a new user with email + password.
   * Creates both UserEntity and an AuthAccountEntity with provider='email'.
   */
  async registerWithEmail(params: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
  }): Promise<UserEntity> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserEntity);
      const authRepo = manager.getRepository(AuthAccountEntity);

      const normalizedEmail = params.email.toLowerCase();

      // Check for existing user with this email
      const existingUser = await userRepo.findOne({
        where: { email: normalizedEmail },
      });
      if (existingUser !== null) {
        throw new ConflictException(
          `Email "${params.email}" is already registered`,
        );
      }

      if (params.phoneNumber) {
        const existingPhone = await userRepo.findOne({
          where: { phoneNumber: params.phoneNumber },
        });
        if (existingPhone !== null) {
          throw new ConflictException(
            `Phone "${params.phoneNumber}" is already registered`,
          );
        }
      }

      const user = userRepo.create({
        email: normalizedEmail,
        phoneNumber: params.phoneNumber ?? null,
        fullName: params.fullName,
        accountStatus: 'active',
        emailVerifiedAt: null,
        phoneVerifiedAt: null,
        tokenVersion: 0,
      });
      user.isProfileComplete = this.computeProfileComplete(user);

      const savedUser = await userRepo.save(user);

      const passwordHash = await hashPassword(params.password);
      const authAccount = authRepo.create({
        userId: savedUser.id,
        provider: 'email',
        providerAccountId: normalizedEmail,
        passwordHash,
      });
      await authRepo.save(authAccount);

      return savedUser;
    });
  }

  /**
   * Find-or-create a user from an OAuth provider's profile.
   * Handles three cases:
   *   1. User already has this provider linked → just update tokens, return user
   *   2. Email matches an existing user → link the new provider to that user
   *   3. Brand new user → create UserEntity + AuthAccountEntity together
   */
  async findOrCreateFromOAuth(
    profile: OAuthProfileData,
  ): Promise<{ user: UserEntity; isNewUser: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserEntity);
      const authRepo = manager.getRepository(AuthAccountEntity);

      // Case 1: provider account already linked
      const existingAuth = await authRepo.findOne({
        where: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      });
      if (existingAuth !== null) {
        // Refresh stored tokens
        existingAuth.accessToken = profile.accessToken;
        existingAuth.refreshToken = profile.refreshToken;
        existingAuth.tokenExpiresAt = profile.tokenExpiresAt;
        existingAuth.providerProfile = profile.rawProfile;
        await authRepo.save(existingAuth);

        const user = await userRepo.findOne({
          where: { id: existingAuth.userId },
        });
        if (user === null) {
          throw new NotFoundException(
            'Linked user not found — data integrity issue',
          );
        }
        return { user, isNewUser: false };
      }

      // Case 2: email matches an existing user → link this provider
      if (profile.email) {
        const existingUser = await userRepo.findOne({
          where: { email: profile.email.toLowerCase() },
        });
        if (existingUser !== null) {
          const newAuth = authRepo.create({
            userId: existingUser.id,
            provider: profile.provider,
            providerAccountId: profile.providerAccountId,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            tokenExpiresAt: profile.tokenExpiresAt,
            providerProfile: profile.rawProfile,
          });
          await authRepo.save(newAuth);

          // Mark email verified since OAuth provider confirmed it
          if (existingUser.emailVerifiedAt === null) {
            existingUser.emailVerifiedAt = new Date();
            await userRepo.save(existingUser);
          }

          return { user: existingUser, isNewUser: false };
        }
      }

      // Case 3: brand new user
      const newUser = userRepo.create({
        email: profile.email ? profile.email.toLowerCase() : null,
        emailVerifiedAt: profile.email ? new Date() : null,
        phoneNumber: null,
        phoneVerifiedAt: null,
        fullName: profile.fullName,
        profileImageUrl: profile.profileImageUrl,
        accountStatus: 'active',
        tokenVersion: 0,
      });
      newUser.isProfileComplete = this.computeProfileComplete(newUser);

      const savedUser = await userRepo.save(newUser);

      const newAuth = authRepo.create({
        userId: savedUser.id,
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
        tokenExpiresAt: profile.tokenExpiresAt,
        providerProfile: profile.rawProfile,
      });
      await authRepo.save(newAuth);

      return { user: savedUser, isNewUser: true };
    });
  }

  /**
   * Find a user's email auth account WITH its passwordHash.
   * Used by AuthService.validateEmailPassword().
   */
  async findEmailAuthAccount(
    email: string,
  ): Promise<{ user: UserEntity; authAccount: AuthAccountEntity } | null> {
    const authAccount = await this.authAccountRepository
      .createQueryBuilder('auth')
      .addSelect('auth.passwordHash')
      .leftJoinAndSelect('auth.user', 'user')
      .where('auth.provider = :provider', { provider: 'email' })
      .andWhere('auth.providerAccountId = :email', {
        email: email.toLowerCase(),
      })
      .getOne();

    if (authAccount === null || !authAccount.user) {
      return null;
    }

    return { user: authAccount.user, authAccount };
  }

  /**
   * Link a new password (email provider) to an existing user.
   * Used by users who signed up with OAuth and want to add email/password login.
   */
  async addEmailPassword(userId: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user === null) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    if (user.email === null) {
      throw new BadRequestException(
        'Cannot add password: user has no email address. Add an email first.',
      );
    }

    const existing = await this.authAccountRepository.findOne({
      where: { userId, provider: 'email' },
    });
    if (existing !== null) {
      throw new ConflictException(
        'Email/password login is already set up. Use change-password to update it.',
      );
    }

    const passwordHash = await hashPassword(password);
    const authAccount = this.authAccountRepository.create({
      userId,
      provider: 'email',
      providerAccountId: user.email,
      passwordHash,
    });
    await this.authAccountRepository.save(authAccount);
  }

  /**
   * Change password for a user's email auth account.
   * Also bumps tokenVersion to invalidate existing JWTs.
   */
  async changePassword(userId: string, newPassword: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const authRepo = manager.getRepository(AuthAccountEntity);
      const userRepo = manager.getRepository(UserEntity);

      const emailAuth = await authRepo.findOne({
        where: { userId, provider: 'email' },
      });

      if (emailAuth === null) {
        throw new NotFoundException(
          'User has no email/password account to change',
        );
      }

      emailAuth.passwordHash = await hashPassword(newPassword);
      await authRepo.save(emailAuth);

      await userRepo.increment({ id: userId }, 'tokenVersion', 1);
    });
  }

  /**
   * Unlink an OAuth provider from a user.
   * Rejected if it's their ONLY auth method (would lock them out).
   */
  async unlinkProvider(userId: string, provider: AuthProvider): Promise<void> {
    const allAccounts = await this.authAccountRepository.find({
      where: { userId },
    });

    if (allAccounts.length <= 1) {
      throw new BadRequestException(
        'Cannot remove your only login method. Link another method first.',
      );
    }

    const account = allAccounts.find((a) => a.provider === provider);
    if (account === undefined) {
      throw new NotFoundException(`No ${provider} account linked to this user`);
    }

    await this.authAccountRepository.remove(account);
  }

  /**
   * For JWT validation: load user by ID, ensure still active, returns null otherwise.
   */
  async findActiveUserById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id, accountStatus: 'active' },
    });
    return user;
  }

  async getTokenVersion(id: string): Promise<number | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'tokenVersion'],
    });
    return user?.tokenVersion ?? null;
  }

  async invalidateTokens(id: string): Promise<void> {
    await this.userRepository.increment({ id }, 'tokenVersion', 1);
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Decide if the user has everything needed to place an order.
   * Current rule: phone number + full name are required. Email is optional.
   */
  private computeProfileComplete(user: UserEntity): boolean {
    return (
      user.fullName !== null &&
      user.fullName.trim().length > 0 &&
      user.phoneNumber !== null &&
      user.phoneNumber.trim().length > 0
    );
  }

  private computeMissingFields(
    user: UserEntity,
  ): Array<'phoneNumber' | 'email' | 'fullName'> {
    const missing: Array<'phoneNumber' | 'email' | 'fullName'> = [];
    if (!user.fullName || user.fullName.trim().length === 0) {
      missing.push('fullName');
    }
    if (!user.phoneNumber || user.phoneNumber.trim().length === 0) {
      missing.push('phoneNumber');
    }
    // Email is not required but useful for receipts — only include if we care
    // Leaving it out by default since our rule says phone is enough.
    return missing;
  }

  private toResponse(entity: UserEntity): UserResponse {
    const providers: AuthProvider[] =
      entity.authAccounts?.map((a) => a.provider) ?? [];

    return {
      id: entity.id,
      email: entity.email,
      emailVerifiedAt: entity.emailVerifiedAt,
      phoneNumber: entity.phoneNumber,
      phoneVerifiedAt: entity.phoneVerifiedAt,
      fullName: entity.fullName,
      profileImageUrl: entity.profileImageUrl,
      accountStatus: entity.accountStatus,
      isProfileComplete: entity.isProfileComplete,
      missingFields: this.computeMissingFields(entity),
      linkedProviders: providers,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Refetches the user with authAccounts relation loaded, then converts.
   * Used after create/update where authAccounts may not be hydrated.
   */
  private async toResponseWithProviders(
    entity: UserEntity,
  ): Promise<UserResponse> {
    const withAccounts = await this.userRepository.findOne({
      where: { id: entity.id },
      relations: ['authAccounts'],
    });
    return this.toResponse(withAccounts ?? entity);
  }
}
