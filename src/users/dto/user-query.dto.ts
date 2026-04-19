import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import type { AccountStatus } from '../entities/user.entity';
import type { AuthProvider } from '../entities/auth-account.entity';

export class UserQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Search by email, phone, or name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['active', 'suspended', 'deleted'] })
  @IsOptional()
  @IsEnum(['active', 'suspended', 'deleted'])
  accountStatus?: AccountStatus;

  @ApiPropertyOptional({
    enum: ['email', 'google', 'facebook', 'apple', 'telegram'],
    description: 'Filter by users who signed up with this provider',
  })
  @IsOptional()
  @IsEnum(['email', 'google', 'facebook', 'apple', 'telegram'])
  provider?: AuthProvider;
}
