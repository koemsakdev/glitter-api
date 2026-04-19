import { ApiProperty } from '@nestjs/swagger';
import type { BrandStatus } from '../entities/brand.entity';

export class BrandResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'gucci' })
  slug!: string;

  @ApiProperty({ example: 'Gucci' })
  name!: string;

  @ApiProperty({
    example: '/upload/brands/1728000000000-gucci-logo.png',
    nullable: true,
  })
  logoUrl!: string | null;

  @ApiProperty({ example: 'https://www.gucci.com', nullable: true })
  websiteUrl!: string | null;

  @ApiProperty({
    example: 'Italian luxury fashion house',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  status!: BrandStatus;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-04-18T10:00:00.000Z' })
  updatedAt!: Date;
}

export class BrandDetailResponseDto {
  @ApiProperty({ type: BrandResponseDto })
  data!: BrandResponseDto;
}

export class BrandListResponseDto {
  @ApiProperty({ type: [BrandResponseDto] })
  data!: BrandResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}
