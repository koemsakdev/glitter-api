import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity, type CategoryType } from './entities/category.entity';
import {
  CategoryResponse,
  CategoryListResponse,
  CategoryDetailResponse,
} from './types/category-response.type';

const CATEGORY_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'categories');

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    dto: CreateCategoryDto,
    iconFile?: Express.Multer.File,
  ): Promise<CategoryDetailResponse> {
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug: dto.slug },
    });

    if (existingSlug !== null) {
      throw new ConflictException(
        `Category with slug "${dto.slug}" already exists`,
      );
    }

    const categoryType: CategoryType = dto.categoryType ?? 'main';
    const displayOrder: number = dto.displayOrder ?? 0;

    let iconUrl: string | null = null;
    if (iconFile) {
      iconUrl = `/upload/categories/${iconFile.filename}`;
    }

    const entity = this.categoryRepository.create({
      slug: dto.slug,
      nameEn: dto.nameEn,
      nameKm: dto.nameKm,
      descriptionEn: dto.descriptionEn ?? null,
      descriptionKm: dto.descriptionKm ?? null,
      iconUrl,
      displayOrder,
      categoryType,
    });

    const saved = await this.categoryRepository.save(entity);
    const categoryData: CategoryResponse = this.toResponse(saved);
    return {
      data: categoryData,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<CategoryListResponse> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });

    const mappedData: CategoryResponse[] = categories.map(
      (category: CategoryEntity) => this.toResponse(category),
    );

    const response: CategoryListResponse = {
      data: mappedData,
      total: Number(total),
      page,
      limit,
    };
    return response;
  }

  async findOne(id: string): Promise<CategoryDetailResponse> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (category === null) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const categoryData: CategoryResponse = this.toResponse(category);
    return {
      data: categoryData,
    };
  }

  async findBySlug(slug: string): Promise<CategoryDetailResponse> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (category === null) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    const categoryData: CategoryResponse = this.toResponse(category);
    return {
      data: categoryData,
    };
  }

  async findByType(
    categoryType: CategoryType,
    page: number = 1,
    limit: number = 10,
  ): Promise<CategoryListResponse> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { categoryType },
      skip,
      take: limit,
      order: {
        displayOrder: 'ASC',
      },
    });

    const mappedData: CategoryResponse[] = categories.map(
      (category: CategoryEntity) => this.toResponse(category),
    );

    const response: CategoryListResponse = {
      data: mappedData,
      total: Number(total),
      page,
      limit,
    };
    return response;
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
    iconFile?: Express.Multer.File,
  ): Promise<CategoryDetailResponse> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (category === null) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if new slug is already in use
    if (
      dto.slug !== undefined &&
      dto.slug !== null &&
      dto.slug !== category.slug
    ) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existingSlug !== null) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    // Update only provided fields
    if (dto.slug !== undefined && dto.slug !== null) {
      category.slug = dto.slug;
    }
    if (dto.nameEn !== undefined && dto.nameEn !== null) {
      category.nameEn = dto.nameEn;
    }
    if (dto.nameKm !== undefined && dto.nameKm !== null) {
      category.nameKm = dto.nameKm;
    }
    if (dto.descriptionEn !== undefined) {
      category.descriptionEn = dto.descriptionEn;
    }
    if (dto.descriptionKm !== undefined) {
      category.descriptionKm = dto.descriptionKm;
    }

    // Handle icon upload
    if (iconFile) {
      // Delete old icon file if exists
      if (category.iconUrl) {
        await this.deleteIconFile(category.iconUrl);
      }
      // Set new icon URL from multer filename
      category.iconUrl = `/upload/categories/${iconFile.filename}`;
    }

    if (dto.displayOrder !== undefined && dto.displayOrder !== null) {
      category.displayOrder = dto.displayOrder;
    }
    if (dto.categoryType !== undefined && dto.categoryType !== null) {
      category.categoryType = dto.categoryType;
    }

    const updated = await this.categoryRepository.save(category);

    const categoryData: CategoryResponse = this.toResponse(updated);
    return {
      data: categoryData,
    };
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (category === null) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Delete icon file if exists
    if (category.iconUrl) {
      await this.deleteIconFile(category.iconUrl);
    }

    await this.categoryRepository.remove(category);
  }

  /**
   * Helper method to delete icon file from disk
   */
  private async deleteIconFile(iconUrl: string): Promise<void> {
    try {
      if (!iconUrl || !iconUrl.startsWith('/upload/categories/')) {
        return; // Skip if path is invalid
      }

      // Extract filename from URL path
      const filename = iconUrl.replace('/upload/categories/', '');
      const filePath = path.join(CATEGORY_UPLOAD_DIR, filename);

      // Check if file exists and delete
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // File doesn't exist, that's fine
        if (
          error instanceof Error &&
          'code' in error &&
          error.code === 'ENOENT'
        ) {
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting icon file:', error);
      // Don't throw error on deletion failure, just log it
    }
  }

  async findMainCategories(): Promise<CategoryListResponse> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { categoryType: 'main' },
      order: {
        displayOrder: 'ASC',
      },
    });

    const mappedData: CategoryResponse[] = categories.map(
      (category: CategoryEntity) => this.toResponse(category),
    );

    const response: CategoryListResponse = {
      data: mappedData,
      total: Number(total),
      page: 1,
      limit: Number(total),
    };
    return response;
  }

  private toResponse(entity: CategoryEntity): CategoryResponse {
    const response: CategoryResponse = {
      id: entity.id,
      slug: entity.slug,
      nameEn: entity.nameEn,
      nameKm: entity.nameKm,
      descriptionEn: entity.descriptionEn,
      descriptionKm: entity.descriptionKm,
      iconUrl: entity.iconUrl,
      displayOrder: entity.displayOrder,
      categoryType: entity.categoryType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return response;
  }
}
