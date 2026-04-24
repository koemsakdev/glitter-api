import type { EmploymentStatus } from '../entities/staff.entity';

export interface StaffResponse {
  readonly id: string;
  readonly branchId: string;
  readonly name: string;
  readonly role: string;
  readonly phone: string;
  readonly email: string;
  readonly employmentStatus: EmploymentStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface StaffListResponse {
  readonly data: ReadonlyArray<StaffResponse>;
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

export interface StaffDetailResponse {
  readonly data: StaffResponse;
}
