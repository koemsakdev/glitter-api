import {
  Body,
  Controller,
  Delete,
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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
@Controller('api/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an address',
    description:
      'Saves a shipping/billing address for a user. If isDefaultShipping or isDefaultBilling is true, any existing default of that type is automatically unset.',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, type: AddressDetailResponseDto })
  async create(@Body() dto: CreateAddressDto): Promise<AddressDetailResponse> {
    return this.addressesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List addresses',
    description:
      'Filter by userId, province, type, or default flags. Results are sorted with defaults first.',
  })
  @ApiResponse({ status: 200, type: AddressListResponseDto })
  async findAll(@Query() query: AddressQueryDto): Promise<AddressListResponse> {
    return this.addressesService.findAll(query);
  }

  @Get('user/:userId/default-shipping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get user's default shipping address",
    description:
      "Returns the user's default shipping address, or 404 if none is set. Useful for pre-filling the checkout form.",
  })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  @ApiResponse({ status: 404, description: 'No default shipping address' })
  async findDefaultShipping(
    @Param('userId') userId: string,
  ): Promise<AddressDetailResponse> {
    const result = await this.addressesService.findDefaultShipping(userId);
    if (result === null) {
      throw new NotFoundException('User has no default shipping address set');
    }
    return result;
  }

  @Get('user/:userId/default-billing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user's default billing address" })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  @ApiResponse({ status: 404, description: 'No default billing address' })
  async findDefaultBilling(
    @Param('userId') userId: string,
  ): Promise<AddressDetailResponse> {
    const result = await this.addressesService.findDefaultBilling(userId);
    if (result === null) {
      throw new NotFoundException('User has no default billing address set');
    }
    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async findOne(@Param('id') id: string): Promise<AddressDetailResponse> {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an address',
    description:
      'Update any field. Setting isDefaultShipping/isDefaultBilling to true automatically unsets the same type on other addresses.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressDetailResponse> {
    return this.addressesService.update(id, dto);
  }

  @Patch(':id/set-default-shipping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mark this address as the user's default shipping",
    description:
      "Convenience endpoint. Sets isDefaultShipping=true on this address and false on the user's other addresses.",
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async setAsDefaultShipping(
    @Param('id') id: string,
  ): Promise<AddressDetailResponse> {
    return this.addressesService.setAsDefaultShipping(id);
  }

  @Patch(':id/set-default-billing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mark this address as the user's default billing",
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: AddressDetailResponseDto })
  async setAsDefaultBilling(
    @Param('id') id: string,
  ): Promise<AddressDetailResponse> {
    return this.addressesService.setAsDefaultBilling(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an address',
    description:
      'Permanent deletion. Will fail if this address is referenced by existing orders (FK constraint).',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    return this.addressesService.delete(id);
  }
}
