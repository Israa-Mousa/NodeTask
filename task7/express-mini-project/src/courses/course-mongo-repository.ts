import { CourseRepositoryI } from "./interfaces/course-repo-interface";
import { Course } from "./course.entity";
import { CourseModel } from "./course.model";

export class CourseMongoRepository implements CourseRepositoryI {
  async findAll(query?: any): Promise<Course[]> {
    if (query) {
      return CourseModel.find(query).populate('createdBy', 'name email').exec();
    }
    return CourseModel.find().populate('createdBy', 'name email').exec();
  }

  findById(id: number | string): Promise<Course | null> {
    return CourseModel.findById(id).populate('createdBy', 'name email').exec();
  }

  async create(
    title: string,
    description: string,
    createdBy: number | string,
    image?: string
  ): Promise<Course> {
    return CourseModel.create({
      title,
      description,
      createdBy,
      image
    });
  }

  async update(
    id: number | string,
    updateData: Partial<Course>
  ): Promise<Course | null> {
    return CourseModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
  }

  async delete(id: number | string): Promise<boolean> {
    const result = await CourseModel.findByIdAndDelete(id);
    return Boolean(result);
  }
}

export const courseMongoRepository = new CourseMongoRepository();

