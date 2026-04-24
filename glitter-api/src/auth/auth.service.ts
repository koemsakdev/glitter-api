import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { UserEntity } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { verifyPassword } from './helpers/password.helper';
import { AuthTokenResponse, JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ==========================================================================
  // EMAIL + PASSWORD
  // ==========================================================================

  async register(
    dto: RegisterDto,
  ): Promise<{ user: UserEntity; tokens: AuthTokenResponse }> {
    const user = await this.usersService.registerWithEmail({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
    });

    const tokens = this.issueTokens(user);
    return { user, tokens };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: UserEntity; tokens: AuthTokenResponse }> {
    const result = await this.usersService.findEmailAuthAccount(dto.email);

    if (result === null) {
      // Don't tell the user whether the email exists — just say credentials wrong
      throw new UnauthorizedException('Invalid email or password');
    }

    const { user, authAccount } = result;

    if (authAccount.passwordHash === null) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await verifyPassword(
      dto.password,
      authAccount.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.accountStatus !== 'active') {
      throw new UnauthorizedException(
        `Account is ${user.accountStatus}. Contact support.`,
      );
    }

    const tokens = this.issueTokens(user);
    return { user, tokens };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findActiveUserById(userId);
    if (user === null) {
      throw new UnauthorizedException('User not found or inactive');
    }
    if (user.email === null) {
      throw new BadRequestException(
        'Cannot change password: user has no email auth account',
      );
    }

    const result = await this.usersService.findEmailAuthAccount(user.email);
    if (result === null || result.authAccount.passwordHash === null) {
      throw new BadRequestException(
        'No password is set for this account. Use addEmailPassword instead.',
      );
    }

    const currentValid = await verifyPassword(
      dto.currentPassword,
      result.authAccount.passwordHash,
    );
    if (!currentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.usersService.changePassword(userId, dto.newPassword);
    // tokenVersion is bumped by the service — existing JWTs for this user are now invalid
  }

  // ==========================================================================
  // GOOGLE (client-side flow — exchange Google ID token for our JWTs)
  // ==========================================================================

  /**
   * Verify a Google ID token client-side, then find-or-create the user.
   * This is the modern flow for mobile apps and SPAs.
   *
   * The frontend uses Google Sign-In JavaScript library → gets an ID token →
   * sends it here. We verify with Google, extract profile, issue our own JWTs.
   */
  async loginWithGoogle(dto: GoogleLoginDto): Promise<{
    user: UserEntity;
    tokens: AuthTokenResponse;
    isNewUser: boolean;
  }> {
    const googleProfile = await this.verifyGoogleIdToken(dto.idToken);

    const { user, isNewUser } = await this.usersService.findOrCreateFromOAuth({
      provider: 'google',
      providerAccountId: googleProfile.sub,
      email: googleProfile.email ?? null,
      fullName: googleProfile.name ?? googleProfile.email ?? 'Google User',
      profileImageUrl: googleProfile.picture ?? null,
      accessToken: null, // not captured in ID-token flow
      refreshToken: null,
      tokenExpiresAt: null,
      rawProfile: googleProfile as unknown as Record<string, unknown>,
    });

    if (user.accountStatus !== 'active') {
      throw new UnauthorizedException(
        `Account is ${user.accountStatus}. Contact support.`,
      );
    }

    const tokens = this.issueTokens(user);
    return { user, tokens, isNewUser };
  }

  /**
   * Verify a Google ID token by calling Google's tokeninfo endpoint.
   * Returns the decoded profile claims.
   *
   * For production, consider using google-auth-library for local verification
   * (faster, doesn't depend on Google's endpoint). For thesis, tokeninfo is fine.
   */
  private async verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const profile = (await response.json()) as GoogleProfile;

    // Verify audience matches our Google OAuth client ID
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new Error(
        'GOOGLE_CLIENT_ID is not configured. Set it in .env before using Google login.',
      );
    }
    if (profile.aud !== clientId) {
      throw new UnauthorizedException(
        'Google ID token was not issued for this application',
      );
    }

    // Verify not expired
    const now = Math.floor(Date.now() / 1000);
    if (profile.exp && Number(profile.exp) < now) {
      throw new UnauthorizedException('Google ID token has expired');
    }

    return profile;
  }

  // ==========================================================================
  // REFRESH + LOGOUT
  // ==========================================================================

  async refresh(dto: RefreshTokenDto): Promise<AuthTokenResponse> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.findActiveUserById(payload.sub);
    if (user === null) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Refresh tokens also respect tokenVersion — revoked tokens can't refresh
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    return this.issueTokens(user);
  }

  /**
   * Logout = bump tokenVersion, which invalidates ALL existing tokens for this user
   * (including the current access token, any other devices, and refresh tokens).
   */
  async logout(userId: string): Promise<void> {
    await this.usersService.invalidateTokens(userId);
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private issueTokens(user: UserEntity): AuthTokenResponse {
    const accessPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      type: 'refresh',
    };

    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: accessExpiresIn as unknown as number,
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiresIn as unknown as number,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseDurationToSeconds(accessExpiresIn),
      tokenType: 'Bearer',
    };
  }

  /**
   * Convert "15m", "7d", "3600", etc. into seconds.
   */
  private parseDurationToSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd]?)$/);
    if (!match) {
      const asNumber = Number(duration);
      return Number.isFinite(asNumber) ? asNumber : 900;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2] || 's';
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return value;
    }
  }
}

/**
 * Shape of Google's tokeninfo response (subset we care about)
 */
interface GoogleProfile {
  iss: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  exp?: string;
}
