import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateInventoryBranchDto {
  @ApiProperty({
    description: 'Product variant UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productVariantId!: string;

  @ApiProperty({
    description: 'Branch UUID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  branchId!: string;

  @ApiPropertyOptional({
    description: 'Initial available stock at this branch',
    example: 5,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityAvailable?: number;

  @ApiPropertyOptional({
    description: 'Initial reserved stock (held for pending orders)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityReserved?: number;

  @ApiPropertyOptional({
    description: 'Initial damaged stock (cannot sell)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityDamaged?: number;
}
