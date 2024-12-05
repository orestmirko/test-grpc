import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { CustomJwtService } from '@providers';

@Module({
  imports: [NestJwtModule.register({})],
  providers: [CustomJwtService],
  exports: [CustomJwtService],
})
export class JwtModule {}
