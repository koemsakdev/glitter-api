import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BulkVariantItemDto {
  @ApiProperty({
    description: 'Variant SKU (unique)',
    example: 'GUC-BAG-001-SM-BLK',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  variantSku!: string;

  @ApiPropertyOptional({ example: 'Small' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @ApiPropertyOptional({ example: 'Black' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: '#000000' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorHex?: string;

  @ApiPropertyOptional({ example: 5, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityInStock?: number;

  @ApiPropertyOptional({ example: 1950.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceOverride?: number;
}

export class BulkCreateVariantsDto {
  @ApiProperty({
    description: 'Product UUID to create variants for',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    description: 'Array of variants to create',
    type: [BulkVariantItemDto],
    example: [
      {
        variantSku: 'GUC-BAG-001-SM-BLK',
        size: 'Small',
        color: 'Black',
        colorHex: '#000000',
        quantityInStock: 5,
      },
      {
        variantSku: 'GUC-BAG-001-SM-WHT',
        size: 'Small',
        color: 'White',
        colorHex: '#FFFFFF',
        quantityInStock: 3,
      },
      {
        variantSku: 'GUC-BAG-001-MD-BLK',
        size: 'Medium',
        color: 'Black',
        colorHex: '#000000',
        quantityInStock: 2,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkVariantItemDto)
  variants!: BulkVariantItemDto[];
}
