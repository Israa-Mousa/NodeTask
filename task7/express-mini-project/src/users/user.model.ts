import mongoose from "mongoose";
import { User } from "./user.entity";
import { schemaToJsonDefaultOption } from "../config/mongoose.config";

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: {
      type: String,
      validate: {
        validator: function (passwordValue: string) {
          return passwordValue.length >= 6;
        },
        message: 'Password should be at least 6 characters long'
      }
    },

  } ,{ timestamps: true,versionKey:false
    ,toJSON:schemaToJsonDefaultOption
  }
 
);

export const UserModel = mongoose.model<User>('User', userSchema);