import z, { ZodType } from 'zod';
import { User } from  './user.entity';
import { Role } from './role.enum';

export const userSchema = z.object({
  id: z.union([z.number(), z.string()]), // Support both number and string IDs
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  createdAt: z.date(),
  updatedAt: z.date(),
  password: z.string().min(8, "Password must be at least 8 characters"), // hash value
  role: z.nativeEnum(Role)
}) satisfies ZodType<User>;
