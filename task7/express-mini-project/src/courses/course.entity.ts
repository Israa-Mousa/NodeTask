// import { DatabaseEntity } from "../shared/repositories/generic.repository";

// export interface Course extends DatabaseEntity {
//   title: string;
//   description: string;
//   image?: string;
//   createdBy: string; 
// }
import { Course as PrismaCourse } from '../src/generated/prisma';
// import { v4 as uuidv4 } from 'uuid';
// import { PrismaClient } from '@prisma/client';
export type Course = PrismaCourse;