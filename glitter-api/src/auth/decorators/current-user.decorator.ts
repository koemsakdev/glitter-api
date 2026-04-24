import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../users/entities/user.entity';

/**
 * Inject the currently authenticated user into a controller method.
 *
 * Usage:
 *   @Get('me')
 *   getProfile(@CurrentUser() user: UserEntity) {
 *     return user;
 *   }
 *
 * Or to get just a specific field:
 *   @Get('orders')
 *   getOrders(@CurrentUser('id') userId: string) {
 *     return this.ordersService.findByUser(userId);
 *   }
 *
 * Must be used on routes protected by JwtAuthGuard — otherwise user is undefined.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserEntity }>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
