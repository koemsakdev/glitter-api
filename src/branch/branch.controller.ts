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
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchesService } from './branch.service';
import {
  BranchListResponse,
  BranchResponse,
} from './types/branch-response.type';

@Controller('api/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  /**
   * Create a new branch
   * POST /api/branches
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBranchDto): Promise<BranchResponse> {
    return this.branchesService.create(dto);
  }

  /**
   * Get all branches with pagination
   * GET /api/branches?page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<BranchListResponse> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.branchesService.findAll(pageNum, limitNum);
  }

  /**
   * Get all active branches
   * GET /api/branches/status/active
   */
  @Get('status/active')
  @HttpCode(HttpStatus.OK)
  async findActive(): Promise<BranchListResponse> {
    return this.branchesService.findActive();
  }

  /**
   * Get a specific branch by ID
   * GET /api/branches/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<BranchResponse> {
    return this.branchesService.findOne(id);
  }

  /**
   * Get a specific branch by code
   * GET /api/branches/code/:code
   */
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findByCode(@Param('code') code: string): Promise<BranchResponse> {
    return this.branchesService.findByCode(code);
  }

  /**
   * Update a branch
   * PATCH /api/branches/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ): Promise<BranchResponse> {
    return this.branchesService.update(id, dto);
  }

  /**
   * Delete a branch
   * DELETE /api/branches/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.branchesService.delete(id);
  }
}
