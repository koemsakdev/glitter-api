import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import type { ImageType } from '../entities/product-image.entity';

// Update DTO omits productId (can't change an image's owner product after creation)
// Everything else is optional
export class UpdateProductImageDto {
  @ApiPropertyOptional({
    description: 'Alt text in English',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageAltTextEn?: string;

  @ApiPropertyOptional({
    description: 'Alt text in Khmer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageAltTextKm?: string;

  @ApiPropertyOptional({
    description: 'Image type',
    enum: ['primary', 'gallery', 'thumbnail', 'zoom'],
  })
  @IsOptional()
  @IsEnum(['primary', 'gallery', 'thumbnail', 'zoom'])
  imageType?: ImageType;

  @ApiPropertyOptional({
    description: 'Display order',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
