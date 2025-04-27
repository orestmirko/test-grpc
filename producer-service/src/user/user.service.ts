import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    const usersPath = path.join(__dirname, '../data/users.json');
    this.users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  }

  getFilteredUsers(): User[] {
    return this.users.filter(user => user.age > 18);
  }
} 