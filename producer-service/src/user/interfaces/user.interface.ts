export interface User {
  id: number;
  name: string;
  age: number;
}

export interface UserList {
  users: User[];
}

export interface Empty {} 