import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import type { AccountStatus } from '../entities/user.entity';

/**
 * Used both by:
 *   - Users updating their own profile (PATCH /api/users/me)
 *   - Admins updating user records (PATCH /api/users/:id)
 *   - The "complete your profile" modal filling in missing phone/email
 */
export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(\+?855|0)\d{7,10}$/)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profileImageUrl?: string;

  /**
   * Admin-only. User-facing endpoints ignore this field.
   * Enforcement lives in the controller layer.
   */
  @ApiPropertyOptional({ enum: ['active', 'suspended', 'deleted'] })
  @IsOptional()
  @IsEnum(['active', 'suspended', 'deleted'])
  accountStatus?: AccountStatus;
}
