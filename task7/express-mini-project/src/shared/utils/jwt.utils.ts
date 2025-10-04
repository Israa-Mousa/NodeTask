import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// تأكد من وجود الـ JWT_SECRET في البيئة
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment');
}

// إنشاء نوع مخصص للـ payload
export interface JwtCustomPayload {
  sub: string; // user ID
  // role: string; // مثلا role مثل admin, user، الخ
  name: string; // اسم المستخدم
}

export const signJwt = (payload: JwtCustomPayload, options?: SignOptions) => {
  // تأكد من استخدام السر JWT_SECRET وتحديد صلاحية التوقيع
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d', ...options });
};

export const verifyJwt = (token: string): JwtCustomPayload => {
  // التحقق من التوقيع وإرجاع البيانات المستخرجة
  return jwt.verify(token, JWT_SECRET) as JwtCustomPayload;
};
