import { ApiProperty } from '@nestjs/swagger';
import type { BadgeType } from '../entities/product-badge.entity';

export class ProductBadgeResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  productId!: string;

  @ApiProperty({
    enum: [
      'new',
      'sale',
      'bestseller',
      'limited',
      'exclusive',
      'hot',
      'featured',
      'coming_soon',
    ],
    example: 'new',
  })
  badgeType!: BadgeType;

  @ApiProperty({ example: 'Just Arrived', nullable: true })
  badgeLabelEn!: string | null;

  @ApiProperty({ example: 'ទើបតែមកដល់', nullable: true })
  badgeLabelKm!: string | null;

  @ApiProperty({ example: '#FF3B30', nullable: true })
  badgeIconColor!: string | null;

  @ApiProperty({ example: '2026-05-01T00:00:00.000Z', nullable: true })
  badgeStartDate!: Date | null;

  @ApiProperty({ example: '2026-05-31T23:59:59.000Z', nullable: true })
  badgeEndDate!: Date | null;

  @ApiProperty({
    example: true,
    description:
      'True if current time falls within the badge window (or no window set)',
  })
  isActive!: boolean;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  createdAt!: Date;
}

export class ProductBadgeDetailResponseDto {
  @ApiProperty({ type: ProductBadgeResponseDto })
  data!: ProductBadgeResponseDto;
}

export class ProductBadgeListResponseDto {
  @ApiProperty({ type: [ProductBadgeResponseDto] })
  data!: ProductBadgeResponseDto[];

  @ApiProperty({ example: 3 })
  total!: number;
}
