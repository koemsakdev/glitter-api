/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';
import {
  StaffDetailResponseDto,
  StaffListResponseDto,
} from './dto/staff-response.dto';
import {
  StaffListResponse,
  StaffDetailResponse,
} from './types/staff-response.type';

@ApiTags('Staff')
@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  /**
   * Create a new staff member
   * POST /api/staff
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new staff member',
    description: 'Creates a new staff/employee record for a branch',
  })
  @ApiBody({
    type: CreateStaffDto,
    examples: {
      example1: {
        summary: 'Sales Associate at PHN Downtown',
        value: {
          branchId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Sovann Sichhoeur',
          role: 'Sales Associate',
          phone: '+85515711783',
          email: 'sovann@glittershop.com',
          employmentStatus: 'active',
        },
      },
      example2: {
        summary: 'Manager at Siem Reap',
        value: {
          branchId: '660e8400-e29b-41d4-a716-446655440001',
          name: 'Srey Mom',
          role: 'Branch Manager',
          phone: '+85512345678',
          email: 'sreymom@glittershop.com',
          employmentStatus: 'active',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Staff member created successfully',
    type: StaffDetailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email or phone already in use' })
  async create(@Body() dto: CreateStaffDto): Promise<StaffDetailResponse> {
    return this.staffService.create(dto);
  }

  /**
   * Get all staff members with pagination
   * GET /api/staff?page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all staff members',
    description: 'Retrieves paginated list of all staff members',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Staff members retrieved successfully',
    type: StaffListResponseDto,
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<StaffListResponse> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.staffService.findAll(pageNum, limitNum);
  }

  /**
   * Get staff members by branch
   * GET /api/staff/branch/:branchId
   */
  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get staff by branch',
    description: 'Retrieves all staff members assigned to a specific branch',
  })
  @ApiParam({
    name: 'branchId',
    type: String,
    description: 'Branch UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Staff members retrieved successfully',
    type: StaffListResponseDto,
  })
  async findByBranch(
    @Param('branchId') branchId: string,
  ): Promise<StaffListResponse> {
    return this.staffService.findByBranch(branchId);
  }

  /**
   * Get active staff members by branch
   * GET /api/staff/branch/:branchId/active
   */
  @Get('branch/:branchId/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active staff by branch',
    description: 'Retrieves active staff members assigned to a specific branch',
  })
  @ApiParam({
    name: 'branchId',
    type: String,
    description: 'Branch UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Active staff members retrieved successfully',
    type: StaffListResponseDto,
  })
  async findActiveByBranch(
    @Param('branchId') branchId: string,
  ): Promise<StaffListResponse> {
    return this.staffService.findActiveByBranch(branchId);
  }

  /**
   * Get a specific staff member by ID
   * GET /api/staff/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get staff by ID',
    description: 'Retrieves a specific staff member by their UUID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Staff UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Staff member retrieved successfully',
    type: StaffDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async findOne(@Param('id') id: string): Promise<StaffDetailResponse> {
    return this.staffService.findOne(id);
  }

  /**
   * Update a staff member
   * PATCH /api/staff/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a staff member',
    description: 'Updates specific fields of a staff member (partial update)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Staff UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateStaffDto,
    examples: {
      example1: {
        summary: 'Change role',
        value: {
          role: 'Senior Sales Associate',
        },
      },
      example2: {
        summary: 'Update contact info',
        value: {
          phone: '+85512345678',
          email: 'newemail@glittershop.com',
        },
      },
      example3: {
        summary: 'Change employment status',
        value: {
          employmentStatus: 'inactive',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Staff member updated successfully',
    type: StaffDetailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 409, description: 'Email or phone already in use' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
  ): Promise<StaffDetailResponse> {
    return this.staffService.update(id, dto);
  }

  /**
   * Delete a staff member
   * DELETE /api/staff/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a staff member',
    description: 'Permanently deletes a staff member from the system',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Staff UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Staff member deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.staffService.delete(id);
  }
}
