import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { HttpErrorStatus, StringObject } from '../shared/utils/util.types';
import { LoginDTO, LoginResponseDTO, RegisterDTO, RegisterResponseDTO } from './types/auth.dto';
import { zodValidation } from '../shared/utils/zod.utill';
import { CustomError } from '../shared/utils/exception';
import { MODULES_NAMES } from '../shared/utils/constant';
import { signJwt } from '../shared/utils/jwt.utils';
import { loginDTOSchema, registerDTOSchema } from './auth.schema';
import { removeFields } from '../shared/utils/object.util';


export class AuthController {
  private authService = new AuthService();


  public async register(
    req: Request<{}, {}, RegisterDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payloadData = zodValidation(registerDTOSchema, req.body, "AUTH");
      const userData = await this.authService.register(payloadData);

      // إرسال النتيجة بدون كلمة المرور
      res.status(201).json(userData);
    } catch (error: any) {
      console.error(`[${MODULES_NAMES.auth}] Register error:`, error);
      res.status(error?.status || 500).json({
        message: error?.message || "Internal Server Error",
      });
    }
  }

  public async login(
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payloadData = zodValidation(loginDTOSchema, req.body, "AUTH");

      const userData = await this.authService.login(payloadData);

      if (!userData) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = signJwt({
        sub: String(userData.id),
        name: userData.name,
        // role: userData.role,
      });

      res.status(200).json({ user: userData, token });
    } catch (error: any) {
      console.error(`[${MODULES_NAMES.auth}] Login error:`, error);
      res.status(error?.status || 500).json({
        message: error?.message || "Internal Server Error",
      });
    }
  }

  public logout(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ message: "Logged out successfully" });
  }
}

export const authController = new AuthController();