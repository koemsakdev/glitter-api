import { BadgeType } from '../entities/product-badge.entity';

export interface ProductBadgeResponse {
  id: string;
  productId: string;
  badgeType: BadgeType;
  badgeLabelEn: string | null;
  badgeLabelKm: string | null;
  badgeIconColor: string | null;
  badgeStartDate: Date | null;
  badgeEndDate: Date | null;
  // Computed: is this badge currently active based on start/end dates?
  isActive: boolean;
  createdAt: Date;
}

export interface ProductBadgeListResponse {
  data: ProductBadgeResponse[];
  total: number;
}

export interface ProductBadgeDetailResponse {
  data: ProductBadgeResponse;
}
