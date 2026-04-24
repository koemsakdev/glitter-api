import { BrandStatus } from '../entities/brand.entity';

export interface BrandResponse {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  status: BrandStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandListResponse {
  data: BrandResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BrandDetailResponse {
  data: BrandResponse;
}
