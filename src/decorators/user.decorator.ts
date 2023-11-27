import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      if (filter) {
        return request.user[filter];
      }
      return request.user;
    } else {
      throw new UnauthorizedException(
        'user is not authorized, please use AuthGuard for continue',
      );
    }
  },
);
