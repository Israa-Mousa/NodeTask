import { Request, Response, NextFunction } from 'express';
import { CustomError, handleError } from '../shared/utils/exception';
import { courseService } from './course.service';
import { CreateCourseDTOSchema, UpdateCourseDTOSchema } from './course.dto';
import { zodValidation } from '../shared/utils/zod.utill';
import { userService } from '../users/user.service';

export class CourseController {
  private _courseService = courseService;

  getCourses = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const courses = await  this._courseService.getCourses(page, limit);
      res.ok(courses);
    } catch (error) {
      handleError(error, res);
    }
  };

  getCourse = async(req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const course =await this._courseService.getCourse(Number(req.params.id));
      if (!course) {
        throw new CustomError('Course not found', 'COURSE', 404);
      }
      res.ok(course);
    } catch (error) {
      handleError(error, res);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      const parsed = CreateCourseDTOSchema.safeParse(req.body);
      console.log('Parsed create data:', parsed);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
      }

      const { title, description } = parsed.data;
      const image = req.file ? req.file.filename : '';
      console.log('Image for new course:', image);
      const createdBy = req.user?.id || '';
     console.log('User creating course:', createdBy);
      const newCourse = await this._courseService.createCourse(title, description,Number(createdBy), image);
      const creator = await userService.findById(Number(createdBy));

    const response = {
      ...newCourse,
      createdBy: creator?.name || 'Unknown'
    };

    res.create(response);
    //res.create(newCourse);
    } catch (error) {
      handleError(error, res);
    }
  };


updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
         console.log(' update data:' ,req.user);

    const parsed = zodValidation(UpdateCourseDTOSchema, req.body, 'COURSE');
     console.log('Parsed update data:', parsed);
    const { title, description } = parsed;

    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const existingCourse = await courseService.findById(courseId);
      console.log('Existing course:', existingCourse);
    if (!existingCourse) {
      throw new CustomError('Course not found', 'COURSE', 404);
    }

    const user = req.user;
    
    if (!user) {
      throw new CustomError('Unauthorized', 'AUTH', 401);
    }

    if (user.role === 'COACH' && existingCourse.createdBy !== user.id) {
      throw new CustomError('Forbidden: You can only edit your own courses', 'COURSE', 403);
    }

    
    const image = req.file ? req.file.filename : existingCourse.image?? undefined;
      console.log('Image for update:', image);
    const updatedCourse = await courseService.updateCourse(courseId, {
      title,
      description,
      createdBy: existingCourse.createdBy, 
      image,
    });
    if (!updatedCourse) {
      throw new CustomError('Course not found after update', 'COURSE', 404);
    }
 const creator = await userService.findById(updatedCourse.createdBy);

    const response = {
      ...updatedCourse,
      createdBy: creator?.name || 'Unknown'
    };

    res.create(response);
   // res.create(updatedCourse);
  } catch (error) {
    handleError(error, res);
  }
};

deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID required' });
    }

    const existingCourse = await this._courseService.findById(id);
    if (!existingCourse) {
      throw new CustomError('Course not found', 'COURSE', 404);
    }

    const user = req.user;
    if (!user) {
      throw new CustomError('Unauthorized', 'AUTH', 401);
    }

    if (user.role === 'COACH' && existingCourse.createdBy !== user.id) {
      throw new CustomError(
        'Forbidden: You can only delete your own courses',
        'COURSE',
        403
      );
    }

    const deleted = await this._courseService.deleteCourse(id);
    if (!deleted) {
      throw new CustomError('Course not found', 'COURSE', 404);
    }

    res.ok({ message: 'Course deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
};

}

export const courseController = new CourseController();
