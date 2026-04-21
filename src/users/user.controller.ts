/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import { createDiskStorage } from '../common/helpers/multer.helper';
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

const AVATAR_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'avatars');
const avatarStorage = createDiskStorage(AVATAR_UPLOAD_DIR);

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new Error(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`),
      false,
    );
  }
  callback(null, true);
};

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a user (admin)',
    description:
      'Admin endpoint. Customers self-register via /api/auth/register. For staff roles (cashier/manager), branchId is required. Guards will enforce role-based permissions when auth is wired up.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserDetailResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<UserDetailResponse> {
    return this.usersService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List users',
    description: 'Filter by role, branch, status, provider, or search term.',
  })
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
      'Profile update. role/branchId changes require admin permissions (enforced by guards). Changing role invalidates existing JWTs.',
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

  @Patch(':id/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: avatarStorage,
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload or replace avatar',
    description:
      'Uploads a new profile image. Locks source to "uploaded" — OAuth re-logins won\'t overwrite.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UserDetailResponse> {
    if (!avatar) {
      throw new BadRequestException('Avatar file is required');
    }
    if (avatar.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }
    return this.usersService.uploadAvatar(id, avatar);
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove profile avatar' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: UserDetailResponseDto })
  async removeAvatar(@Param('id') id: string): Promise<UserDetailResponse> {
    return this.usersService.removeAvatar(id);
  }

  @Post(':id/invalidate-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force logout from all devices' })
  @ApiParam({ name: 'id', type: String })
  async invalidateTokens(@Param('id') id: string): Promise<{ ok: true }> {
    await this.usersService.invalidateTokens(id);
    return { ok: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a user' })
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.softDelete(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete a user (DESTRUCTIVE)' })
  @ApiParam({ name: 'id', type: String })
  async hardDelete(@Param('id') id: string): Promise<void> {
    await this.usersService.hardDelete(id);
  }
}
