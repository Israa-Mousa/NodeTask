# دليل إعداد وتشغيل المشروع

## ✅ الخطوات المكتملة:
1. ✅ تثبيت المكتبات (`npm install`)
2. ✅ توليد Prisma Client (`npm run prisma:generate`)

## ⚠️ الخطوات المطلوبة:

### 1. إعداد قاعدة البيانات PostgreSQL

#### أ. تأكد من تشغيل PostgreSQL
- افتح **Services** في Windows
- ابحث عن **postgresql** وتأكد أنه يعمل (Running)

أو استخدم PowerShell:
```powershell
Get-Service -Name "*postgres*"
```

#### ب. إنشاء قاعدة البيانات
افتح **pgAdmin** أو **psql** وأنشئ قاعدة بيانات:

**طريقة 1: باستخدام psql**
```bash
psql -U postgres
CREATE DATABASE room_reservation;
\q
```

**طريقة 2: باستخدام pgAdmin**
1. افتح pgAdmin
2. انقر بزر الماوس الأيمن على **Databases**
3. اختر **Create** > **Database**
4. أدخل الاسم: `room_reservation`
5. احفظ

#### ج. تحديث ملف `.env`
افتح ملف `.env` وعدّل `DATABASE_URL`:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/room_reservation?schema=public"
```

**مثال:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/room_reservation?schema=public"
```

### 2. تشغيل Migrations
بعد إعداد قاعدة البيانات، شغّل:
```bash
npm run prisma:migrate
```

### 3. تشغيل السيرفر
```bash
npm run dev
```

## 📍 الوصول إلى النظام

بعد تشغيل السيرفر بنجاح:

- **API Server**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🧪 اختبار النظام

### 1. التسجيل (Register)
**Endpoint:** `POST /api/auth/register`

**مثال - Owner:**
```json
{
  "email": "owner@test.com",
  "password": "123456",
  "name": "Owner Name",
  "role": "OWNER"
}
```

**مثال - Guest:**
```json
{
  "email": "guest@test.com",
  "password": "123456",
  "name": "Guest Name",
  "role": "GUEST"
}
```

**مثال - Admin:**
```json
{
  "email": "admin@test.com",
  "password": "123456",
  "name": "Admin Name",
  "role": "ADMIN"
}
```

### 2. تسجيل الدخول (Login)
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "owner@test.com",
  "password": "123456"
}
```

**الرد سيكون:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. استخدام Token
استخدم الـ Token في Header عند استدعاء الـ APIs المحمية:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📚 الأوامر المتاحة

| الأمر | الوصف |
|------|-------|
| `npm run dev` | تشغيل السيرفر في وضع التطوير |
| `npm run build` | بناء المشروع |
| `npm start` | تشغيل السيرفر في وضع الإنتاج |
| `npm run prisma:generate` | توليد Prisma Client |
| `npm run prisma:migrate` | تشغيل Migrations |
| `npm run prisma:studio` | فتح Prisma Studio لإدارة قاعدة البيانات |

## 🔧 استكشاف الأخطاء

### خطأ: "Can't reach database server"
**الحل:**
1. تأكد من تشغيل PostgreSQL
2. تحقق من `DATABASE_URL` في `.env`
3. تأكد من أن Port 5432 مفتوح

### خطأ: "Database does not exist"
**الحل:**
أنشئ قاعدة البيانات يدوياً:
```sql
CREATE DATABASE room_reservation;
```

### خطأ: "Authentication failed"
**الحل:**
تحقق من اسم المستخدم وكلمة المرور في `DATABASE_URL`

## 🎯 الخطوات السريعة (Quick Start)

```bash
# 1. تأكد من إعداد قاعدة البيانات وملف .env
# 2. شغّل Migrations
npm run prisma:migrate

# 3. شغّل السيرفر
npm run dev

# 4. افتح المتصفح
# http://localhost:3000/api-docs
```

---

**ملاحظة:** إذا واجهت أي مشاكل، تحقق من:
- PostgreSQL يعمل
- قاعدة البيانات موجودة
- ملف `.env` صحيح
- جميع المكتبات مثبتة (`node_modules` موجود)

