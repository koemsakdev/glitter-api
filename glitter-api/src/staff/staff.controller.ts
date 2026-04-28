/**
 * ============================================================================
 * IMPORTANT: RECONSTRUCTED FILE
 * ============================================================================
 * I don't have your original staff.controller.ts in conversation history.
 * This is a REASONABLE RECONSTRUCTION based on your naming conventions.
 *
 * BEFORE using this, compare to YOUR actual staff.controller.ts.
 * If method names or signatures differ, KEEP YOUR VERSION and copy only
 * the security decorators from here.
 *
 * NOTE: Staff table is an HR roster. Staff DO NOT LOG IN via this endpoint.
 * Staff logins go through the Users/Auth module. Staff records here are
 * for internal HR/contact management.
 * ============================================================================
 */
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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles('admin', 'super_admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a staff record (admin only)' })
  @ApiBody({ type: CreateStaffDto })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Roles('admin', 'super_admin', 'manager')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List staff (admin/manager)' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.staffService.findAll(parseInt(page, 10), parseInt(limit, 10));
  }

  @Roles('admin', 'super_admin', 'manager')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get staff by ID (admin/manager)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Roles('admin', 'super_admin')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update staff (admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateStaffDto })
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Roles('admin', 'super_admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a staff record (admin only)' })
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id') id: string): Promise<void> {
    return this.staffService.delete(id);
  }
}
