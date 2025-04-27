import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Empty, UserList } from './interfaces/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetFilteredUsers')
  getFilteredUsers(data: Empty): UserList {
    const users = this.userService.getFilteredUsers();
    return { users };
  }
} 