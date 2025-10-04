import { prisma } from 'src/prisma/service/prisma.service';
import { createArgonHash } from '../shared/utils/argon.utils';
import { Role } from './role.enum';
import { User } from '../../../src/generated/prisma';
// import { prisma } from '../prisma/service/prisma.service';
export class UserRepository {

  private prismaUser=prisma.user;
  async findAll(): Promise<User[]> {
    return this.prismaUser.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return this.prismaUser.findUnique({
      where: { id: id },
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
    id: string,
    name?: string,
    email?: string,
    role?: Role
  ): Promise<User | null> {
    try {
      return this.prismaUser.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
          role,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      return null; // لو ID مش موجود
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaUser.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const userRepository = new UserRepository();
