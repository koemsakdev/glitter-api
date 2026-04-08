import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandsService } from './brands.service';
import { BrandEntity } from './entities/brand.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { createDiskStorage } from '../common/helpers/multer.helper';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully created' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: createDiskStorage('./uploads/brands'),
    }),
  )
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BrandEntity> {
    createBrandDto.logoUrl = file?.filename
      ? `uploads/brands/${file.filename}`
      : undefined;

    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'List of brands' })
  async findAll(): Promise<BrandEntity[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand details' })
  async findOneById(@Param('id') id: string): Promise<BrandEntity> {
    return this.brandsService.findOneById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand successfully updated' })
  async update(
    @Param('id') id: string,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<BrandEntity> {
    return this.brandsService.update(id, createBrandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand by ID' })
  @ApiResponse({ status: 204, description: 'Brand successfully deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.brandsService.delete(id);
  }
}
