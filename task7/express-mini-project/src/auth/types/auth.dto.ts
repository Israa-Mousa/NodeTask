import { User } from '../../users/user.entity';

// Login DTO
export type LoginDTO = {
  email: string;
  password: string;
};

// Login Response DTO (returns user data without password)
export type LoginResponseDTO = Omit<User, 'password'>;

// Register DTO for creating a new user (including role)
export type RegisterDTO = {
  email: string;
  password: string;
  name: string;
  role: string | undefined;
};

// Register Response DTO (returns user data without password)
export type RegisterResponseDTO = Omit<User, 'password'>;
