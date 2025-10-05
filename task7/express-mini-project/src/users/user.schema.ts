import z, { ZodType } from 'zod';
import { User } from  './user.entity';
import { Role } from './role.enum';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  password: z.string().min(8), // hash value
  role: z.nativeEnum(Role)
}) satisfies ZodType<User>;
