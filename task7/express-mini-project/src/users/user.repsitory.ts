import { createArgonHash } from '../shared/utils/argon.utils';
import { Role } from './role.enum';
import { User } from './user.entity';
import {userData}  from './user.data'; 
export class UserRepository {
  private users: User[] = [];
  private idCounter = 1;
   constructor(userDb: Promise<User[]> = userData) {
    // Wait for the promise to resolve
    userDb.then((users) => {
      this.users = users;
      this.idCounter = users.length + 1;
    }).catch((err) => {
      console.error('Failed to load initial users:', err);
    });
  }
  // constructor(userDb:Promise<User[]>=userData) {

  //  this.users  =userDb;
  // }
  // async init() {
  //   this.users = [
  //     {
  //       id: '1',
  //       name: 'Admin',
  //       email: 'admin@no.com',
  //       password: await createArgonHash('12345678'),
  //       role: Role.ADMIN,
  //       createdAt: new Date('2025-01-01T10:00:00Z'),
  //       updatedAt: new Date('2025-01-01T10:00:00Z'),
  //     },
  //     {
  //       id: '2',
  //       name: 'Belal',
  //       email: 'belal@example.com',
  //       password: await createArgonHash('12345678'),
  //       role: Role.COACH,
  //       createdAt: new Date('2025-03-01T14:30:00Z'),
  //       updatedAt: new Date('2025-03-01T14:30:00Z'),
  //     },
  //     {
  //       id: '3',
  //       name: 'israa',
  //       email: 'isra@gmail.com',
  //       password: await createArgonHash('12345678'),
  //       role: Role.STUDENT,
  //       createdAt: new Date('2025-02-01T12:00:00Z'),
  //       updatedAt: new Date('2025-02-01T12:00:00Z'),
  //     },
  //   ];

  //   this.idCounter = this.users.length + 1;
  // }

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  async create(
    name: string,
    email: string,
    originalPassword: string,
    role: Role
  ): Promise<User> {
    const password = await createArgonHash(originalPassword); 
    const user: User = {
      id: this.idCounter.toString(),
      name,
      email,
      password,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.idCounter++;
    this.users.push(user);
    console.log('Created user:', user);
    return user;
  }

  update(
    id: string,
    name?: string,
    email?: string,
    role?: Role
  ): User | null {
    const user = this.findById(id);
    if (!user) return null;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    user.updatedAt = new Date();

    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

export const userRepository = new UserRepository();
