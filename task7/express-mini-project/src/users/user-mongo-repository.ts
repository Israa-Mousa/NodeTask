import { UserRepositoryI } from "./interfaces/user-repo-interface";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import { createArgonHash } from "../shared/utils/argon.utils";

export class UserMongoRepository implements UserRepositoryI {
    async findAll(page: number, limit: number) {
      const users = await UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
  
      const totalRecords = await UserModel.countDocuments().exec();
  
      return { users, totalRecords };
    }
   findById(id: number | string): Promise<User | null> {
      return UserModel.findById(id).exec();
   }
    findByEmail(email: string) {
      return UserModel.findOne({email }).exec();
     }
   
   async create(name: string, email: string, password: string, role: string):Promise<User>{
     const hashedPassword = await createArgonHash(password);
     return UserModel.create({
       name,
       email,
       password: hashedPassword,
       role
     });
   }
  
   update(
     id: number | string,
     name?: string,
     email?: string,
   ):Promise<User | null> {
   return  UserModel.findByIdAndUpdate(id,{
       name,
       email,
     },{new:true}).exec();
  
   }
  
   async delete(id: number | string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
  
    return Boolean(result);
  }
  
  
  
    
  
  }
  export const userMongoRepository = new UserMongoRepository();