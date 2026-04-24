import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { CategoryType } from '../entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'bags',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  declare slug?: string;

  @ApiProperty({
    description: 'Category name in English',
    example: 'Bags & Accessories',
    minLength: 2,
    maxLength: 150,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  @IsOptional()
  declare nameEn?: string;

  @ApiProperty({
    description: 'Category name in Khmer',
    example: 'កាបូប និងឧបករណ៍',
    minLength: 2,
    maxLength: 150,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  @IsOptional()
  declare nameKm?: string;

  @ApiProperty({
    description: 'Description in English',
    example: 'Stylish bags and handbags from top brands',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionEn?: string | null;

  @ApiProperty({
    description: 'Description in Khmer',
    example: 'កាបូបស្ទាប់ល្អ និងសម្លៀកបំពាក់ពីម៉ាកលំដាប់កំពូល',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionKm?: string | null;

  @ApiProperty({
    description: 'Display order in category list',
    example: 1,
    minimum: 0,
    required: false,
  })
  @Type(() => Number)
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
