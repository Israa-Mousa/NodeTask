import { app } from "../../server";  
import supertest from "supertest";
import { createRandomUser } from "../../seeds/user.seed";
import { signJwt } from "../../shared/utils/jwt.utils";
import { Role } from "../../users/role.enum"; 
import { userRepository } from "../../users/user.repsitory"; 

export type TestClients = {
  authedClient: ReturnType<typeof supertest.agent>;
  studentClient: ReturnType<typeof supertest.agent>;
  unAuthedClient: ReturnType<typeof supertest.agent>;
  users: {
    adminUser: any;
    coachUser: any;
    studentUser: any;
  };
};

export const setupTestClients = async (): Promise<TestClients> => {
  console.log("=== Test Setup Started ===");

  const adminUser = createRandomUser(Role.ADMIN);
  const coachUser = createRandomUser(Role.COACH);
  const studentUser = createRandomUser(Role.STUDENT);

  await userRepository.save(adminUser);
  await userRepository.save(coachUser);
  await userRepository.save(studentUser);
  
  console.log("Users in Repository:", userRepository.findAll());

  const adminToken = signJwt({ sub: adminUser.id, role: adminUser.role });
  const coachToken = signJwt({ sub: coachUser.id, role: coachUser.role });
  const studentToken = signJwt({ sub: studentUser.id, role: studentUser.role });

  console.log("Admin Token:", adminToken);
  console.log("Coach Token:", coachToken);
  console.log("Student Token:", studentToken);

  const authedClient = supertest.agent(app).set("Authorization", `Bearer ${coachToken}`);
  const studentClient = supertest.agent(app).set("Authorization", `Bearer ${studentToken}`);
  const unAuthedClient = supertest.agent(app);

  console.log("Clients:", { authedClient, studentClient, unAuthedClient });

  return {
    authedClient,
    studentClient,  
    unAuthedClient,
    users: { adminUser, coachUser, studentUser },
  };
};
