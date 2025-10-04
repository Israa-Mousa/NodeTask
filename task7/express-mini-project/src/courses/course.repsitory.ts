
import { Course } from '../../../src/generated/prisma';
import { prisma } from '../../../prisma/service/prisma.service'
export class CourseRepository {

   private prismaCourse=prisma.course;
  findAll():Promise< Course[]> {
    return prisma.this.courses;
  }

  findById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  create(
    title: string,
    description: string,
    createdBy: string,
    image?: string
  ): Course {
    const newCourse: Course = {
      id: this.idCounter.toString(),
      title,
      description,
      createdBy,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.push(newCourse);  
    this.idCounter++; 
    return newCourse;
  }


  update(id: string, updatedCourse: Partial<Course>): Course | undefined {
    const course = this.courses.find(course => course.id === id);
    if (!course) return undefined;


    const index = this.courses.indexOf(course);
    const updatedData: Course = {
      ...course,
      ...updatedCourse,  
      updatedAt: new Date(),  
    };

    this.courses[index] = updatedData; 
    return updatedData;
  }

  delete(id: string): boolean {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return false;  
    this.courses.splice(index, 1); 
    return true;
  }
}

export const courseRepository = new CourseRepository();
