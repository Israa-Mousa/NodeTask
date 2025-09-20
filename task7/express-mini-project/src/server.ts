import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import { getEnvOrThrow } from "./shared/utils/utils";
import { handleError } from './shared/utils/exception';
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.routes";
import { responseEnhancer } from "./shared/middlewares/response.middleware";
import { isProduction } from './config/app.config';
import { courseRouter } from "./courses/course.routes";
import path from 'node:path';

// تحققات المتغيرات البيئية
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = getEnvOrThrow('PORT');

// تحقق إذا كانت المتغيرات غير موجودة
if (!JWT_SECRET || !SESSION_SECRET) {
  throw new Error("JWT_SECRET and SESSION_SECRET must be set in the environment.");
}

// التحقق من البيئة
console.log("JWT_SECRET:", JWT_SECRET);
console.log("SESSION_SECRET:", SESSION_SECRET);

// تطبيق الإعدادات في تطبيق Express
export const app = express();

const ApiRoute = '/api/v1/';

// تطبيق middleware الخاص بالاستجابة
app.use(responseEnhancer);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Express + TS server is running 🎉" });
});

// إضافة middleware لتسجيل المسارات التي يتم الوصول إليها
app.use((req, res, next) => {
  console.log(req.path, 'is hit');
  next();
});

// خدمة الملفات الثابتة
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      res.setHeader('cache-control', `public max-age=${5}`);
    }
  })
);

// تطبيق الـ Routers
app.use(ApiRoute + 'auth', authRouter);
app.use(ApiRoute + 'users', userRouter);
app.use(ApiRoute + 'courses', courseRouter);

// التعامل مع الأخطاء
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  handleError(error, res);
});

// تشغيل الخادم في بيئة غير "test"
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}
