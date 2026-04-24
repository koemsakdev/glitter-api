import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import type { AddressType } from '../entities/address.entity';

export class AddressQueryDto {
  @ApiPropertyOptional({
    description:
      "Filter by owning user. Usually required for listing a user's own addresses.",
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by province (e.g., "Phnom Penh")',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ enum: ['shipping', 'billing', 'both'] })
  @IsOptional()
  @IsEnum(['shipping', 'billing', 'both'])
  addressType?: AddressType;

  @ApiPropertyOptional({ description: 'Only return default shipping address' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyDefaultShipping?: boolean;

  @ApiPropertyOptional({ description: 'Only return default billing address' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyDefaultBilling?: boolean;
}
