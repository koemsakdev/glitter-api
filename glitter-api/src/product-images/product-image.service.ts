import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { ProductEntity } from '../products/entities/product.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import {
  ProductImageEntity,
  type ImageType,
} from './entities/product-image.entity';
import {
  ProductImageBulkResponse,
  ProductImageDetailResponse,
  ProductImageListResponse,
  ProductImageResponse,
} from './types/product-image-response.type';

const PRODUCT_IMAGE_UPLOAD_DIR = path.join(
  process.cwd(),
  'uploads',
  'products',
);

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly imageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Create a single image record for a product
   */
  async create(
    dto: CreateProductImageDto,
    imageFile: Express.Multer.File,
  ): Promise<ProductImageDetailResponse> {
    if (!imageFile) {
      throw new BadRequestException('Image file is required');
    }

    // Validate product exists
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });
    if (product === null) {
      // Clean up the uploaded file since we won't be using it
      await this.deleteFileByFilename(imageFile.filename);
      throw new BadRequestException(
        `Product with ID ${dto.productId} not found`,
      );
    }

    const imageType: ImageType = dto.imageType ?? 'gallery';

    // If this image is marked 'primary', demote any existing primary image to 'gallery'
    if (imageType === 'primary') {
      await this.demoteExistingPrimary(dto.productId);
    }

    const entity = this.imageRepository.create({
      productId: dto.productId,
      imageUrl: `/upload/products/${imageFile.filename}`,
      imageAltTextEn: dto.imageAltTextEn ?? null,
      imageAltTextKm: dto.imageAltTextKm ?? null,
      imageType,
      displayOrder: dto.displayOrder ?? 0,
    });

    const saved = await this.imageRepository.save(entity);

    return {
      data: this.toResponse(saved),
    };
  }

  /**
   * Bulk upload multiple images for a product at once
   */
  async createBulk(
    productId: string,
    imageFiles: Express.Multer.File[],
    imageType: ImageType = 'gallery',
  ): Promise<ProductImageBulkResponse> {
    if (!imageFiles || imageFiles.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    // Validate product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (product === null) {
      // Clean up all uploaded files
      await Promise.all(
        imageFiles.map((file) => this.deleteFileByFilename(file.filename)),
      );
      throw new BadRequestException(`Product with ID ${productId} not found`);
    }

    // If bulk upload includes primary type, demote existing first
    if (imageType === 'primary') {
      await this.demoteExistingPrimary(productId);
    }

    // Get current max displayOrder for this product to append new images
    const lastImage = await this.imageRepository.findOne({
      where: { productId },
      order: { displayOrder: 'DESC' },
    });
    let nextOrder = lastImage ? lastImage.displayOrder + 1 : 0;

    const entities = imageFiles.map((file) => {
      const entity = this.imageRepository.create({
        productId,
        imageUrl: `/upload/products/${file.filename}`,
        imageAltTextEn: null,
        imageAltTextKm: null,
        imageType,
        displayOrder: nextOrder++,
      });
      return entity;
    });

    const saved = await this.imageRepository.save(entities);

    return {
      data: saved.map((entity: ProductImageEntity) => this.toResponse(entity)),
      total: saved.length,
      uploaded: saved.length,
    };
  }

  /**
   * Find all images for a specific product (ordered by displayOrder)
   */
  async findByProduct(productId: string): Promise<ProductImageListResponse> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (product === null) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const [images, total] = await this.imageRepository.findAndCount({
      where: { productId },
      order: {
        displayOrder: 'ASC',
        createdAt: 'ASC',
      },
    });

    return {
      data: images.map((image: ProductImageEntity) => this.toResponse(image)),
      total: Number(total),
    };
  }

  /**
   * Find primary image for a product
   */
  async findPrimary(productId: string): Promise<ProductImageDetailResponse> {
    const image = await this.imageRepository.findOne({
      where: { productId, imageType: 'primary' },
    });

    if (image === null) {
      throw new NotFoundException(
        `No primary image found for product ${productId}`,
      );
    }

    return {
      data: this.toResponse(image),
    };
  }

  async findOne(id: string): Promise<ProductImageDetailResponse> {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (image === null) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return {
      data: this.toResponse(image),
    };
  }

  async update(
    id: string,
    dto: UpdateProductImageDto,
    imageFile?: Express.Multer.File,
  ): Promise<ProductImageDetailResponse> {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (image === null) {
      // Clean up uploaded file if any (since update failed)
      if (imageFile) {
        await this.deleteFileByFilename(imageFile.filename);
      }
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // If changing imageType to 'primary', demote existing primary
    if (dto.imageType === 'primary' && image.imageType !== 'primary') {
      await this.demoteExistingPrimary(image.productId);
    }

    // Apply text field updates
    if (dto.imageAltTextEn !== undefined) {
      image.imageAltTextEn = dto.imageAltTextEn ?? null;
    }
    if (dto.imageAltTextKm !== undefined) {
      image.imageAltTextKm = dto.imageAltTextKm ?? null;
    }
    if (dto.imageType !== undefined) {
      image.imageType = dto.imageType;
    }
    if (dto.displayOrder !== undefined) {
      image.displayOrder = dto.displayOrder;
    }

    // Handle file replacement
    if (imageFile) {
      // Delete old file from disk
      await this.deleteImageFile(image.imageUrl);
      // Set new URL
      image.imageUrl = `/upload/products/${imageFile.filename}`;
    }

    const updated = await this.imageRepository.save(image);

    return {
      data: this.toResponse(updated),
    };
  }

  /**
   * Reorder multiple images at once (drag-and-drop gallery management)
   */
  async reorder(
    productId: string,
    dto: ReorderImagesDto,
  ): Promise<ProductImageListResponse> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (product === null) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const imageIds = dto.items.map((item) => item.id);
    const images = await this.imageRepository.find({
      where: { id: In(imageIds), productId },
    });

    if (images.length !== dto.items.length) {
      throw new BadRequestException(
        'One or more image IDs are invalid or do not belong to this product',
      );
    }

    // Build a map for quick lookup
    const orderMap = new Map(
      dto.items.map((item) => [item.id, item.displayOrder]),
    );

    // Apply new orders
    for (const image of images) {
      const newOrder = orderMap.get(image.id);
      if (newOrder !== undefined) {
        image.displayOrder = newOrder;
      }
    }

    await this.imageRepository.save(images);

    // Return fresh list in new order
    return this.findByProduct(productId);
  }

  async delete(id: string): Promise<void> {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (image === null) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // Delete file from disk
    await this.deleteImageFile(image.imageUrl);

    await this.imageRepository.remove(image);
  }

  /**
   * Delete all images for a product (used when deleting the product itself)
   */
  async deleteByProduct(productId: string): Promise<void> {
    const images = await this.imageRepository.find({ where: { productId } });

    if (images.length === 0) {
      return;
    }

    // Delete all files from disk
    await Promise.all(
      images.map((image) => this.deleteImageFile(image.imageUrl)),
    );

    await this.imageRepository.remove(images);
  }

  /**
   * Helper: demote any existing 'primary' image to 'gallery' for the product.
   * Ensures only one primary image exists per product.
   */
  private async demoteExistingPrimary(productId: string): Promise<void> {
    const existingPrimary = await this.imageRepository.findOne({
      where: { productId, imageType: 'primary' },
    });

    if (existingPrimary !== null) {
      existingPrimary.imageType = 'gallery';
      await this.imageRepository.save(existingPrimary);
    }
  }

  /**
   * Helper: delete image file from disk based on its URL path
   */
  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl || !imageUrl.startsWith('/upload/products/')) {
        return;
      }
      const filename = imageUrl.replace('/upload/products/', '');
      await this.deleteFileByFilename(filename);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  /**
   * Helper: delete file by filename
   */
  private async deleteFileByFilename(filename: string): Promise<void> {
    try {
      const filePath = path.join(PRODUCT_IMAGE_UPLOAD_DIR, filename);
      await fs.unlink(filePath);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return; // File already gone, that's fine
      }
      console.error('Error deleting file:', error);
    }
  }

  private toResponse(entity: ProductImageEntity): ProductImageResponse {
    return {
      id: entity.id,
      productId: entity.productId,
      imageUrl: entity.imageUrl,
      imageAltTextEn: entity.imageAltTextEn,
      imageAltTextKm: entity.imageAltTextKm,
      imageType: entity.imageType,
      displayOrder: entity.displayOrder,
      createdAt: entity.createdAt,
    };
  }
}
