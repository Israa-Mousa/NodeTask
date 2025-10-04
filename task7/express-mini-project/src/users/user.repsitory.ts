import { prisma } from 'src/prisma/service/prisma.service';
import { createArgonHash } from '../shared/utils/argon.utils';
import { Role } from './role.enum';
// import { User } from '../../../src/generated/prisma';
import { User } from '../src/generated/prisma';
import { Console } from 'node:console';
import { r } from '@faker-js/faker/dist/airline-CHFQMWko';

// import { prisma } from '../prisma/service/prisma.service';
export class UserRepository {

  private prismaUser=prisma.user;
  async findAll(): Promise<User[]> {
    return this.prismaUser.findMany();
  }

  async findById(id: string | number): Promise<User | null> {
    console.log("xxxxxxxxxxxxxxx"+typeof id);
  const numericId = typeof id === "string" ? Number(id) : id;
  return this.prismaUser.findUnique({
    where: { id: numericId },
  });
}


  async findByEmail(email: string): Promise<User | null> {
    return this.prismaUser.findUnique({
      where: { email },
    });
  }

  async create(
    name: string,
    email: string,
    originalPassword: string,
    role: Role
  ): Promise<User> {
    const password = await createArgonHash(originalPassword);
    console.log(role);
    return this.prismaUser.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }

  async update(
    id:number,
    name?: string,
    email?: string,
    role?: Role
  ): Promise<User | null> {
    try {
      console.log('Updating user:', { id, name, email, role });
      const data: any = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (role) data.role = role;
      data.updatedAt = new Date();

      return this.prismaUser.update({ where: { id }, data });
    } catch (err) {
      console.error('Update user error:', err);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaUser.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const userRepository = new UserRepository();
