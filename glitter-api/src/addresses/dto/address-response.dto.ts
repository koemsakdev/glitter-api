import { ApiProperty } from '@nestjs/swagger';
import type { AddressType } from '../entities/address.entity';

export class AddressResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  userId!: string;

  @ApiProperty({ example: 'Home', nullable: true })
  label!: string | null;

  @ApiProperty({ example: 'Koemsak Sovann' })
  recipientName!: string;

  @ApiProperty({ example: '+85512345678' })
  recipientPhone!: string;

  @ApiProperty({ example: 'Phnom Penh' })
  province!: string;

  @ApiProperty({ example: 'Chamkar Mon' })
  district!: string;

  @ApiProperty({ example: 'Tuol Tompoung 1', nullable: true })
  commune!: string | null;

  @ApiProperty({ example: 'Village 5', nullable: true })
  village!: string | null;

  @ApiProperty({ example: 'House #42, Street 271' })
  streetAddress!: string;

  @ApiProperty({ example: '12302', nullable: true })
  postalCode!: string | null;

  @ApiProperty({
    example: 'Blue gate next to Angkor Market',
    nullable: true,
  })
  landmark!: string | null;

  @ApiProperty({
    enum: ['shipping', 'billing', 'both'],
    example: 'both',
  })
  addressType!: AddressType;

  @ApiProperty({ example: true })
  isDefaultShipping!: boolean;

  @ApiProperty({ example: false })
  isDefaultBilling!: boolean;

  @ApiProperty({ example: '11.5563738', nullable: true })
  latitude!: string | null;

  @ApiProperty({ example: '104.9282099', nullable: true })
  longitude!: string | null;

  @ApiProperty({
    example:
      'House #42, Street 271, Tuol Tompoung 1, Chamkar Mon, Phnom Penh, 12302',
    description: 'Single-line address string for display',
  })
  formattedAddress!: string;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  updatedAt!: Date;
}

export class AddressDetailResponseDto {
  @ApiProperty({ type: AddressResponseDto })
  data!: AddressResponseDto;
}

export class AddressListResponseDto {
  @ApiProperty({ type: [AddressResponseDto] })
  data!: AddressResponseDto[];

  @ApiProperty({ example: 3 })
  total!: number;
}
