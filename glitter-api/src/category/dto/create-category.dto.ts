import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { CategoryType } from '../entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'bags',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  declare slug: string;

  @ApiProperty({
    description: 'Category name in English',
    example: 'Bags',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  declare nameEn: string;

  @ApiProperty({
    description: 'Category name in Khmer',
    example: 'កាបូប',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  declare nameKm: string;

  @ApiProperty({
    description: 'Description in English (optional)',
    example: 'Stylish bags and handbags from top brands',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  declare descriptionEn?: string | null;

  @ApiProperty({
    description: 'Description in Khmer (optional)',
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
    default: 0,
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
    default: 'main',
  })
  @IsEnum(['main', 'sub', 'featured'])
  @IsOptional()
  declare categoryType?: CategoryType;
}
