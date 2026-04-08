import { ApiProperty } from '@nestjs/swagger';
import type { EmploymentStatus } from '../entities/staff.entity';

export class StaffResponseDto {
  @ApiProperty({
    description: 'Staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  readonly id!: string;

  @ApiProperty({
    description: 'Branch ID this staff belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  readonly branchId!: string;

  @ApiProperty({
    description: 'Full name of the staff member',
    example: 'Sovann Sichhoeur',
  })
  readonly name!: string;

  @ApiProperty({
    description: 'Job role/position',
    example: 'Sales Associate',
  })
  readonly role!: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+85515711783',
  })
  readonly phone!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'sovann@glittershop.com',
  })
  readonly email!: string;

  @ApiProperty({
    description: 'Employment status',
    example: 'active',
    enum: ['active', 'inactive', 'terminated'],
  })
  readonly employmentStatus!: EmploymentStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  readonly createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  readonly updatedAt!: Date;
}

export class StaffListResponseDto {
  @ApiProperty({
    type: [StaffResponseDto],
    description: 'Array of staff members',
  })
  readonly data!: StaffResponseDto[];

  @ApiProperty({
    description: 'Total number of staff members',
    example: 25,
  })
  readonly total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  readonly page!: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  readonly limit!: number;
}

export class StaffDetailResponseDto {
  @ApiProperty({
    type: StaffResponseDto,
    description: 'Staff member details',
  })
  readonly data!: StaffResponseDto;
}
