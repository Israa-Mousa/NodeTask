# كيفية تشغيل المشروع / How to Run the Project

## الخطوات المطلوبة / Required Steps

### 1. تثبيت المكتبات / Install Dependencies
```bash
npm install
```

### 2. إعداد ملف البيئة / Setup Environment File
تأكد من وجود ملف `.env` مع البيانات التالية:
Make sure you have a `.env` file with the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/room_reservation?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
```

**ملاحظة مهمة:** استبدل `user` و `password` و `room_reservation` بقيم قاعدة البيانات الخاصة بك
**Important:** Replace `user`, `password`, and `room_reservation` with your database values

### 3. إعداد قاعدة البيانات / Setup Database

#### أ. إنشاء قاعدة البيانات / Create Database
تأكد من أن PostgreSQL يعمل وأنك أنشأت قاعدة بيانات باسم `room_reservation`
Make sure PostgreSQL is running and create a database named `room_reservation`

#### ب. توليد Prisma Client / Generate Prisma Client
```bash
npm run prisma:generate
```

#### ج. تشغيل Migrations / Run Migrations
```bash
npm run prisma:migrate
```

### 4. تشغيل السيرفر / Start the Server

#### وضع التطوير / Development Mode
```bash
npm run dev
```

#### وضع الإنتاج / Production Mode
```bash
npm run build
npm start
```

## الوصول إلى النظام / Access Points

بعد تشغيل السيرفر، يمكنك الوصول إلى:
After starting the server, you can access:

- **API Server**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## اختبار النظام / Testing the System

### 1. التسجيل / Registration
استخدم `/api/auth/register` لتسجيل مستخدم جديد
Use `/api/auth/register` to register a new user

**أمثلة / Examples:**
- **Owner**: `{ "email": "owner@test.com", "password": "123456", "name": "Owner Name", "role": "OWNER" }`
- **Guest**: `{ "email": "guest@test.com", "password": "123456", "name": "Guest Name", "role": "GUEST" }`
- **Admin**: `{ "email": "admin@test.com", "password": "123456", "name": "Admin Name", "role": "ADMIN" }`

### 2. تسجيل الدخول / Login
استخدم `/api/auth/login` للحصول على Token
Use `/api/auth/login` to get a Token

### 3. استخدام API
- استخدم Swagger UI في `/api-docs` لاختبار جميع الـ Endpoints
- Use Swagger UI at `/api-docs` to test all endpoints
- أو استخدم Postman مع Token في Header: `Authorization: Bearer <token>`
- Or use Postman with Token in Header: `Authorization: Bearer <token>`

## الأوامر المتاحة / Available Commands

- `npm run dev` - تشغيل السيرفر في وضع التطوير
- `npm run build` - بناء المشروع
- `npm start` - تشغيل السيرفر في وضع الإنتاج
- `npm run prisma:generate` - توليد Prisma Client
- `npm run prisma:migrate` - تشغيل Migrations
- `npm run prisma:studio` - فتح Prisma Studio لإدارة قاعدة البيانات

## استكشاف الأخطاء / Troubleshooting

### خطأ في الاتصال بقاعدة البيانات / Database Connection Error
- تأكد من أن PostgreSQL يعمل
- Make sure PostgreSQL is running
- تحقق من صحة `DATABASE_URL` في ملف `.env`
- Verify `DATABASE_URL` in `.env` file

### خطأ في Prisma / Prisma Error
- تأكد من تشغيل `npm run prisma:generate` قبل `npm run prisma:migrate`
- Make sure to run `npm run prisma:generate` before `npm run prisma:migrate`

### خطأ في Port / Port Error
- تأكد من أن Port 3000 غير مستخدم، أو غيّر PORT في `.env`
- Make sure Port 3000 is not in use, or change PORT in `.env`

