import mongoose from "mongoose";
import { Course } from "./course.entity";
import { schemaToJsonDefaultOption } from "../config/mongoose.config";

const courseSchema = new mongoose.Schema<Course>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId,  // ✅ ObjectId للـ reference
      ref: 'User',  // ✅ العلاقة مع User model
      required: true 
    },
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: schemaToJsonDefaultOption
  }
);

export const CourseModel = mongoose.model<Course>('Course', courseSchema);

