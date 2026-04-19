import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class ReserveStockDto {
  @ApiProperty({
    description: 'Product variant UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productVariantId!: string;

  @ApiProperty({
    description: 'Branch UUID to reserve stock at',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  branchId!: string;

  @ApiProperty({
    description: 'Number of units to reserve',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
