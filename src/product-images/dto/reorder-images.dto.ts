import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReorderImageItemDto {
  @ApiProperty({
    description: 'Image UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'New display order (0-indexed)',
    example: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder!: number;
}

export class ReorderImagesDto {
  @ApiProperty({
    description: 'Array of image IDs with their new display orders',
    type: [ReorderImageItemDto],
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440000', displayOrder: 0 },
      { id: '660e8400-e29b-41d4-a716-446655440001', displayOrder: 1 },
      { id: '770e8400-e29b-41d4-a716-446655440002', displayOrder: 2 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderImageItemDto)
  items!: ReorderImageItemDto[];
}
