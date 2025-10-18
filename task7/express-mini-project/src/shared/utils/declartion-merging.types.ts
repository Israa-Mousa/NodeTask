import { object } from "zod";
import { extend } from "zod/mini";
import { UnifiedApiErrorResponse } from "../middlewares/response.middleware";
import { User } from "../../users/user.entity";
import { Course } from "../../courses/course.entity";


export type MyEnvs={
     PORT:number;
    NODE_ENV:'development' | 'production' | 'test';
    SESSION_SECRET:string;
    JWT_SECRET:string;
    MONGODB_URL:string;
}

declare global{

namespace NodeJS{
  interface ProcessEnv extends MyEnvs{
 
  }
}
namespace Express {
 interface Response{
  create:(data:object)=>this ,
  ok:(data:object)=>this ,
 error:(data:UnifiedApiErrorResponse)=>this;
}
interface Request {
      user: User |undefined,
           course?: Course; 
            file?: Express.Multer.File; 
    }
}
}

