import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { BrandEntity } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
