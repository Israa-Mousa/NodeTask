import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import { getEnvOrThrow } from "./shared/utils/utils";
import { handleError } from './shared/utils/exception';
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.routes";
import { responseEnhancer } from "./shared/middlewares/response.middleware";
import { isProduction } from './config/app.config';
import { userRepository } from "./users/user.repsitory";
import { courseRouter } from "./courses/course.routes";
import path from 'node:path';

//userRepository.init()
export const app = express();
const PORT = getEnvOrThrow('PORT');
const ApiRoute = '/api/v1/';


// Apply the responseEnhancer middleware here
app.use(responseEnhancer);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Express + TS server is running 🎉" });
});

app.use((req, res, next) => {
  console.log(req.path, 'is hit');
  next();
});

console.log('process.env.xxxxx', process.env.PORT);
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      res.setHeader('cache-control', `public max-age=${5}`);
    }
  })
);

//app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Now apply userRouter routes
app.use(ApiRoute+'auth', authRouter);
app.use(ApiRoute+'users', userRouter);
app.use(ApiRoute+'courses', courseRouter);


// Error handler middleware should be at the end
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  handleError(error, res);
});

if(process.env.NODE_ENV !== 'test'){
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
}