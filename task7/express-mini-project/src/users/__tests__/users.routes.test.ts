import httpClient from 'supertest';
import { app } from '../../server';
import  {unAuthedTestClient,authedTestClient} from "../../tests/hepler/supertest.helper"
import { userData } from '../user.data';
import { create } from 'domain';
describe('userEndpoints', () => {
it('GET /api/v1/users with unauthed agent will throw error', async () => {
    const response = await unAuthedTestClient.get('/api/v1/users');
    expect(response.status).toBe(401);
  });

  it("GET /users should return array of users", async () => {
    const response = await authedTestClient.get('/users');

    expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual({
    //   success: true,
    //   data: (await userData).map((user) => ({
    //     ...user,
    //    createdAt: user.createdAt.toISOString(),
    // })),
      expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.any(Array)
  });
  });
  it("POST /users should create user and return user", async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: '12345678',
      role: 'STUDENT',
    };

    const response = await authedTestClient
      .post('/users')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: expect.objectContaining({
        id: expect.any(String),
        name: 'Test User',
        email: 'test@example.com',
        role: 'STUDENT',
      }),
    });
  });
});
