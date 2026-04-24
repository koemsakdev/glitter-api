import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAppSettingDto {
  @ApiProperty({ example: 'general' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  settingGroup!: string;

  @ApiProperty({ example: 'default_currency' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  settingKey!: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  settingValue!: string;

  @ApiProperty({
    example: 'string',
    enum: ['string', 'number', 'boolean', 'json'],
  })
  @IsString()
  @IsIn(['string', 'number', 'boolean', 'json'])
  valueType!: 'string' | 'number' | 'boolean' | 'json';

  @ApiPropertyOptional({ example: 'Default currency used by the shop' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPublic!: boolean;
}
