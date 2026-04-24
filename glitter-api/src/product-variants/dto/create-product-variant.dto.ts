import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Product UUID (must exist)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    description: 'Variant SKU (unique across all variants)',
    example: 'GUC-BAG-001-SM-BLK',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  variantSku!: string;

  @ApiPropertyOptional({
    description: 'Size label (e.g., Small, Medium, 38, XL)',
    example: 'Small',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @ApiPropertyOptional({
    description: 'Color name',
    example: 'Black',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    description: 'Color hex code (7 chars: #RRGGBB)',
    example: '#000000',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'colorHex must be a valid 7-character hex code (e.g., #FF0000)',
  })
  colorHex?: string;

  @ApiPropertyOptional({
    description: 'Initial stock quantity (default: 0)',
    example: 5,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityInStock?: number;

  @ApiPropertyOptional({
    description:
      'Price override (overrides the parent product price for this specific variant)',
    example: 1950.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceOverride?: number;
}
