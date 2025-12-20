# 🛍️ Simple Shop Backend - Enhanced Version

A NestJS-based e-commerce backend with advanced features including admin role management, secure admin actions, comprehensive transaction tracking, and enhanced pagination/sorting on all findAll routes.

---

## ✨ Features

### 👤 **Admin Role Management**
- ✅ Role-based access control (ADMIN, CUSTOMER, MERCHANT)
- ✅ Secure admin routes with `@Roles(['ADMIN'])` decorator
- ✅ JWT authentication for all protected routes
- ✅ Global AuthGuard and RolesGuard middleware

### 🛠️ **Secured Admin Actions**
- ✅ Update order status (PENDING → SUCCESS)
- ✅ Update return status (PENDING → PICKED → REFUND)
- ✅ Automatic CREDIT transaction generation on refund
- ✅ Permission-guarded endpoints with role validation

---

## 🏗️ Project Structure

```
simple-shop/
├── src/
│   ├── app.module.ts              # Main app with global guards
│   ├── main.ts                    # Bootstrap
│   ├── modules/
│   │   ├── auth/                  # Authentication & JWT
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts  # JWT validation
│   │   │   │   └── roles.guard.ts # Role authorization
│   │   │   └── ...
│   │   ├── user/                  # User management
│   │   ├── product/               # Product catalog
│   │   ├── order/                 # Order & return management
│   │   ├── transaction/           # Transaction tracking
│   │   ├── database/              # Prisma & pagination helpers
│   │   └── ...
│   ├── decorators/
│   │   ├── roles.decorator.ts     # @Roles(['ADMIN'])
│   │   ├── public.decorator.ts    # @IsPublic()
│   │   └── user.decorator.ts      # @User()
│   ├── utils/                     # Utilities
│   └── ...
├── prisma/
│   ├── schema.prisma              # Data models
│   └── migrations/                # Database migrations
├── .env.dev                       # Development environment
├── .env.prod                      # Production environment
├── package.json
├── IMPLEMENTATION_SUMMARY.md      # Feature details
├── API_TESTING_GUIDE.md           # Testing instructions
└── README.md                      # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 2. Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.dev .env
# Edit .env with your database credentials
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npm run seed
```

### 4. Run Application

```bash
# Development
npm run dev

# Production
npm run build
npm run start:prod
```

---

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login

### Users (Paginated, Sortable, Filterable)
- `GET /user` - List users
- `GET /user/:id` - Get user
- `PATCH /user/:id` - Update user

### Products (Paginated, Sortable, Searchable)
- `GET /product` - List products
- `POST /product` - Create product
- `GET /product/:id` - Get product
- `PATCH /product/:id` - Update product

### Orders (Paginated, Sortable)
- `GET /order` - List user's orders
- `POST /order` - Create order
- `GET /order/:id` - Get order
- **`POST /order/:id/status`** - Update order status (ADMIN ONLY)
- `POST /order/return` - Create return
- **`POST /order/return/:returnId/status`** - Update return status (ADMIN ONLY)

### Transactions (Paginated, Sortable)
- `GET /transaction` - List user's transactions

---

## 🔐 Security

- JWT authentication on all protected routes
- Role-based access control (ADMIN, CUSTOMER, MERCHANT)
- Global AuthGuard and RolesGuard
- Password encryption with Argon2
- Input validation with Zod

---

## 📊 Query Parameters

```
GET /order?page=1&limit=10&sortBy=createdAt&fields=id,orderStatus
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `sortBy` | enum | createdAt | Sort field |
| `fields` | string | all | Select fields |

---

## 📖 Documentation

- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature details
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - Testing examples

---

## ✅ What's Implemented

- [x] Admin role management with role-based guards
- [x] Secured admin actions (order & return status updates)
- [x] Transactions module with pagination
- [x] Enhanced findAll routes with pagination, sorting, field selection
- [x] Automatic CREDIT transaction on refund
- [x] Global error handling
- [x] JWT authentication
- [x] Input validation

---

## 🚀 Running

```bash
# Development
npm run dev

# Tests
npm run test

# E2E Tests
npm run test:e2e

# Production
npm run build
npm run start:prod
```

---

**Status:** ✅ All features implemented and compiled successfully!

- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
