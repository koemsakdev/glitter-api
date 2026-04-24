import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// Update DTO omits productId (can't reassign a variant to a different product after creation).
// Everything is optional so clients can patch individual fields.
export class UpdateProductVariantDto {
  @ApiPropertyOptional({
    description: 'Variant SKU (unique)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  variantSku?: string;

  @ApiPropertyOptional({ description: 'Size label' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @ApiPropertyOptional({ description: 'Color name' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    description: 'Color hex code (#RRGGBB)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'colorHex must be a valid 7-character hex code (e.g., #FF0000)',
  })
  colorHex?: string;

  @ApiPropertyOptional({ description: 'Stock quantity' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityInStock?: number;

  @ApiPropertyOptional({
    description: 'Price override (null to clear and use parent product price)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceOverride?: number;
}
