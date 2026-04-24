import { UserRole } from '../../users/entities/user.entity';

/**
 * Data encoded into each JWT. Keep this small — tokens travel on every request.
 */
export interface JwtPayload {
  sub: string; // user ID
  role: UserRole;
  tokenVersion: number;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * What the auth endpoints return to the client.
 * The user object matches UserResponse — see users/types/user-response.type.ts
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
