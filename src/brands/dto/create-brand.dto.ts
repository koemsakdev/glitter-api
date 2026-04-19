import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import type { BrandStatus } from '../entities/brand.entity';

export class CreateBrandDto {
  @ApiProperty({
    description: 'URL-friendly slug (unique)',
    example: 'gucci',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug!: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'Gucci',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    description: 'Brand website URL',
    example: 'https://www.gucci.com',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Brand description',
    example: 'Italian luxury fashion house founded in 1921',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Brand status',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: BrandStatus;
}
