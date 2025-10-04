
import { string } from 'zod';
import { Course } from '../src/generated/prisma';
import { prisma } from '../prisma/service/prisma.service';
import { Prisma } from '../src/generated/prisma';

export class CourseRepository {

   private prismaCourse=prisma.course;
  // findAll():Promise< Course[]> {
  //   return this.prismaCourse.findMany({
  //      //where: query
  //   });
  // }
  findAll(query: Prisma.CourseFindManyArgs['where']) {
    return this.prismaCourse.findMany({
      where: query
    });
  }

  findById(id: number) {  
     return this.prismaCourse.findUniqueOrThrow({
      where:{id}
    })
    
  }
 async create(
    title: string,
    description: string,
    createdBy: number,
    image?: string
  ): Promise<Course> {
    return this.prismaCourse.create({
      data: {
        title,
        description,
        createdBy,
        image,
      },
    });
  }

    async update(id: number, updatedCourse: Partial<Course>): Promise<Course | null> {
    try {
      return this.prismaCourse.update({
        where: { id },
        data: { ...updatedCourse },
      });
    } catch (err) {
      return null;
    }
  }


  delete(id: number) {
   return this.prismaCourse.delete({
      where:{id:Number(id)}
    })
}
}
export const courseRepository = new CourseRepository();
