import { ApiProperty } from '@nestjs/swagger';

export class VariantSummaryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'GUC-BAG-001-SM-BLK' })
  variantSku!: string;

  @ApiProperty({ example: 'Small', nullable: true })
  size!: string | null;

  @ApiProperty({ example: 'Black', nullable: true })
  color!: string | null;

  @ApiProperty({ example: '#000000', nullable: true })
  colorHex!: string | null;
}

export class BranchSummaryDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  id!: string;

  @ApiProperty({ example: 'PP-TTP-001' })
  branchCode!: string;

  @ApiProperty({ example: 'Tuol Tompoung Branch' })
  branchNameEn!: string;

  @ApiProperty({ example: 'សាខាទួលទំពូង' })
  branchNameKm!: string;
}

export class ProductSummaryDto {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  id!: string;

  @ApiProperty({ example: 'GUC-BAG-001' })
  sku!: string;

  @ApiProperty({ example: 'Gucci GG Marmont' })
  nameEn!: string;

  @ApiProperty({ example: 'កាបូប Gucci GG Marmont' })
  nameKm!: string;

  @ApiProperty({ example: 'gucci-gg-marmont' })
  slug!: string;
}

export class InventoryBranchResponseDto {
  @ApiProperty({ example: '880e8400-e29b-41d4-a716-446655440003' })
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  productVariantId!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  branchId!: string;

  @ApiProperty({ example: 5 })
  quantityAvailable!: number;

  @ApiProperty({ example: 1 })
  quantityReserved!: number;

  @ApiProperty({ example: 0 })
  quantityDamaged!: number;

  @ApiProperty({
    example: 6,
    description: 'Computed: available + reserved + damaged',
  })
  totalQuantity!: number;

  @ApiProperty({ type: VariantSummaryDto, required: false })
  variant?: VariantSummaryDto;

  @ApiProperty({ type: BranchSummaryDto, required: false })
  branch?: BranchSummaryDto;

  @ApiProperty({ type: ProductSummaryDto, required: false })
  product?: ProductSummaryDto;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  updatedAt!: Date;
}

export class InventoryBranchDetailResponseDto {
  @ApiProperty({ type: InventoryBranchResponseDto })
  data!: InventoryBranchResponseDto;
}

export class InventoryBranchListResponseDto {
  @ApiProperty({ type: [InventoryBranchResponseDto] })
  data!: InventoryBranchResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}

// --- Product availability across branches ---

export class BranchAvailabilityDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  branchId!: string;

  @ApiProperty({ example: 'PP-TTP-001' })
  branchCode!: string;

  @ApiProperty({ example: 'Tuol Tompoung Branch' })
  branchNameEn!: string;

  @ApiProperty({ example: 'សាខាទួលទំពូង' })
  branchNameKm!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  variantId!: string;

  @ApiProperty({ example: 'GUC-BAG-001-SM-BLK' })
  variantSku!: string;

  @ApiProperty({ example: 'Small', nullable: true })
  size!: string | null;

  @ApiProperty({ example: 'Black', nullable: true })
  color!: string | null;

  @ApiProperty({ example: '#000000', nullable: true })
  colorHex!: string | null;

  @ApiProperty({ example: 3 })
  quantityAvailable!: number;

  @ApiProperty({ example: 0 })
  quantityReserved!: number;

  @ApiProperty({ example: 0 })
  quantityDamaged!: number;

  @ApiProperty({ example: 3 })
  totalQuantity!: number;
}

export class ProductAvailabilityDataDto {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  productId!: string;

  @ApiProperty({ example: 'Gucci GG Marmont' })
  nameEn!: string;

  @ApiProperty({ example: 'កាបូប Gucci GG Marmont' })
  nameKm!: string;

  @ApiProperty({ type: [BranchAvailabilityDto] })
  branches!: BranchAvailabilityDto[];
}

export class ProductAvailabilityResponseDto {
  @ApiProperty({ type: ProductAvailabilityDataDto })
  data!: ProductAvailabilityDataDto;
}

// --- Branch summary ---

export class BranchInventorySummaryDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  branchId!: string;

  @ApiProperty({ example: 24 })
  totalVariants!: number;

  @ApiProperty({ example: 156 })
  totalUnitsAvailable!: number;

  @ApiProperty({ example: 3 })
  totalUnitsReserved!: number;

  @ApiProperty({ example: 2 })
  totalUnitsDamaged!: number;
}

export class BranchInventorySummaryResponseDto {
  @ApiProperty({ type: BranchInventorySummaryDto })
  data!: BranchInventorySummaryDto;
}
