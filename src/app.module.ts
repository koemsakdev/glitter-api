import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { BrandsModule } from './brands/brands.module';
import { BranchModule } from './branch/branch.module';
import { StaffModule } from './staff/staff.module';
import { CategoriesModule } from './category/category.module';
import { ProductsModule } from './products/product.module';
import { ProductImagesModule } from './product-images/product-image.module';
import { ProductVariantsModule } from './product-variants/product-variant.module';
import { InventoryBranchModule } from './inventory-branch/inventory-branch.module';
import { ProductBadgesModule } from './product-badges/product-badge.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/upload',
      exclude: ['/api*'],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AppSettingsModule,
    BranchModule,
    StaffModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    ProductImagesModule,
    ProductVariantsModule,
    InventoryBranchModule,
    ProductBadgesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
