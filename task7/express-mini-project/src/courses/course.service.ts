import { Course } from './course.entity';
import { CustomError } from '../shared/utils/exception';
import { courseRepository } from './course.repsitory';
import { CreateCourseDTO, UpdateCourseDTO } from './course.dto';

class CourseService {
  // async public getCourses(page: number, limit: number): Course[] {
  // //  return courseRepository.findAll().slice((page - 1) * limit, page * limit);
  //    return courseRepository.findAll({});

  // }

    getCourses(page: number, limit: number):Promise< Course[]> {
   return courseRepository.findAll({});
 
  }

   public getCourse(id: number){
    return courseRepository.findById(id);
  }

  public  createCourse(
    title: string,
    description: string,
    createdBy: number,
    image: string
  )
      {
    return courseRepository.create(title, description, createdBy, image);
  }

 public  updateCourse(
    id: string,
    updateData: Partial<UpdateCourseDTO>
  ){
    const course =  courseRepository.findById(Number(id));
    if (!course) {
      throw new CustomError("Course not found", "COURSE", 404);
    }
    return courseRepository.update(Number(id), updateData); 
  }

   public  deleteCourse(id: string) {
    return courseRepository.delete(Number(id));
  }
    public async findById(id: string): Promise<Course | null> {
    const course = await courseRepository.findById(Number(id));
    if (!course) return null;
    return course;
  }
}

export const courseService = new CourseService();
