import { app } from    "../../server";

import { userData } from    "../../users/user.data";
import TestAgent from 'supertest/lib/agent';
import supertest from "supertest";

import { signJwt } from "../../shared/utils/jwt.utils";
  export  let authedTestClient: TestAgent;
  export  let unAuthedTestClient: TestAgent;

export default async function () {
  const users = await userData;


  if (!users || users.length === 0) {
    throw new Error("No users found");
  }

  const user1 = users[0];
  if (!user1) {
    throw new Error("User data is undefined");
  }
  if (!user1.id || !user1.role) {
    throw new Error("User data is incomplete");
  }

  const token = signJwt({ sub: user1.id, role: user1.role });

authedTestClient= supertest(app).set("Authorization", `Bearer ${token}`).
set('Accept', 'application/json');

  unAuthedTestClient=supertest(app);   
}
