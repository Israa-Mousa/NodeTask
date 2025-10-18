import { IGenericRepository } from "src/shared/repositories/generic-repo-interface";
import { User } from "../user.entity";

export interface UserRepositoryI extends IGenericRepository<User> {
  // Override: findAll with pagination
  findAll(page?: number, limit?: number): Promise<{ users: User[], totalRecords: number }>;
  
  // Additional method: find by email
  findByEmail(email: string): Promise<User | null>;

  // Override: create with specific parameters
  create(name: string, email: string, password: string, role: string): Promise<User>;

  // Override: update with specific parameters
  update(id: number | string, name?: string, email?: string): Promise<User | null>;
  
  // Inherited from IGenericRepository:
  // - findById(id: number | string): Promise<User | null>;
  // - delete(id: number | string): Promise<boolean>;
}
