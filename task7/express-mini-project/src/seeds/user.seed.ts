import { faker } from "@faker-js/faker";
// import { User, Role } from "../../../src/generated/prisma";
import { User, Role } from "../src/generated/prisma";
import { createArgonHash } from '../shared/utils/argon.utils';


export async function createRandomUser(): Promise<Omit<User, 'id'>> {
    const hashedPassword = await createArgonHash("12345678"); 

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    // password: faker.internet.password(),
    password:hashedPassword,
    role: faker.helpers.arrayElement([Role.COACH, Role.ADMIN,Role.STUDENT]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}

