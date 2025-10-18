import { IGenericRepository } from "../../shared/repositories/generic-repo-interface";
import { Course } from "../course.entity";

export interface CourseRepositoryI extends IGenericRepository<Course> {
  // Override: findAll with optional query
  findAll(query?: any): Promise<Course[]>;
  
  // Override: create with specific parameters
  create(
    title: string,
    description: string,
    createdBy: number | string,
    image?: string
  ): Promise<Course>;

  // Override: update with specific parameters
  update(id: number | string, updateData: Partial<Course>): Promise<Course | null>;
  
  // Inherited from IGenericRepository:
  // - findById(id: number | string): Promise<Course | null>;
  // - delete(id: number | string): Promise<boolean>;
}

