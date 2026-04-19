import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import type { AccountStatus } from '../entities/user.entity';

/**
 * Admin endpoint for creating users. For self-signup, customers use
 * POST /api/auth/register (email+password) or the OAuth flows.
 * Both the create endpoint and OAuth callbacks ultimately go through UsersService.createForAuth().
 */
export class CreateUserDto {
  @ApiPropertyOptional({
    example: 'customer@example.com',
    description: 'Email (optional — some social sign-ups may not provide one)',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    example: '+85512345678',
    description:
      'Cambodian phone number (optional at creation, required before ordering)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\+?855|0)\d{7,10}$/, {
    message:
      'phoneNumber must be a valid Cambodian number (e.g., +85512345678 or 012345678)',
  })
  phoneNumber?: string;

  @ApiProperty({ example: 'Koemsak Sovann' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profileImageUrl?: string;

  @ApiPropertyOptional({
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'suspended', 'deleted'])
  accountStatus?: AccountStatus;
}
