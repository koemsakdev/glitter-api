import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/user.service';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Called after the JWT signature is verified and not expired.
   * Our job: make sure the user still exists, is active, and the token is current.
   */
  async validate(payload: JwtPayload): Promise<UserEntity> {
    // Reject refresh tokens used where access tokens are expected
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.findActiveUserById(payload.sub);
    if (user === null) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Check tokenVersion matches — if it doesn't, the user logged out everywhere
    // or changed their password. Old tokens are invalid.
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Passport attaches whatever we return here to request.user
    return user;
  }
}
