import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'CHANEL',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'https://www.chanel.com/sg',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example:
      'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Chanel_logo_interlocking_cs.svg/1280px-Chanel_logo_interlocking_cs.svg.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isActive!: boolean;
}
