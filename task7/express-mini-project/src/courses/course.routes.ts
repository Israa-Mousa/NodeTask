import { Router } from 'express';
import { courseController } from './course.controller';
import { isAuthenticated } from '../shared/middlewares/auth.middleware';
import { uploadSingle } from '../config/multer.config';
import { checkRole } from '../shared/middlewares/role.middleware';

const router = Router();

// إذا البيئة اختبارية، نستخدم middleware فارغ بدلاً من multer
const uploadMiddleware = process.env.NODE_ENV === "test"
  ? (req: any, res: any, next: any) => next()
  : uploadSingle("image");

// حماية routes مع multer و role
const authenticateAndCheckRole = [isAuthenticated, uploadMiddleware, checkRole(['ADMIN', 'COACH'])];

// GET جميع الكورسات
router.get(
  '/',
  // isAuthenticated,
  courseController.getCourses
);

// GET كورس حسب id بالبيك اي حد بقدر يشوفه مش شرط يكون مسجل دخول
router.get(
  '/:id',
  // isAuthenticated,     
  // checkRole(['STUDENT', 'ADMIN', 'COACH']),
  courseController.getCourse
);

// POST كورس جديد
router.post('/', authenticateAndCheckRole, courseController.createCourse);

// PUT تحديث كورس
router.put('/:id', authenticateAndCheckRole, courseController.updateCourse);

// DELETE حذف كورس
router.delete('/:id', authenticateAndCheckRole, courseController.deleteCourse);

export const courseRouter = router;
