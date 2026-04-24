import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../auth/helpers/password.helper';
import { AuthAccountEntity } from '../users/entities/auth-account.entity';
import { UserEntity } from '../users/entities/user.entity';

/**
 * On module init, check if any super_admin exists.
 * If none, create one using credentials from .env.
 *
 * This runs once at app startup. Safe to leave on — it only creates a user
 * if zero super_admins exist in the DB.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthAccountEntity)
    private readonly authAccountRepository: Repository<AuthAccountEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin(): Promise<void> {
    const existingSuperAdmin = await this.userRepository.findOne({
      where: { role: 'super_admin' },
    });

    if (existingSuperAdmin) {
      this.logger.log(
        `Super admin exists: ${existingSuperAdmin.email} — skipping seed`,
      );
      return;
    }

    const email = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const password = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const fullName =
      this.configService.get<string>('SEED_ADMIN_NAME') ?? 'Shop Owner';

    if (!email || !password) {
      this.logger.warn(
        'SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set — skipping seed',
      );
      return;
    }

    try {
      const user = this.userRepository.create({
        email: email.toLowerCase(),
        phoneNumber: null,
        fullName,
        profileImageUrl: null,
        profileImageSource: 'none',
        role: 'super_admin',
        branchId: null,
        accountStatus: 'active',
        emailVerifiedAt: new Date(),
        phoneVerifiedAt: null,
        isProfileComplete: false,
        tokenVersion: 0,
      });
      const savedUser = await this.userRepository.save(user);

      const passwordHash = await hashPassword(password);
      const authAccount = this.authAccountRepository.create({
        userId: savedUser.id,
        provider: 'email',
        providerAccountId: email.toLowerCase(),
        passwordHash,
      });
      await this.authAccountRepository.save(authAccount);

      this.logger.log('─────────────────────────────────────────────────');
      this.logger.log('✅ Super admin seeded successfully');
      this.logger.log(`   Email:    ${email}`);
      this.logger.log(`   Password: ${password}`);
      this.logger.log('   ⚠️  Change this password after first login!');
      this.logger.log('─────────────────────────────────────────────────');
    } catch (error) {
      this.logger.error('Failed to seed super admin', error);
    }
  }
}
