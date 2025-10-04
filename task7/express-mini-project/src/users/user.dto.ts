import { Role } from './role.enum';
import { User } from './user.entity';
import { z } from 'zod';

// User DTO without password
export type UserDTO = Omit<User, 'password'>;

// Register DTO (for creating a new user)
export type RegisterDTO = Pick<User, 'email' | 'password' | 'name' | 'role'>;

// Register Response DTO (return user without password)
export type RegisterResponseDTO = Omit<User, 'password'>;

// Update User DTO (for updating user details)
export type UpdateUserDTO = Partial<Pick<User, 'name' | 'email' >>;

// Get User Profile DTO (to return user profile without password)
export type GetUserProfileDTO = Omit<User, 'password'>;

// Zod schema for Register DTO
export const RegisterDTOSchema = z.object({
  name:z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).default(Role.STUDENT), 
  // role: z.literal(Role.STUDENT).default(Role.STUDENT)
});

export const UpdateUserDTOSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
    ///password: z.string().min(6),


});
// Zod schema for Login DTO
export const LoginDTOSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
