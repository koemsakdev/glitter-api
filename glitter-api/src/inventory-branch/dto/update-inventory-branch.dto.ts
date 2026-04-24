import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateInventoryBranchDto {
  @ApiPropertyOptional({
    description: 'New available stock count',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityAvailable?: number;

  @ApiPropertyOptional({
    description: 'New reserved stock count',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityReserved?: number;

  @ApiPropertyOptional({
    description: 'New damaged stock count',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityDamaged?: number;
}
