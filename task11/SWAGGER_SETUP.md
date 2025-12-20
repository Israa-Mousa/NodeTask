# 🎨 Swagger UI Setup Guide

Your backend now has **Swagger UI integrated** for interactive API documentation and testing!

---

## 🚀 Accessing Swagger UI

Once the server is running, visit:

```
http://localhost:3000/docs
```

---

## 📋 What's in Swagger?

### ✅ Fully Documented Endpoints
- **Auth Module** - Register, login, validate JWT
- **Users Module** - CRUD operations with pagination
- **Products Module** - Create, read, update, delete products
- **Orders Module** - Order management and returns
- **Transactions Module** - User transaction history

### ✅ Features
- 📝 Request/Response schemas
- 🔐 JWT Bearer token authentication
- 🧪 Try it out feature (test endpoints directly)
- 📊 Query parameter documentation
- 🔄 Response examples

---

## 🔐 Testing with JWT in Swagger

### Step 1: Get a Token
1. Open Swagger at `http://localhost:3000/docs`
2. Go to **Auth** section
3. Click **POST /auth/login** endpoint
4. Click **Try it out**
5. Enter test credentials:
   ```json
   {
     "email": "test@example.com",
     "password": "Password123!"
   }
   ```
6. Execute and copy the JWT token from response

### Step 2: Authorize in Swagger
1. Click **Authorize** button at top right
2. Paste your JWT token in the format: `Bearer <your-token>`
3. Click **Authorize**
4. Now all protected endpoints will automatically include your token!

---

## 📡 Endpoint Groups in Swagger

### 🔓 Public Endpoints (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT

### 🔐 Protected Endpoints (JWT Required)
- **Users**: `GET /api/user`, `PATCH /api/user/:id`, `DELETE /api/user/:id`
- **Products**: `GET /api/product`, `POST /api/product`, etc.
- **Orders**: `GET /api/order`, `POST /api/order`, etc.
- **Transactions**: `GET /api/transaction` with pagination

### 👮 Admin-Only Endpoints (Admin role required)
- `POST /api/order/:id/status` - Update order status
- `POST /api/order/return/:returnId/status` - Update return status

---

## 🧪 Testing Checklist

### 1. Authentication Flow
- [ ] Register a new user (POST /auth/register)
- [ ] Login with credentials (POST /auth/login)
- [ ] Validate token (GET /auth/validate)

### 2. User Operations
- [ ] Get all users with pagination (GET /user?page=1&limit=10)
- [ ] Get specific user (GET /user/:id)
- [ ] Update user (PATCH /user/:id)
- [ ] Delete user (DELETE /user/:id)

### 3. Products
- [ ] List products with search (GET /product)
- [ ] Create product (POST /product) - Merchant only
- [ ] Get product details (GET /product/:id)
- [ ] Update product (PATCH /product/:id) - Merchant only
- [ ] Delete product (DELETE /product/:id) - Merchant only

### 4. Orders
- [ ] Create order (POST /order)
- [ ] List user orders (GET /order)
- [ ] Get order details (GET /order/:id)
- [ ] Create return request (POST /order/return)

### 5. Admin Actions (Test with ADMIN role token)
- [ ] Update order status (POST /order/:id/status)
- [ ] Update return status (POST /order/return/:returnId/status)

### 6. Transactions
- [ ] Get transactions (GET /transaction)
- [ ] Test pagination (add ?page=1&limit=10)
- [ ] Test sorting (add ?sortBy=createdAt)
- [ ] Test field selection (add ?fields=id,amount,type)

---

## 🛠️ Database Setup

Before testing, set up your MySQL database:

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE simple_shop0;
EXIT;

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed test data (optional)
npm run seed
```

Update `.env` with your database credentials:
```env
DATABASE_URL="mysql://root:password@localhost:3306/simple_shop0"
JWT_SECRET="dev-jwt-secret-key-change-in-production-12345"
```

---

## ⚙️ Query Parameters Guide

### Pagination Parameters
Available on all `GET` (list) endpoints:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (createdAt, id, etc.)
- `fields` - Comma-separated fields to return

Example:
```
GET /api/user?page=1&limit=5&sortBy=createdAt&fields=id,email,role
```

---

## 🔍 Understanding Response Format

All endpoints return a consistent format:

### List/Paginated Response
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### Single Item Response
```json
{
  "data": {...},
  "message": "Success"
}
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** Make sure you've authorized with a valid JWT token in Swagger

### Issue: "Forbidden" Error (Admin endpoints)
**Solution:** Your JWT token user must have ADMIN role. Login with an admin account.

### Issue: Database Connection Error
**Solution:** Ensure MySQL is running and credentials in .env are correct
```bash
# Check MySQL
mysql -u root -p -e "SELECT 1"
```

### Issue: Endpoints not showing in Swagger
**Solution:** Restart the server after code changes
```bash
# Kill and restart
npm run dev
```

---

## 📚 Swagger Features Used

- `@ApiTags()` - Organize endpoints by module
- `@ApiOperation()` - Describe what each endpoint does
- `@ApiResponse()` - Document success and error responses
- `@ApiBearerAuth()` - Mark endpoints requiring JWT
- `@ApiConsumes()` - Mark file upload endpoints
- `DocumentBuilder` - Configure API metadata
- `SwaggerModule` - Generate and serve Swagger UI

---

## 🎯 Next Steps

1. ✅ Start server: `npm run dev`
2. ✅ Open Swagger: http://localhost:3000/docs
3. ✅ Register a test user
4. ✅ Get JWT token from login
5. ✅ Authorize in Swagger with your token
6. ✅ Test all endpoints interactively
7. ✅ Check response formats and data

---

## 📖 OpenAPI/Swagger Spec

The full OpenAPI specification is available at:
```
http://localhost:3000/api-json
```

You can import this into:
- Postman
- Insomnia
- Any OpenAPI-compatible tool

---

**Server Status:** 
- Swagger UI: http://localhost:3000/docs
- API Base: http://localhost:3000/api/
- OpenAPI Spec: http://localhost:3000/api-json

Enjoy testing your API! 🚀
