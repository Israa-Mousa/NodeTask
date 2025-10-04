// import { DatabaseEntity } from "../shared/repositories/generic.repository";
// import { Role } from "./role.enum";

// export interface User extends DatabaseEntity  {
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
// }




import { User as PrismaUser } from '../../../src/generated/prisma';

export type User = PrismaUser;