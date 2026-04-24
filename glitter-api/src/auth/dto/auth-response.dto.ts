import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthTokensDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: 'Short-lived JWT used in Authorization: Bearer header',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description:
      'Long-lived JWT — store securely (httpOnly cookie or secure storage)',
  })
  refreshToken!: string;

  @ApiProperty({
    example: 900,
    description: 'Seconds until accessToken expires',
  })
  expiresIn!: number;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;
}

export class RefreshResponseDto {
  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;
}

export class CurrentUserResponseDto {
  @ApiProperty({ type: UserResponseDto })
  data!: UserResponseDto;
}
