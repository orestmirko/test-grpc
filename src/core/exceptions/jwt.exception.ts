import { UnauthorizedException } from '@nestjs/common';

export class JwtException extends UnauthorizedException {
  constructor(message: string = 'JWT token is invalid') {
    super(message);
  }
}
