import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import CONFIG from '@config';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secretKey = request.headers['x-super-admin-key'];

    if (!secretKey || secretKey !== CONFIG.ADMIN.SUPER_ADMIN_KEY) {
      throw new UnauthorizedException('Invalid super admin key');
    }

    return true;
  }
}
