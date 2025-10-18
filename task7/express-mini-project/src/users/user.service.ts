import { User } from "./user.entity";
import { Role } from "./role.enum";
import { CustomError } from "../shared/utils/exception";
import { UpdateUserDTO } from "./user.dto";
import { UserRepositoryI } from "./interfaces/user-repo-interface";
import { userMongoRepository } from "./user-mongo-repository";

class UserService {
  constructor(private userRepo: UserRepositoryI = userMongoRepository) {}

  getUsers(page = 1, limit = 10) {
    return this.userRepo.findAll(page, limit);
  }

  async getUser(id: number | string) {
    return this.userRepo.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async updateUser(id: number | string, updateData: UpdateUserDTO) {
    return this.userRepo.update(id, updateData.name, updateData.email);
  }

async createUser(
  name: string,
  email: string,
  password: string,
  role: string = "STUDENT"
): Promise<Omit<User, "password">> {
  const userRole = Role[role as keyof typeof Role] || Role.STUDENT;
  const savedUser = await this.userRepo.create(name, email, password, userRole);
  
  // Convert to plain object if it's a Mongoose document
  const userPlain = typeof savedUser.toJSON === 'function' ? savedUser.toJSON() : savedUser;
  
  // Remove password field
  const { password: _, ...userWithoutPassword } = userPlain as any;
  return userWithoutPassword as Omit<User, "password">;
}

deleteUser(id: number | string) {
    return this.userRepo.delete(id);
  }
  
async isUserIdExist(id: number | string): Promise<boolean> {
  const user = await this.userRepo.findById(id);
  return !!user;
}


}

export const userService = new UserService();
