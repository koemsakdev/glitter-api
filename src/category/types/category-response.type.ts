import { ApiProperty } from '@nestjs/swagger';
import type { CategoryType } from '../entities/category.entity';

export class CategoryResponse {
  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  readonly id!: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'electronics',
  })
  readonly slug!: string;

  @ApiProperty({
    description: 'Category name in English',
    example: 'Electronics & Gadgets',
  })
  readonly nameEn!: string;

  @ApiProperty({
    description: 'Category name in Khmer',
    example: 'ឧបករណ៍អេឡិចត្របនិច',
  })
  readonly nameKm!: string;

  @ApiProperty({
    description: 'Description in English',
    example: 'Wide selection of electronics and tech gadgets',
    nullable: true,
  })
  readonly descriptionEn!: string | null;

  @ApiProperty({
    description: 'Description in Khmer',
    example: 'ជម្រើសប្រភេទឧបករណ៍អេឡិចត្របនិច',
    nullable: true,
  })
  readonly descriptionKm!: string | null;

  @ApiProperty({
    description: 'Icon URL',
    example: 'https://cdn.glittershop.com/icons/electronics.png',
    nullable: true,
  })
  readonly iconUrl!: string | null;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  readonly displayOrder!: number;

  @ApiProperty({
    description: 'Category type',
    example: 'main',
    enum: ['main', 'sub', 'featured'],
  })
  readonly categoryType!: CategoryType;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  readonly createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  readonly updatedAt!: Date;
}

export class CategoryListResponse {
  @ApiProperty({
    type: [CategoryResponse],
    description: 'Array of categories',
  })
  readonly data!: CategoryResponse[];

  @ApiProperty({
    description: 'Total number of categories',
    example: 15,
  })
  readonly total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  readonly page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  readonly limit!: number;
}

export class CategoryDetailResponse {
  @ApiProperty({
    type: CategoryResponse,
    description: 'Category details',
  })
  readonly data!: CategoryResponse;
}
