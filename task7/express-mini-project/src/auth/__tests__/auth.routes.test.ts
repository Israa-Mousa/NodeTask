import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { authRouter } from '../auth.routes';
import { UserModel } from '../../users/user.model';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/myapp-test';
    await mongoose.connect(MONGODB_URL);
  });

  beforeEach(async () => {
    // Clear users before each test
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user as STUDENT by default', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password1234' // 8+ chars
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: 'STUDENT'
      });
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email', // no @ sign
          password: 'password1234'
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 for short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: '123' // too short
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password1234'
      };

      // First registration
      await request(app).post('/api/v1/auth/register').send(userData);

      // Try to register again with same email
      const res = await request(app).post('/api/v1/auth/register').send(userData);

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Login Test',
          email: 'login@test.com',
          password: 'password1234'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@test.com',
          password: 'password1234'
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toMatchObject({
        email: 'login@test.com',
        role: 'STUDENT'
      });
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword123'
        });

      expect(res.status).toBe(401);
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'notfound@test.com',
          password: 'password1234'
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com'
          // password missing
        });

      expect(res.status).toBe(400);
    });
  });
});

