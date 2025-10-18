import { Role } from "./role.enum";
import { DatabaseEntity } from "../shared/repositories/generic-repo-interface";

export interface User extends DatabaseEntity {
  name: string;
  email: string;
  password: string;
  role: Role;
}




//import { User as PrismaUser } from '../../../src/generated/prisma';
// import { User as PrismaUser } from '../src/generated/prisma';

// export type User = PrismaUser;