import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class TransferStockDto {
  @ApiProperty({
    description: 'Product variant UUID being transferred',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productVariantId!: string;

  @ApiProperty({
    description: 'Source branch UUID (where stock moves FROM)',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  fromBranchId!: string;

  @ApiProperty({
    description: 'Destination branch UUID (where stock moves TO)',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  toBranchId!: string;

  @ApiProperty({
    description: 'Number of units to transfer',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
