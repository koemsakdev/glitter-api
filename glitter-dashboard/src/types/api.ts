/**
 * TypeScript types matching the NestJS backend responses.
 * Keep these in sync with your backend DTOs.
 */

export type UserRole =
  | 'customer'
  | 'cashier'
  | 'manager'
  | 'admin'
  | 'super_admin';

export type AccountStatus = 'active' | 'suspended' | 'banned';

export type ProfileImageSource = 'none' | 'oauth' | 'uploaded';

export interface User {
  id: string;
  email: string | null;
  phoneNumber: string | null;
  fullName: string;
  profileImageUrl: string | null;
  profileImageSource: ProfileImageSource;
  role: UserRole;
  branchId: string | null;
  accountStatus: AccountStatus;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}