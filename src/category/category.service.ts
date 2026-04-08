import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity, type CategoryType } from './entities/category.entity';
import {
  CategoryResponse,
  CategoryListResponse,
  CategoryDetailResponse,
} from './types/category-response.type';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryDetailResponse> {
    // Check if slug already exists
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

    const entity = this.categoryRepository.create({
      slug: dto.slug,
      nameEn: dto.nameEn,
      nameKm: dto.nameKm,
      descriptionEn: dto.descriptionEn ?? null,
      descriptionKm: dto.descriptionKm ?? null,
      iconUrl: dto.iconUrl ?? null,
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
    if (dto.iconUrl !== undefined) {
      category.iconUrl = dto.iconUrl;
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

    await this.categoryRepository.remove(category);
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
