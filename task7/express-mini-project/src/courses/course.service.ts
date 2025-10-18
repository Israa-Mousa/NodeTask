import { Course } from './course.entity';
import { CustomError } from '../shared/utils/exception';
import { CreateCourseDTO, UpdateCourseDTO } from './course.dto';
import { CourseRepositoryI } from './interfaces/course-repo-interface';
import { courseMongoRepository } from './course-mongo-repository';

class CourseService {
  constructor(private courseRepo: CourseRepositoryI = courseMongoRepository) {}

  getCourses(page: number = 1, limit: number = 10): Promise<Course[]> {
    return this.courseRepo.findAll();
  }

  getCourse(id: number | string) {
    return this.courseRepo.findById(id);
  }

  createCourse(
    title: string,
    description: string,
    createdBy: number | string,
    image?: string
  ) {
    return this.courseRepo.create(title, description, createdBy, image);
  }

  async updateCourse(
    id: number | string,
    updateData: Partial<UpdateCourseDTO>
  ) {
    const course = await this.courseRepo.findById(id);
    if (!course) {
      throw new CustomError("Course not found", "COURSE", 404);
    }
    return this.courseRepo.update(id, updateData);
  }

  deleteCourse(id: number | string) {
    return this.courseRepo.delete(id);
  }

  async findById(id: number | string): Promise<Course | null> {
    const course = await this.courseRepo.findById(id);
    if (!course) return null;
    return course;
  }
}

export const courseService = new CourseService();
