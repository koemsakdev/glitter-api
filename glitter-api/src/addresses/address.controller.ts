import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  assertOwnerOrAdmin,
  isAdmin,
} from '../common/helpers/ownership.helper';
import { UserEntity } from '../users/entities/user.entity';
import { AddressesService } from './address.service';
import { AddressQueryDto } from './dto/address-query.dto';
import {
  AddressDetailResponseDto,
  AddressListResponseDto,
} from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
  AddressDetailResponse,
  AddressListResponse,
} from './types/address-response.type';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /**
   * Users can create addresses for THEMSELVES.
   * Admins can create addresses on behalf of any user (for customer support).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an address',
    description:
      'Users create addresses for themselves (userId must match current user). Admins can specify any userId.',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, type: AddressDetailResponseDto })
  async create(
    @Body() dto: CreateAddressDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    // Non-admins can only create addresses for themselves
    if (!isAdmin(currentUser) && dto.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You can only create addresses for yourself',
      );
    }
    return this.addressesService.create(dto);
  }

  /**
   * Users see their own addresses. Admins see any.
   * If no userId filter is provided and user is not admin, auto-filter to self.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List addresses',
    description:
      'Filter by userId. Non-admins can only list their own addresses.',
  })
  @ApiResponse({ status: 200, type: AddressListResponseDto })
  async findAll(
    @Query() query: AddressQueryDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressListResponse> {
    if (!isAdmin(currentUser)) {
      // Force filter to current user, regardless of what was passed
      query.userId = currentUser.id;
    }
    return this.addressesService.findAll(query);
  }

  @Get('user/:userId/default-shipping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a user's default shipping address" })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  @ApiResponse({ status: 404, description: 'No default shipping address' })
  async findDefaultShipping(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    assertOwnerOrAdmin(
      currentUser,
      userId,
      'You can only view your own default shipping address',
    );
    const result = await this.addressesService.findDefaultShipping(userId);
    if (result === null) {
      throw new NotFoundException('No default shipping address set');
    }
    return result;
  }

  @Get('user/:userId/default-billing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a user's default billing address" })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async findDefaultBilling(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    assertOwnerOrAdmin(
      currentUser,
      userId,
      'You can only view your own default billing address',
    );
    const result = await this.addressesService.findDefaultBilling(userId);
    if (result === null) {
      throw new NotFoundException('No default billing address set');
    }
    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    const result = await this.addressesService.findOne(id);
    assertOwnerOrAdmin(
      currentUser,
      result.data.userId,
      'You can only view your own addresses',
    );
    return result;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    const existing = await this.addressesService.findOne(id);
    assertOwnerOrAdmin(
      currentUser,
      existing.data.userId,
      'You can only update your own addresses',
    );
    return this.addressesService.update(id, dto);
  }

  @Patch(':id/set-default-shipping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark as default shipping' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async setAsDefaultShipping(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    const existing = await this.addressesService.findOne(id);
    assertOwnerOrAdmin(
      currentUser,
      existing.data.userId,
      'You can only modify your own addresses',
    );
    return this.addressesService.setAsDefaultShipping(id);
  }

  @Patch(':id/set-default-billing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark as default billing' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async setAsDefaultBilling(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AddressDetailResponse> {
    const existing = await this.addressesService.findOne(id);
    assertOwnerOrAdmin(
      currentUser,
      existing.data.userId,
      'You can only modify your own addresses',
    );
    return this.addressesService.setAsDefaultBilling(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    const existing = await this.addressesService.findOne(id);
    assertOwnerOrAdmin(
      currentUser,
      existing.data.userId,
      'You can only delete your own addresses',
    );
    return this.addressesService.delete(id);
  }
}
