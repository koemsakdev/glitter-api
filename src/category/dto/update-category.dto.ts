import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type { CategoryType } from '../entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  declare slug?: string;

  @ApiProperty({
    description: 'Category name in English',
    example: 'Electronics & Gadgets',
    minLength: 3,
    maxLength: 150,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsOptional()
  declare nameEn?: string;

  @ApiProperty({
    description: 'Category name in Khmer',
    example: 'ឧបករណ៍អេឡិចត្របនិច',
    minLength: 3,
    maxLength: 150,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsOptional()
  declare nameKm?: string;

  @ApiProperty({
    description: 'Description in English',
    example: 'Wide selection of electronics and tech gadgets',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionEn?: string | null;

  @ApiProperty({
    description: 'Description in Khmer',
    example: 'ជម្រើសប្រភេទឧបករណ៍អេឡិចត្របនិច',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionKm?: string | null;

  @ApiProperty({
    description: 'URL to category icon image',
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
  })
  @IsEnum(['main', 'sub', 'featured'])
  @IsOptional()
  declare categoryType?: CategoryType;
}
