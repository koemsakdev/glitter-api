import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type { CategoryType } from '../entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  declare slug: string;

  @ApiProperty({
    description: 'Category name in English',
    example: 'Electronics & Gadgets',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  declare nameEn: string;

  @ApiProperty({
    description: 'Category name in Khmer',
    example: 'ឧបករណ៍អេឡិចត្របនិច',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  declare nameKm: string;

  @ApiProperty({
    description: 'Description in English (optional)',
    example: 'Wide selection of electronics and tech gadgets',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionEn?: string | null;

  @ApiProperty({
    description: 'Description in Khmer (optional)',
    example: 'ជម្រើសប្រភេទឧបករណ៍អេឡិចត្របនិច',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionKm?: string | null;

  @ApiProperty({
    description: 'URL to category icon image (optional)',
    example: 'https://cdn.glittershop.com/icons/electronics.png',
    required: false,
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  declare iconUrl?: string | null;

  @ApiProperty({
    description: 'Display order in category list',
    example: 1,
    minimum: 0,
    required: false,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  declare displayOrder?: number;

  @ApiProperty({
    description: 'Category type/classification',
    example: 'main',
    enum: ['main', 'sub', 'featured'],
    required: false,
    default: 'main',
  })
  @IsEnum(['main', 'sub', 'featured'])
  @IsOptional()
  declare categoryType?: CategoryType;
}
