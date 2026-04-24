import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import type { ImageType } from '../entities/product-image.entity';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'Product UUID (must exist)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId!: string;

  @ApiPropertyOptional({
    description: 'Alt text in English (for accessibility/SEO)',
    example: 'Front view of Gucci GG Marmont shoulder bag in black leather',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageAltTextEn?: string;

  @ApiPropertyOptional({
    description: 'Alt text in Khmer',
    example: 'រូបភាពផ្នែកខាងមុខនៃកាបូប Gucci GG Marmont ស្បែកខ្មៅ',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageAltTextKm?: string;

  @ApiPropertyOptional({
    description: 'Image type',
    enum: ['primary', 'gallery', 'thumbnail', 'zoom'],
    default: 'gallery',
  })
  @IsOptional()
  @IsEnum(['primary', 'gallery', 'thumbnail', 'zoom'])
  imageType?: ImageType;

  @ApiPropertyOptional({
    description: 'Display order (lower = shown first)',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
