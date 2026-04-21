import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../users/user.service';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import {
  AuthResponseDto,
  CurrentUserResponseDto,
  RefreshResponseDto,
} from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDetailResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // ==========================================================================
  // EMAIL + PASSWORD
  // ==========================================================================

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new customer account (email + password)',
    description:
      'Creates a customer account. Self-registration always creates role="customer". For staff/admin accounts, use POST /api/users (requires admin permissions).',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({
    status: 409,
    description: 'Email or phone already registered',
  })
  async register(@Body() dto: RegisterDto) {
    const { user, tokens } = await this.authService.register(dto);
    const userResponse = await this.usersService.findOne(user.id);
    return {
      user: userResponse.data,
      tokens,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email + password',
    description:
      "Works for ALL roles (customer, cashier, manager, admin, super_admin). The returned JWT includes the user's role.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const { user, tokens } = await this.authService.login(dto);
    const userResponse = await this.usersService.findOne(user.id);
    return {
      user: userResponse.data,
      tokens,
    };
  }

  // ==========================================================================
  // GOOGLE LOGIN
  // ==========================================================================

  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login or signup with Google',
    description:
      'Client-side OAuth flow. Frontend uses Google Sign-In JavaScript library to get an ID token, then sends it here. First-time users are auto-registered as customers.',
  })
  @ApiBody({ type: GoogleLoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid Google ID token' })
  async googleLogin(@Body() dto: GoogleLoginDto) {
    const { user, tokens, isNewUser } =
      await this.authService.loginWithGoogle(dto);
    const userResponse = await this.usersService.findOne(user.id);
    return {
      user: userResponse.data,
      tokens,
      isNewUser,
    };
  }

  // ==========================================================================
  // REFRESH + LOGOUT
  // ==========================================================================

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Exchange a refresh token for a new access+refresh token pair. Use when your access token expires (15 minutes by default).',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refresh(dto);
    return { tokens };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout from all devices',
    description:
      'Invalidates ALL tokens for this user (including on other devices). They must log in again everywhere.',
  })
  @ApiResponse({ status: 200 })
  async logout(@CurrentUser('id') userId: string): Promise<{ ok: true }> {
    await this.authService.logout(userId);
    return { ok: true };
  }

  // ==========================================================================
  // PROFILE
  // ==========================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      "Returns the logged-in user's full profile including linked providers and whether the profile is complete. Frontend calls this after login to decide what to show.",
  })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async me(@CurrentUser() user: UserEntity): Promise<CurrentUserResponseDto> {
    const result = await this.usersService.findOne(user.id);
    return { data: result.data };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change your password',
    description:
      'Requires the current password. On success, ALL existing tokens are invalidated — user must log in again.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ ok: true }> {
    await this.authService.changePassword(userId, dto);
    return { ok: true };
  }
}
