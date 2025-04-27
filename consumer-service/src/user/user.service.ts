import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Observable } from 'rxjs';
import { Empty, UserList } from './interfaces/user.interface';

interface IUserService {
  GetFilteredUsers(data: Empty): Observable<UserList>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private client: ClientGrpc;
  private userService: IUserService;

  constructor(private readonly configService: ConfigService) {}

  private getGrpcClientOptions() {
    return {
      transport: Transport.GRPC,
      options: {
        url: this.configService.getOrThrow<string>('GRPC_URL'),
        package: this.configService.getOrThrow<string>('GRPC_PACKAGE'),
        protoPath: this.configService.getOrThrow<string>('GRPC_PROTO_PATH'),
      },
    } as const;
  }

  onModuleInit() {
    this.client = ClientProxyFactory.create(this.getGrpcClientOptions()) as unknown as ClientGrpc;
    this.userService = this.client.getService<IUserService>('UserService');
  }

  getFilteredUsers() {
    return this.userService.GetFilteredUsers({});
  }
} 