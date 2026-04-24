import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ProductStatus, ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({
    description: 'Category UUID (must exist)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId!: string;

  @ApiProperty({
    description: 'Brand UUID (must exist)',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  brandId!: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (unique)',
    example: 'GUC-BAG-001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiProperty({
    description: 'Product name in English',
    example: 'Gucci GG Marmont Small Matelassé Shoulder Bag',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameEn!: string;

  @ApiProperty({
    description: 'Product name in Khmer',
    example: 'កាបូបស្មា Gucci GG Marmont តូច',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameKm!: string;

  @ApiProperty({
    description: 'URL-friendly slug (unique)',
    example: 'gucci-gg-marmont-small-shoulder-bag',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug!: string;

  @ApiPropertyOptional({
    description: 'Short description in English',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    description: 'Short description in Khmer',
  })
  @IsOptional()
  @IsString()
  descriptionKm?: string;

  @ApiPropertyOptional({
    description: 'Detailed product info in English (materials, care, etc.)',
  })
  @IsOptional()
  @IsString()
  detailsEn?: string;

  @ApiPropertyOptional({
    description: 'Detailed product info in Khmer',
  })
  @IsOptional()
  @IsString()
  detailsKm?: string;

  @ApiProperty({
    description: 'Current selling price',
    example: 1890.0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Original price before discount (for sale display)',
    example: 2100.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({
    description: 'Product type',
    enum: ['standard', 'featured', 'limited', 'exclusive'],
    default: 'standard',
  })
  @IsOptional()
  @IsEnum(['standard', 'featured', 'limited', 'exclusive'])
  productType?: ProductType;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ['draft', 'active', 'out_of_stock', 'discontinued', 'archived'],
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(['draft', 'active', 'out_of_stock', 'discontinued', 'archived'])
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Whether the product comes with its original box',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasBox?: boolean;

  // NOTE: totalStock is intentionally NOT exposed here.
  // Stock is the source-of-truth responsibility of ProductVariantEntity.
  // Use variant endpoints (POST/PATCH /api/product-variants) to manage stock.
  // product.totalStock is auto-computed as SUM(variant.quantityInStock).
}
