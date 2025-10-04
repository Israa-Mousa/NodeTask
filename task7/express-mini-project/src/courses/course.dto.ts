import { int, z } from 'zod';

export const CreateCourseDTOSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  createdBy: z.string().optional(),
  image: z.string().optional(),
}).strict();

export const UpdateCourseDTOSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
  createdBy: int(),
  image: z.string().optional(),
}).strict();

export type CreateCourseDTO = z.infer<typeof CreateCourseDTOSchema>;
export type UpdateCourseDTO = z.infer<typeof UpdateCourseDTOSchema>;
