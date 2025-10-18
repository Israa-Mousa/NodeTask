//this is for database entity
export interface DatabaseEntity {
    id: number | string; // Support both Prisma (number) and Mongo (string)
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Generic Repository Interface - flexible base for all repositories
  export interface IGenericRepository<T extends DatabaseEntity> {
    findAll(...args: any[]): Promise<any>;
    findById(id: number | string): Promise<T | null>;
    create(...args: any[]): Promise<T>;
    update(id: number | string, ...args: any[]): Promise<T | null>;
    delete(id: number | string): Promise<boolean>;
  }
