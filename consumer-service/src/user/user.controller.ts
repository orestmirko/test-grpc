import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getFilteredUsers() {
    try {
      const result = await firstValueFrom(this.userService.getFilteredUsers());
      console.log('Filtered Users:', result.users);
      return result.users;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
} 