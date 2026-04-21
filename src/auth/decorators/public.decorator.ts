import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as publicly accessible (bypasses auth guards).
 *
 * Usage:
 *   @Public()
 *   @Get('public-products')
 *   listPublicProducts() {}
 *
 * Useful when guards are applied globally — this opts specific endpoints out.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
