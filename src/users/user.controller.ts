import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UsersService } from './user.service';
import {
  UserDetailResponseDto,
  UserListResponseDto,
} from './dto/user-response.dto';
import {
  UserDetailResponse,
  UserListResponse,
} from './types/user-response.type';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a user (admin)',
    description:
      'Admin endpoint. Customers self-register via POST /api/auth/register or OAuth flows instead.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserDetailResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<UserDetailResponse> {
    return this.usersService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, type: UserListResponseDto })
  async findAll(@Query() query: UserQueryDto): Promise<UserListResponse> {
    return this.usersService.findAll(query);
  }

  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find user by email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async findByEmail(
    @Param('email') email: string,
  ): Promise<UserDetailResponse> {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async findOne(@Param('id') id: string): Promise<UserDetailResponse> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update profile fields',
    description:
      'Users can use this to fill in missing info (phone, email) after OAuth signup. To change password use POST /api/auth/change-password.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDetailResponse> {
    return this.usersService.update(id, dto);
  }

  @Post(':id/invalidate-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Force logout from all devices',
    description: 'Increments tokenVersion to revoke all existing JWTs.',
  })
  @ApiParam({ name: 'id', type: String })
  async invalidateTokens(@Param('id') id: string): Promise<{ ok: true }> {
    await this.usersService.invalidateTokens(id);
    return { ok: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft-delete a user',
    description:
      'Sets accountStatus to "deleted" and revokes tokens. Record preserved for order history.',
  })
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.softDelete(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Permanently delete a user (DESTRUCTIVE)',
  })
  @ApiParam({ name: 'id', type: String })
  async hardDelete(@Param('id') id: string): Promise<void> {
    await this.usersService.hardDelete(id);
  }
}
