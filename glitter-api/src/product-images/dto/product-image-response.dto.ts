import { ApiProperty } from '@nestjs/swagger';
import type { ImageType } from '../entities/product-image.entity';

export class ProductImageResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  productId!: string;

  @ApiProperty({
    example: '/upload/products/1728000000000-gucci-marmont-front.jpg',
  })
  imageUrl!: string;

  @ApiProperty({
    example: 'Front view of Gucci GG Marmont shoulder bag',
    nullable: true,
  })
  imageAltTextEn!: string | null;

  @ApiProperty({
    example: 'រូបភាពផ្នែកខាងមុខនៃកាបូប Gucci GG Marmont',
    nullable: true,
  })
  imageAltTextKm!: string | null;

  @ApiProperty({
    enum: ['primary', 'gallery', 'thumbnail', 'zoom'],
    example: 'primary',
  })
  imageType!: ImageType;

  @ApiProperty({ example: 0 })
  displayOrder!: number;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  createdAt!: Date;
}

export class ProductImageDetailResponseDto {
  @ApiProperty({ type: ProductImageResponseDto })
  data!: ProductImageResponseDto;
}

export class ProductImageListResponseDto {
  @ApiProperty({ type: [ProductImageResponseDto] })
  data!: ProductImageResponseDto[];

  @ApiProperty({ example: 5 })
  total!: number;
}

export class ProductImageBulkResponseDto {
  @ApiProperty({ type: [ProductImageResponseDto] })
  data!: ProductImageResponseDto[];

  @ApiProperty({ example: 5 })
  total!: number;

  @ApiProperty({ example: 5 })
  uploaded!: number;
}
