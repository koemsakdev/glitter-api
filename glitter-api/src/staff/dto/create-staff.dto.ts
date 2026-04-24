import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { EmploymentStatus } from '../entities/staff.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Branch UUID that this staff belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  declare branchId: string;

  @ApiProperty({
    description: 'Full name of the staff member',
    example: 'Sovann Sichhoeur',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  declare name: string;

  @ApiProperty({
    description: 'Job role/position',
    example: 'Sales Associate',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  declare role: string;

  @ApiProperty({
    description: 'Phone number with country code',
    example: '+85515711783',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  declare phone: string;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'sovann@glittershop.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    description: 'Employment status',
    example: 'active',
    enum: ['active', 'inactive', 'terminated'],
    required: false,
    default: 'active',
  })
  @IsEnum(['active', 'inactive', 'terminated'])
  @IsOptional()
  declare employmentStatus?: EmploymentStatus;
}
