import { faker } from "@faker-js/faker";
import { User, Role } from "../../../src/generated/prisma";

export function createRandomUser(): Omit<User, 'id'> {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement([Role.COACH, Role.ADMIN,Role.STUDENT]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}

