import { User } from "./user.entity";
import { Role } from "./role.enum";
import { userRepository } from "./user.repsitory";
import argon2 from "argon2";
import { CustomError } from "../shared/utils/exception";
import { UpdateUserDTO } from "./user.dto";
import { removeFields } from "../shared/utils/object.util";

class UserService {
  async getUsers(page: number, limit: number): Promise<User[]> {
    return (await userRepository.findAll()).slice((page - 1) * limit, page * limit);
  }

async getUser(id: number): Promise<Omit<User, "password">> {
      console.log("ssssssssssssssss"+typeof id);

  const user = await userRepository.findById(id);
  if (!user) throw new CustomError("User not found", "USER", 404);
  const { password, ...rest } = user;
  return rest;
}


async findByEmail(email: string): Promise<User | null> {
  return await userRepository.findByEmail(email);
}

async findById(id: number): Promise<User | null> {
  return await userRepository.findById(id);
}
async updateUser(id: number, updateData: UpdateUserDTO): Promise<Omit<User, "password">> {
  const updatedUser = await userRepository.update(
    id,
    updateData.name,
    updateData.email,
  );
  if (!updatedUser) throw new CustomError("User not found or failed to update", "USER", 404);
  const { password, ...rest } = updatedUser;
  return rest;
}

async createUser(
  name: string,
  email: string,
  password: string,
  role: string = "STUDENT"
): Promise<Omit<User, "password">> {
  const userRole = Role[role as keyof typeof Role] || Role.STUDENT;
  const savedUser = await userRepository.create(name, email, password,userRole);
  const { password: _, ...userWithoutPassword } = savedUser;
  return userWithoutPassword;
}



  // async createUser(name: string, email: string, password: string, role: string = "STUDENT"): Promise<User> {
  //   const userRole = Role[role as keyof typeof Role] || Role.STUDENT;
  //   const newUser: User = {
  //     id: (userRepository.findAll().length + 1).toString(),
  //     name,
  //     email,
  //     password,
  //     role: userRole,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };
  //    console.log('Creating user with data:', newUser);
  //   return  userRepository.create( name,email,password,userRole);
    
  // }

 deleteUser(id: number) {
    return userRepository.delete(id);
  }
  async isUserIdExist(id: number): Promise<boolean> {
  const user = await userRepository.findById(id);
  return !!user;
}


}

export const userService = new UserService();
