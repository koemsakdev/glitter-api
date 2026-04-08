import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Import InjectRepository
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandEntity } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandEntity) // Inject the repository correctly here
    private readonly brandRepository: Repository<BrandEntity>, // Access the repository through this
  ) {}

  // Create a new brand
  async create(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    const existingBrand = await this.brandRepository.findOne({
      where: { name: createBrandDto.name },
    });

    if (existingBrand) {
      throw new ConflictException('Brand already exists with this name');
    }

    const brand = this.brandRepository.create(createBrandDto);
    await this.brandRepository.save(brand);
    return brand;
  }

  // Get all brands
  async findAll(): Promise<BrandEntity[]> {
    return await this.brandRepository.find();
  }

  // Get brand by ID
  async findOneById(id: string): Promise<BrandEntity> {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  // Update a brand by ID
  async update(
    id: string,
    createBrandDto: CreateBrandDto,
  ): Promise<BrandEntity> {
    const brand = await this.findOneById(id);
    Object.assign(brand, createBrandDto); // Update the existing brand with new data
    await this.brandRepository.save(brand);
    return brand;
  }

  // Delete a brand by ID
  async delete(id: string): Promise<void> {
    const brand = await this.findOneById(id);
    await this.brandRepository.remove(brand);
  }
}
