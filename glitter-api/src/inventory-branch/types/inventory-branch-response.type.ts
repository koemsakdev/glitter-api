export interface InventoryBranchResponse {
  id: string;
  productVariantId: string;
  branchId: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityDamaged: number;
  // Computed: total physical units at this branch
  totalQuantity: number;
  // Populated relations
  variant?: {
    id: string;
    variantSku: string;
    size: string | null;
    color: string | null;
    colorHex: string | null;
  };
  branch?: {
    id: string;
    branchCode: string;
    branchNameEn: string;
    branchNameKm: string;
  };
  product?: {
    id: string;
    sku: string;
    nameEn: string;
    nameKm: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryBranchListResponse {
  data: InventoryBranchResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface InventoryBranchDetailResponse {
  data: InventoryBranchResponse;
}

// --- Product availability across branches ---

export interface BranchAvailability {
  branchId: string;
  branchCode: string;
  branchNameEn: string;
  branchNameKm: string;
  variantId: string;
  variantSku: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  quantityAvailable: number;
  quantityReserved: number;
  quantityDamaged: number;
  totalQuantity: number;
}

export interface ProductAvailabilityResponse {
  data: {
    productId: string;
    nameEn: string;
    nameKm: string;
    branches: BranchAvailability[];
  };
}

// --- Branch summary ---

export interface BranchInventorySummary {
  branchId: string;
  totalVariants: number;
  totalUnitsAvailable: number;
  totalUnitsReserved: number;
  totalUnitsDamaged: number;
}

export interface BranchInventorySummaryResponse {
  data: BranchInventorySummary;
}
