import { Injectable, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { CustomJwtService } from '@providers';
import { RedisService } from '../cache/redis.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization is required');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);

      const sessionKey =
        payload.role === 'admin' ? `admin_session:${payload.sub}` : `user_session:${payload.sub}`;

      const sessionExists = await this.redisService.exists(sessionKey);

      if (!sessionExists) {
        throw new UnauthorizedException('Session expired or not found');
      }

      const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler());
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new UnauthorizedException(`${payload.role} access required`);
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
