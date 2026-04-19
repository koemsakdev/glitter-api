import { AccountStatus } from '../entities/user.entity';
import { AuthProvider } from '../entities/auth-account.entity';

export interface LinkedAuthAccount {
  id: string;
  provider: AuthProvider;
  providerAccountId: string;
  createdAt: Date;
  // Note: tokens and passwordHash are never in responses
}

export interface UserResponse {
  id: string;
  email: string | null;
  emailVerifiedAt: Date | null;
  phoneNumber: string | null;
  phoneVerifiedAt: Date | null;
  fullName: string;
  profileImageUrl: string | null;
  accountStatus: AccountStatus;
  isProfileComplete: boolean;
  // What's missing for profile completion — helps frontend show the right prompt
  missingFields: Array<'phoneNumber' | 'email' | 'fullName'>;
  // Which providers this user can log in with
  linkedProviders: AuthProvider[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  data: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface UserDetailResponse {
  data: UserResponse;
}
