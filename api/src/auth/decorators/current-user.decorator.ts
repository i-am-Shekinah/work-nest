import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'generated/prisma/client';

type CurrentUserData = keyof User | undefined;

/**
 * Injects the authenticated user or a specific field from it.
 * Usage: @CurrentUser() user or @CurrentUser('id') userId
 */
export const CurrentUser = createParamDecorator(
  (data: CurrentUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
