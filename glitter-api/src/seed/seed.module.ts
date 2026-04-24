import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAccountEntity } from '../users/entities/auth-account.entity';
import { UserEntity } from '../users/entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AuthAccountEntity])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
