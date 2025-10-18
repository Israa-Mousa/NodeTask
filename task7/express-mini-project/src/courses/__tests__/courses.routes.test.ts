import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { courseRouter } from '../course.routes';
import { authRouter } from '../../auth/auth.routes';
import { userRouter } from '../../users/user.route';
import { CourseModel } from '../course.model';
import { UserModel } from '../../users/user.model';
import mongoose from 'mongoose';
import { responseEnhancer } from '../../shared/middlewares/response.middleware';

const app = express();
app.use(express.json());
app.use(responseEnhancer);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/courses', courseRouter);

describe('Course Routes', () => {
  let studentToken: string;
  let coachToken: string;
  let adminToken: string;
  let coach2Token: string;
  let studentUserId: string;
  let coachUserId: string;
  let adminUserId: string;
  let coach2UserId: string;
  let testCourseId: string;

  beforeAll(async () => {
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/myapp-test';
    await mongoose.connect(MONGODB_URL);
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await CourseModel.deleteMany({});

    // Create student
    const studentRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Student User',
        email: 'student@test.com',
        password: 'password1234'
      });
    studentToken = studentRes.body.data.token;
    studentUserId = studentRes.body.data.user.id;

    // Create admin
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
    adminUserId = adminLoginRes.body.data.user.id;

    // Create coach 1
    await request(app)
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
    coachUserId = coachLoginRes.body.data.user.id;

    // Create coach 2
    await request(app)
      .post('/api/v1/users/coach')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Coach 2',
        email: 'coach2@test.com',
        password: 'password1234'
      });
    
    const coach2LoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'coach2@test.com',
        password: 'password1234'
      });
    coach2Token = coach2LoginRes.body.data.token;
    coach2UserId = coach2LoginRes.body.data.user.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/courses', () => {
    it('should allow COACH to create a course', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${coachToken}`)
        .send({
          title: 'Test Course',
          description: 'Test Description'
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        title: 'Test Course',
        description: 'Test Description'
      });
      testCourseId = res.body.data.id;
    });

    it('should allow ADMIN to create a course', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Course',
          description: 'Admin Description'
        });

      expect(res.status).toBe(201);
    });

    it('should return 403 for STUDENT trying to create course', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Course',
          description: 'Should fail'
        });

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .send({
          title: 'Test Course',
          description: 'Test Description'
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', `Bearer ${coachToken}`)
        .send({
          title: ''
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/courses', () => {
    beforeEach(async () => {
      // Create test courses
      await CourseModel.create({
        title: 'Course 1',
        description: 'Description 1',
        createdBy: coachUserId
      });
      await CourseModel.create({
        title: 'Course 2',
        description: 'Description 2',
        createdBy: adminUserId
      });
    });

    it('should return list of all courses (public)', async () => {
      const res = await request(app).get('/api/v1/courses');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(expect.any(Array));
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should work without authentication', async () => {
      const res = await request(app).get('/api/v1/courses');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/courses/:id', () => {
    let courseId: string;

    beforeEach(async () => {
      const course = await CourseModel.create({
        title: 'Test Course',
        description: 'Test Description',
        createdBy: coachUserId
      });
      courseId = course._id.toString();
    });

    it('should return course by ID (public)', async () => {
      const res = await request(app).get(`/api/v1/courses/${courseId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        title: 'Test Course',
        description: 'Test Description'
      });
    });

    it('should return 404 for non-existent course', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/courses/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/courses/:id', () => {
    let courseId: string;

    beforeEach(async () => {
      const course = await CourseModel.create({
        title: 'Original Title',
        description: 'Original Description',
        createdBy: coachUserId
      });
      courseId = course._id.toString();
    });

    it('should allow course creator (COACH) to update their course', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${coachToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description'
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        title: 'Updated Title',
        description: 'Updated Description'
      });
    });

    it('should allow ADMIN to update any course', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Updated'
        });

      expect(res.status).toBe(201);
    });

    it('should return 403 for different COACH trying to update', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${coach2Token}`)
        .send({
          title: 'Should Fail'
        });

      expect(res.status).toBe(403);
    });

    it('should return 403 for STUDENT trying to update', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Should Fail'
        });

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${courseId}`)
        .send({
          title: 'Should Fail'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/courses/:id', () => {
    let courseId: string;

    beforeEach(async () => {
      const course = await CourseModel.create({
        title: 'To Delete',
        description: 'Will be deleted',
        createdBy: coachUserId
      });
      courseId = course._id.toString();
    });

    it('should allow course creator (COACH) to delete their course', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${coachToken}`);

      expect(res.status).toBe(200);
    });

    it('should allow ADMIN to delete any course', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should return 403 for different COACH trying to delete', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${coach2Token}`);

      expect(res.status).toBe(403);
    });

    it('should return 403 for STUDENT trying to delete', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .delete(`/api/v1/courses/${courseId}`);

      expect(res.status).toBe(401);
    });

    it('should return 404 for non-existent course', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/v1/courses/${fakeId}`)
        .set('Authorization', `Bearer ${coachToken}`);

      expect(res.status).toBe(404);
    });
  });
});

