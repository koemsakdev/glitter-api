import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import type { BadgeType } from '../entities/product-badge.entity';

// UpdateDto omits productId — can't reassign a badge to a different product.
export class UpdateProductBadgeDto {
  @ApiPropertyOptional({
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
  })
  @IsOptional()
  @IsEnum([
    'new',
    'sale',
    'bestseller',
    'limited',
    'exclusive',
    'hot',
    'featured',
    'coming_soon',
  ])
  badgeType?: BadgeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  badgeLabelEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  badgeLabelKm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  badgeIconColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  badgeStartDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  badgeEndDate?: Date;
}
