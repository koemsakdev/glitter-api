import { ApiProperty } from '@nestjs/swagger';
import type { AccountStatus } from '../entities/user.entity';
import { AuthProvider } from '../entities/auth-account.entity';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'customer@example.com', nullable: true })
  email!: string | null;

  @ApiProperty({ nullable: true, example: '2026-04-19T10:00:00.000Z' })
  emailVerifiedAt!: Date | null;

  @ApiProperty({ example: '+85512345678', nullable: true })
  phoneNumber!: string | null;

  @ApiProperty({ nullable: true, example: null })
  phoneVerifiedAt!: Date | null;

  @ApiProperty({ example: 'Koemsak Sovann' })
  fullName!: string;

  @ApiProperty({ nullable: true, example: null })
  profileImageUrl!: string | null;

  @ApiProperty({ enum: ['active', 'suspended', 'deleted'], example: 'active' })
  accountStatus!: AccountStatus;

  @ApiProperty({
    example: false,
    description: 'True when the user has all fields required to place an order',
  })
  isProfileComplete!: boolean;

  @ApiProperty({
    example: ['phoneNumber'],
    description: 'Which required fields are still missing',
    isArray: true,
    enum: ['phoneNumber', 'email', 'fullName'],
  })
  missingFields!: Array<'phoneNumber' | 'email' | 'fullName'>;

  @ApiProperty({
    enum: ['email', 'google', 'facebook', 'apple', 'telegram'],
    isArray: true,
    example: ['google', 'email'],
    description: 'All login methods linked to this account',
  })
  linkedProviders!: AuthProvider[];

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-19T10:00:00.000Z' })
  updatedAt!: Date;
}

export class UserDetailResponseDto {
  @ApiProperty({ type: UserResponseDto })
  data!: UserResponseDto;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data!: UserResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}
