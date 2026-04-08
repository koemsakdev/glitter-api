/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './category.service';
import {
  CategoryDetailResponse,
  CategoryListResponse,
} from './types/category-response.type';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Create a new category
   * POST /api/categories
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new product category with bilingual support',
  })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      example1: {
        summary: 'Electronics Category',
        value: {
          slug: 'electronics',
          nameEn: 'Electronics & Gadgets',
          nameKm: 'ឧបករណ៍អេឡិចត្របនិច',
          descriptionEn: 'Wide selection of electronics and tech gadgets',
          descriptionKm: 'ជម្រើសប្រភេទឧបករណ៍អេឡិចត្របនិច',
          iconUrl: 'https://cdn.glittershop.com/icons/electronics.png',
          displayOrder: 1,
          categoryType: 'main',
        },
      },
      example2: {
        summary: 'Fashion Category',
        value: {
          slug: 'fashion',
          nameEn: 'Fashion & Apparel',
          nameKm: 'ម៉្ហូបៃអាវ ឯងៃឌើស',
          descriptionEn: 'Trendy clothing and accessories',
          descriptionKm: 'សម្លៀកបdress ដ៏សមស្របនិងឧបករណ៍តុតៀង',
          displayOrder: 2,
          categoryType: 'main',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryDetailResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryDetailResponse> {
    return this.categoriesService.create(dto);
  }

  /**
   * Get all categories with pagination
   * GET /api/categories?page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all categories',
    description:
      'Retrieves paginated list of all categories sorted by display order',
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
    description: 'Categories retrieved successfully',
    type: CategoryListResponse,
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<CategoryListResponse> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.categoriesService.findAll(pageNum, limitNum);
  }

  /**
   * Get main categories only
   * GET /api/categories/type/main
   */
  @Get('type/main')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get main categories',
    description: 'Retrieves all main-type categories sorted by display order',
  })
  @ApiResponse({
    status: 200,
    description: 'Main categories retrieved successfully',
    type: CategoryListResponse,
  })
  async findMainCategories(): Promise<CategoryListResponse> {
    return this.categoriesService.findMainCategories();
  }

  /**
   * Get categories by type
   * GET /api/categories/type/:type?page=1&limit=10
   */
  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get categories by type',
    description: 'Retrieves categories filtered by type (main, sub, featured)',
  })
  @ApiParam({
    name: 'type',
    type: String,
    enum: ['main', 'sub', 'featured'],
    description: 'Category type',
    example: 'main',
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
    description: 'Categories retrieved successfully',
    type: CategoryListResponse,
  })
  async findByType(
    @Param('type') type: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<CategoryListResponse> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.categoriesService.findByType(type as any, pageNum, limitNum);
  }

  /**
   * Get a specific category by ID
   * GET /api/categories/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieves a specific category by its UUID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDetailResponse,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<CategoryDetailResponse> {
    return this.categoriesService.findOne(id);
  }

  /**
   * Get a specific category by slug
   * GET /api/categories/slug/:slug
   */
  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Retrieves a specific category by its URL-friendly slug',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Category slug',
    example: 'electronics',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDetailResponse,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryDetailResponse> {
    return this.categoriesService.findBySlug(slug);
  }

  /**
   * Update a category
   * PATCH /api/categories/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates specific fields of a category (partial update)',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      example1: {
        summary: 'Update display order',
        value: {
          displayOrder: 3,
        },
      },
      example2: {
        summary: 'Update names and descriptions',
        value: {
          nameEn: 'Tech Gadgets & Electronics',
          nameKm: 'ឧបករណ៍ প្រযুక្তិ',
          descriptionEn: 'Latest technology products',
          descriptionKm: 'ផលិតផលបច្ចេកវិទ្យាចាប់សម័យ',
        },
      },
      example3: {
        summary: 'Change category type',
        value: {
          categoryType: 'featured',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryDetailResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryDetailResponse> {
    return this.categoriesService.update(id, dto);
  }

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Permanently deletes a category from the system',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
