import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  productId!: string;

  @ApiProperty({ example: 'GUC-BAG-001-SM-BLK' })
  variantSku!: string;

  @ApiProperty({ example: 'Small', nullable: true })
  size!: string | null;

  @ApiProperty({ example: 'Black', nullable: true })
  color!: string | null;

  @ApiProperty({ example: '#000000', nullable: true })
  colorHex!: string | null;

  @ApiProperty({ example: 5 })
  quantityInStock!: number;

  @ApiProperty({ example: 1950.0, nullable: true })
  priceOverride!: number | null;

  @ApiProperty({ example: 1950.0, required: false })
  effectivePrice?: number;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  updatedAt!: Date;
}

export class ProductVariantDetailResponseDto {
  @ApiProperty({ type: ProductVariantResponseDto })
  data!: ProductVariantResponseDto;
}

export class ProductVariantListResponseDto {
  @ApiProperty({ type: [ProductVariantResponseDto] })
  data!: ProductVariantResponseDto[];

  @ApiProperty({ example: 6 })
  total!: number;
}

export class ProductVariantBulkResponseDto {
  @ApiProperty({ type: [ProductVariantResponseDto] })
  data!: ProductVariantResponseDto[];

  @ApiProperty({ example: 6 })
  total!: number;

  @ApiProperty({ example: 6 })
  created!: number;
}

// --- Options response ---

export class ColorOptionDto {
  @ApiProperty({ example: 'Black' })
  color!: string;

  @ApiProperty({ example: '#000000', nullable: true })
  colorHex!: string | null;

  @ApiProperty({ example: ['Small', 'Medium', 'Large'], type: [String] })
  sizes!: string[];
}

export class SizeOptionDto {
  @ApiProperty({ example: 'Small' })
  size!: string;

  @ApiProperty({ example: ['Black', 'White', 'Red'], type: [String] })
  colors!: string[];
}

export class VariantOptionsDataDto {
  @ApiProperty({
    example: false,
    description:
      'True when the product has no real variants (just a default null/null variant)',
  })
  hasSingleVariant!: boolean;

  @ApiProperty({ type: [ColorOptionDto] })
  colors!: ColorOptionDto[];

  @ApiProperty({ type: [SizeOptionDto] })
  sizes!: SizeOptionDto[];
}

export class ProductVariantOptionsResponseDto {
  @ApiProperty({ type: VariantOptionsDataDto })
  data!: VariantOptionsDataDto;
}
