import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ProductStatus, ProductType } from '../entities/product.entity';
import type { ImageType } from '../../product-images/entities/product-image.entity';

export class ProductImageSummaryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({
    example: '/upload/products/1728000000000-front.jpg',
  })
  imageUrl!: string;

  @ApiProperty({ nullable: true, example: 'Front view' })
  imageAltTextEn!: string | null;

  @ApiProperty({ nullable: true, example: 'រូបភាពផ្នែកខាងមុខ' })
  imageAltTextKm!: string | null;

  @ApiProperty({
    enum: ['primary', 'gallery', 'thumbnail', 'zoom'],
    example: 'primary',
  })
  imageType!: ImageType;

  @ApiProperty({ example: 0 })
  displayOrder!: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  categoryId!: string;

  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  brandId!: string;

  @ApiProperty({ example: 'GUC-BAG-001' })
  sku!: string;

  @ApiProperty({ example: 'Gucci GG Marmont Small Shoulder Bag' })
  nameEn!: string;

  @ApiProperty({ example: 'កាបូបស្មា Gucci GG Marmont តូច' })
  nameKm!: string;

  @ApiProperty({ example: 'gucci-gg-marmont-small-shoulder-bag' })
  slug!: string;

  @ApiProperty({ nullable: true })
  descriptionEn!: string | null;

  @ApiProperty({ nullable: true })
  descriptionKm!: string | null;

  @ApiProperty({ nullable: true })
  detailsEn!: string | null;

  @ApiProperty({ nullable: true })
  detailsKm!: string | null;

  @ApiProperty({ example: 1890.0 })
  price!: number;

  @ApiProperty({ example: 2100.0, nullable: true })
  originalPrice!: number | null;

  @ApiProperty({
    enum: ['standard', 'featured', 'limited', 'exclusive'],
    example: 'featured',
  })
  productType!: ProductType;

  @ApiProperty({
    enum: ['draft', 'active', 'out_of_stock', 'discontinued', 'archived'],
    example: 'active',
  })
  status!: ProductStatus;

  @ApiProperty({ example: true })
  hasBox!: boolean;

  @ApiProperty({ example: 10 })
  totalStock!: number;

  @ApiProperty({ example: 4.8 })
  averageRating!: number;

  @ApiProperty({ example: 27 })
  reviewCount!: number;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({
    type: [ProductImageSummaryDto],
    description:
      'Product images sorted by displayOrder (populated on detail endpoints)',
  })
  images?: ProductImageSummaryDto[];
}

export class ProductDetailResponseDto {
  @ApiProperty({ type: ProductResponseDto })
  data!: ProductResponseDto;
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ example: 150 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}
