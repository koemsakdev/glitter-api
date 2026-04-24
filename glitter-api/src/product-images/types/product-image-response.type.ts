import { ImageType } from '../entities/product-image.entity';

export interface ProductImageResponse {
  id: string;
  productId: string;
  imageUrl: string;
  imageAltTextEn: string | null;
  imageAltTextKm: string | null;
  imageType: ImageType;
  displayOrder: number;
  createdAt: Date;
}

export interface ProductImageListResponse {
  data: ProductImageResponse[];
  total: number;
}

export interface ProductImageDetailResponse {
  data: ProductImageResponse;
}

export interface ProductImageBulkResponse {
  data: ProductImageResponse[];
  total: number;
  uploaded: number;
}
