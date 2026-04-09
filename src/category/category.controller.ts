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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import * as path from 'path';
import { createDiskStorage } from '../common/helpers/multer.helper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './category.service';
import {
  CategoryDetailResponseDto,
  CategoryListResponseDto,
} from './dto/category-response.dto';
import {
  CategoryListResponse,
  CategoryDetailResponse,
} from './types/category-response.type';

// Define upload destination
const CATEGORY_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'categories');
const categoryStorage = createDiskStorage(CATEGORY_UPLOAD_DIR);

// Allowed file types
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// File validation
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      ),
      false,
    );
  }
  callback(null, true);
};

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Create a new category with icon upload
   * POST /api/categories
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: categoryStorage,
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'Creates a new product category with icon upload and bilingual support',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          example: 'bags',
          description: 'URL-friendly slug',
        },
        nameEn: {
          type: 'string',
          example: 'Bags',
          description: 'Category name in English',
        },
        nameKm: {
          type: 'string',
          example: 'កាបូប',
          description: 'Category name in Khmer',
        },
        descriptionEn: {
          type: 'string',
          example: 'Stylish bags and handbags from top brands',
          description: 'Description in English (optional)',
        },
        descriptionKm: {
          type: 'string',
          example: 'កាបូបស្ទាប់ល្អ និងសម្លៀកបំពាក់ពីម៉ាកលំដាប់កំពូល',
          description: 'Description in Khmer (optional)',
        },
        icon: {
          type: 'string',
          format: 'binary',
          description:
            'Category icon image file (PNG, JPEG, WebP, SVG) - optional, max 5MB',
        },
        displayOrder: {
          type: 'number',
          example: 1,
          description: 'Display order (optional, default: 0)',
        },
        categoryType: {
          type: 'string',
          enum: ['main', 'sub', 'featured'],
          example: 'main',
          description: 'Category type (optional, default: main)',
        },
      },
      required: ['slug', 'nameEn', 'nameKm'],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Category created successfully with icon stored in /uploads/categories/',
    type: CategoryDetailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or file' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<CategoryDetailResponse> {
    // Validate file size
    if (icon && icon.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    return this.categoriesService.create(dto, icon);
  }

  /**
   * Get all categories with pagination
   * GET /api/categories?page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves paginated list of all categories with icon URLs',
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
    type: CategoryListResponseDto,
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
    description: 'Retrieves all main-type categories with icon URLs',
  })
  @ApiResponse({
    status: 200,
    description: 'Main categories retrieved successfully',
    type: CategoryListResponseDto,
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
    description: 'Retrieves categories filtered by type with icon URLs',
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
    type: CategoryListResponseDto,
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
    description: 'Retrieves a specific category with icon URL',
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
    type: CategoryDetailResponseDto,
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
    description: 'Retrieves a specific category with icon URL',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Category slug',
    example: 'bags',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryDetailResponse> {
    return this.categoriesService.findBySlug(slug);
  }

  /**
   * Update a category with optional icon upload
   * PATCH /api/categories/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: categoryStorage,
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update a category',
    description:
      'Updates specific fields of a category with optional icon upload',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          example: 'bags',
          description: 'Category slug (optional)',
        },
        nameEn: {
          type: 'string',
          example: 'Designer Bags',
          description: 'Category name in English (optional)',
        },
        nameKm: {
          type: 'string',
          example: 'កាបូបលម្អប្រដាប់',
          description: 'Category name in Khmer (optional)',
        },
        descriptionEn: {
          type: 'string',
          description: 'Description in English (optional)',
        },
        descriptionKm: {
          type: 'string',
          description: 'Description in Khmer (optional)',
        },
        icon: {
          type: 'string',
          format: 'binary',
          description: 'New category icon image file (optional)',
        },
        displayOrder: {
          type: 'number',
          example: 2,
          description: 'Display order (optional)',
        },
        categoryType: {
          type: 'string',
          enum: ['main', 'sub', 'featured'],
          example: 'main',
          description: 'Category type (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryDetailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or file' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<CategoryDetailResponse> {
    // Validate file size
    if (icon && icon.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    return this.categoriesService.update(id, dto, icon);
  }

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Permanently deletes a category and its icon from the system',
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
