import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * For client-side Google OAuth flows (mobile apps, Next.js with NextAuth, etc.).
 * The client gets an ID token from Google, then sends it here to exchange for
 * our own JWT pair.
 *
 * Alternative: use the server-side flow via GET /api/auth/google (redirects).
 */
export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID token from the client-side Google Sign-In library',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
