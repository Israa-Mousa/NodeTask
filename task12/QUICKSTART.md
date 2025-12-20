# Quick Start Guide

## Setup Steps:

1. Install dependencies:
   npm install

2. Create .env file (copy from .env.example):
   cp .env.example .env
   # Then edit .env with your database credentials

3. Generate Prisma Client:
   npm run prisma:generate

4. Run database migrations:
   npm run prisma:migrate

5. Start development server:
   npm run dev

## Access Points:

- API Server: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## Test Users:

Register users with different roles:
- OWNER: Can create and manage rooms
- GUEST: Can browse and book rooms
- ADMIN: Can access dashboard and manage all data
