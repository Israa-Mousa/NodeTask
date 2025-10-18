import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { userRouter } from '../user.route';
import { authRouter } from '../../auth/auth.routes';
import { UserModel } from '../user.model';
import mongoose from 'mongoose';
import { responseEnhancer } from '../../shared/middlewares/response.middleware';

const app = express();
app.use(express.json());
app.use(responseEnhancer);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

describe('User Routes', () => {
  let studentToken: string;
  let coachToken: string;
  let adminToken: string;
  let studentUser: any;
  let coachUser: any;
  let adminUser: any;

  beforeAll(async () => {
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/myapp-test';
    await mongoose.connect(MONGODB_URL);
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});

    // Create student user
    const studentRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Student User',
        email: 'student@test.com',
        password: 'password1234'
      });
    studentToken = studentRes.body.data.token;
    studentUser = studentRes.body.data.user;

    // Create admin user
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: await require('argon2').hash('admin1234'),
      role: 'ADMIN'
    });
    
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin1234'
      });
    adminToken = adminLoginRes.body.data.token;
    adminUser = adminLoginRes.body.data.user;

    // Create coach user
    const coachRes = await request(app)
      .post('/api/v1/users/coach')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Coach User',
        email: 'coach@test.com',
        password: 'password1234'
      });
    
    const coachLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'coach@test.com',
        password: 'password1234'
      });
    coachToken = coachLoginRes.body.data.token;
    coachUser = coachLoginRes.body.data.user;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        email: 'student@test.com',
        role: 'STUDENT'
      });
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/v1/users/me');

      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/v1/users/me', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Updated Name',
          email: 'newemail@test.com'
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        name: 'Updated Name',
        email: 'newemail@test.com'
      });
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put('/api/v1/users/me')
        .send({ name: 'New Name' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          email: 'invalid-email'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/users/coach', () => {
    it('should allow ADMIN to create COACH user', async () => {
      const res = await request(app)
        .post('/api/v1/users/coach')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Coach',
          email: 'newcoach@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        name: 'New Coach',
        email: 'newcoach@test.com',
        role: 'COACH'
      });
    });

    it('should return 403 for STUDENT trying to create COACH', async () => {
      const res = await request(app)
        .post('/api/v1/users/coach')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'New Coach',
          email: 'newcoach@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(403);
    });

    it('should return 403 for COACH trying to create COACH', async () => {
      const res = await request(app)
        .post('/api/v1/users/coach')
        .set('Authorization', `Bearer ${coachToken}`)
        .send({
          name: 'New Coach',
          email: 'newcoach@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/v1/users/coach')
        .send({
          name: 'New Coach',
          email: 'newcoach@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return list of users', async () => {
      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(200);
      expect(res.body.data.users).toEqual(expect.any(Array));
      expect(res.body.data.totalRecords).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .query({ page: 1, limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.data.users.length).toBeLessThanOrEqual(2);
    });
  });
});

