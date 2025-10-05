        
import { fa } from "zod/v4/locales";
import { userSchema } from "../users/user.schema";
import { LoginDTO, RegisterDTO } from "./types/auth.dto";
import z, { ZodType } from "zod";
import { Role } from "src/users/role.enum";

export const registerDTOSchema = userSchema.pick({
    name: true,
    email: true,
    password: true,
   // role:true
    }).extend({
    role: z.nativeEnum(Role).optional().default(Role.STUDENT),
  }) satisfies ZodType<RegisterDTO>;



    export const loginDTOSchema = userSchema.pick({ 
        email: true,
        password: true
    })satisfies ZodType<LoginDTO>;   