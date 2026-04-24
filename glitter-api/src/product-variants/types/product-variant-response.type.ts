export interface ProductVariantResponse {
  id: string;
  productId: string;
  variantSku: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  quantityInStock: number;
  priceOverride: number | null;
  effectivePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantListResponse {
  data: ProductVariantResponse[];
  total: number;
}

export interface ProductVariantDetailResponse {
  data: ProductVariantResponse;
}

export interface ProductVariantBulkResponse {
  data: ProductVariantResponse[];
  total: number;
  created: number;
}

export interface ColorOption {
  color: string;
  colorHex: string | null;
  sizes: string[];
}

export interface SizeOption {
  size: string;
  colors: string[];
}

export interface ProductVariantOptionsResponse {
  data: {
    hasSingleVariant: boolean;
    colors: ColorOption[];
    sizes: SizeOption[];
  };
}
