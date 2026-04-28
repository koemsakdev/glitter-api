/**
 * ============================================================================
 * IMPORTANT: RECONSTRUCTED FILE
 * ============================================================================
 * I don't have your original category.controller.ts in conversation history.
 * This is a REASONABLE RECONSTRUCTION based on your naming conventions.
 *
 * BEFORE using this, compare to YOUR actual category.controller.ts.
 * If method names differ, KEEP YOUR VERSION and copy only the security
 * decorators (@Public, @UseGuards, @Roles, @ApiBearerAuth) from here.
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
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category (admin only)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List categories (public)' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.categoryService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category by ID (public)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a category (admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category (admin only)' })
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
