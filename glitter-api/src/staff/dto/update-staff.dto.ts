import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { EmploymentStatus } from '../entities/staff.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStaffDto {
  @ApiProperty({
    description: 'Full name of the staff member',
    example: 'Sovann Sichhoeur',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  declare name?: string;

  @ApiProperty({
    description: 'Job role/position',
    example: 'Senior Sales Associate',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  declare role?: string;

  @ApiProperty({
    description: 'Phone number with country code',
    example: '+85515711783',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  declare phone?: string;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'sovann@glittershop.com',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  declare email?: string;

  @ApiProperty({
    description: 'Employment status',
    example: 'active',
    enum: ['active', 'inactive', 'terminated'],
    required: false,
  })
  @IsEnum(['active', 'inactive', 'terminated'])
  @IsOptional()
  declare employmentStatus?: EmploymentStatus;
}
