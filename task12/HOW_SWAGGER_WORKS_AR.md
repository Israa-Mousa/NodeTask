# كيف يعمل Swagger مع الـ APIs - شرح مفصل

## 🔧 المكونات الأساسية

### 1️⃣ المكتبات المستخدمة

```json
"swagger-jsdoc": "^6.2.8",      // لقراءة التعليقات وتحويلها لـ Swagger
"swagger-ui-express": "^5.0.0"   // لعرض واجهة Swagger في المتصفح
```

---

## 📁 الملفات المسؤولة

### 1. `src/config/swagger.ts` - إعداد Swagger

هذا الملف يحدد:
- **معلومات الـ API** (العنوان، الوصف، الإصدار)
- **السيرفر** (localhost:3000)
- **نوع الأمان** (JWT Bearer Token)
- **أين يبحث عن التعليقات** (`./src/routes/*.ts`)

```typescript
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Room Reservation System API',
      version: '1.0.0',
    },
    servers: [{
      url: 'http://localhost:3000',
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],  // 👈 هنا يبحث عن التعليقات
};
```

### 2. `src/server.ts` - ربط Swagger بالسيرفر

```typescript
import { setupSwagger } from './config/swagger';

// Swagger Documentation
setupSwagger(app);  // 👈 هنا يتم تفعيل Swagger

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
// ...
```

**ما يحدث:**
- `setupSwagger(app)` يضيف route جديد: `/api-docs`
- عندما تفتح `/api-docs`، Swagger UI يظهر
- Swagger UI يقرأ التعليقات من ملفات Routes

---

## 📝 كيف يتم ربط كل Endpoint؟

### الطريقة: استخدام تعليقات JSDoc مع `@swagger`

في كل ملف routes، كل endpoint له تعليق خاص يشرحه لـ Swagger:

#### مثال من `auth.routes.ts`:

```typescript
/**
 * @swagger                    👈 هذا يخبر Swagger أن يقرأ هذا التعليق
 * /api/auth/register:        👈 المسار (Path)
 *   post:                    👈 نوع الطلب (GET, POST, PUT, DELETE)
 *     summary: Register a new user
 *     tags: [Authentication] 👈 القسم في Swagger UI
 *     requestBody:           👈 البيانات المطلوبة
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:             👈 الردود المتوقعة
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', registerValidation, validate, register);
```

**كيف يعمل:**
1. Swagger يقرأ التعليق `@swagger`
2. يربط التعليق بالـ route: `router.post('/register', ...)`
3. يجمع كل المعلومات (Path, Method, Body, Responses)
4. يعرضها في Swagger UI

---

## 🔄 العملية الكاملة (من الكود إلى Swagger UI)

### الخطوة 1: كتابة التعليق في Route

```typescript
// src/routes/auth.routes.ts

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 */
router.post('/login', loginValidation, validate, login);
```

### الخطوة 2: Swagger يقرأ الملفات

في `swagger.ts`:
```typescript
apis: ['./src/routes/*.ts']  // يبحث في كل ملفات routes
```

`swagger-jsdoc` يمسح كل ملفات `*.ts` في مجلد `routes` ويبحث عن `@swagger`

### الخطوة 3: إنشاء Swagger Spec

```typescript
const swaggerSpec = swaggerJsdoc(options);
// swaggerSpec هو JSON يحتوي على كل المعلومات
```

### الخطوة 4: عرض Swagger UI

```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**ما يحدث:**
- عندما تفتح `/api-docs`
- `swaggerUi.serve` يقدم ملفات Swagger UI (HTML, CSS, JS)
- `swaggerUi.setup(swaggerSpec)` يمرر البيانات (swaggerSpec) للواجهة
- Swagger UI يعرض كل الـ endpoints بشكل جميل

---

## 🎯 مثال كامل: كيف يظهر Endpoint في Swagger

### الكود:

```typescript
// src/routes/room.routes.ts

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room (Owner only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []      👈 يحتاج Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post(
  '/',
  authenticate,
  authorize('OWNER'),
  roomValidation,
  validate,
  createRoom
);
```

### في Swagger UI يظهر كالتالي:

```
┌─────────────────────────────────────┐
│ POST /api/rooms                     │
│ Create a new room (Owner only)      │
│ 🔒 Requires authentication          │
├─────────────────────────────────────┤
│ [Try it out]                        │
│                                     │
│ Request body:                       │
│ {                                   │
│   "name": "",                       │
│   "price": 0,                       │
│   "capacity": 0                     │
│ }                                   │
│                                     │
│ [Execute]                           │
└─────────────────────────────────────┘
```

---

## 🔐 كيف يعمل Authorization (JWT Token)?

### 1. تعريف Security Scheme

في `swagger.ts`:
```typescript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
}
```

### 2. استخدامه في Route

```typescript
/**
 * @swagger
 * /api/rooms:
 *   post:
 *     security:
 *       - bearerAuth: []  👈 هنا نقول يحتاج Token
 */
```

### 3. في Swagger UI

- يظهر أيقونة قفل 🔒 بجانب الـ endpoint
- زر "Authorize" في الأعلى
- عندما تدخل Token، Swagger يضيفه تلقائياً في Header:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

---

## 📊 هيكل المشروع

```
src/
├── config/
│   └── swagger.ts          👈 إعداد Swagger
├── routes/
│   ├── auth.routes.ts      👈 تعليقات @swagger هنا
│   ├── room.routes.ts      👈 تعليقات @swagger هنا
│   ├── booking.routes.ts   👈 تعليقات @swagger هنا
│   └── admin.routes.ts     👈 تعليقات @swagger هنا
└── server.ts               👈 setupSwagger(app)
```

---

## 🎓 ملخص سريع

1. **كتابة التعليقات** → في ملفات Routes باستخدام `@swagger`
2. **إعداد Swagger** → في `swagger.ts` يحدد أين يبحث
3. **ربط بالسيرفر** → `setupSwagger(app)` في `server.ts`
4. **Swagger يقرأ** → `swagger-jsdoc` يمسح الملفات
5. **إنشاء Spec** → JSON يحتوي على كل المعلومات
6. **عرض UI** → `swagger-ui-express` يعرض الواجهة الجميلة

---

## 💡 نصائح

### لإضافة endpoint جديد في Swagger:

1. اكتب التعليق `@swagger` فوق الـ route
2. اتبع نفس الصيغة الموجودة
3. أعد تشغيل السيرفر
4. Swagger سيظهره تلقائياً!

### مثال لإضافة endpoint جديد:

```typescript
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Test' });
});
```

---

**الخلاصة:** Swagger يقرأ التعليقات من الكود ويعرضها في واجهة جميلة تلقائياً! 🎉

