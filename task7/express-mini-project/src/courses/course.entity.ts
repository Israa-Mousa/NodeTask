import { DatabaseEntity } from "../shared/repositories/generic-repo-interface";

export interface Course extends DatabaseEntity {
  title: string;
  description: string;
  image?: string;
  createdBy: number | string;
}

// Prisma type reference (for Prisma repo)
// import { Course as PrismaCourse } from '../src/generated/prisma';
// export type Course = PrismaCourse;