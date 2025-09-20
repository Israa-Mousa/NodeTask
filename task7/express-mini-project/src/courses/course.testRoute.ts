import { Router } from 'express';
import { courseController } from './course.controller';
import { isAuthenticated } from '../shared/middlewares/auth.middleware';
import { uploadSingle } from '../config/multer.config';
import { checkRole } from '../shared/middlewares/role.middleware';

const router = Router();

const authenticateAndCheckRole = [isAuthenticated, uploadSingle('image'), checkRole(['ADMIN', 'COACH'])];



router.get('/', isAuthenticated, checkRole(['STUDENT', 'ADMIN', 'COACH']), courseController.getCourses);
router.get('/:id', isAuthenticated, checkRole(['STUDENT', 'ADMIN', 'COACH']), courseController.getCourse);

 router.post('/',authenticateAndCheckRole, courseController.createCourse);

router.put('/:id', authenticateAndCheckRole,courseController.updateCourse);
router.delete('/:id', authenticateAndCheckRole, courseController.deleteCourse);
//router.get('/', isAuthenticated, courseController.getCourses);
//router.get('/:id', isAuthenticated, courseController.getCourse);
//router.post('/', isAuthenticated, uploadSingle('image'), courseController.createCourse);
export  const courseRouter = router;
