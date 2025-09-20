import { faker } from "@faker-js/faker";
import { User } from "../users/user.entity";
import { Role } from "../users/role.enum";

export function createRandomUser(role: Role): User {
  return {
    id: faker.string.uuid(),  // التأكد من أن UUID يتم توليده بشكل صحيح
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role,  // استخدام role الذي تم تمريره
    createdAt: faker.date.past(),  // تأكد من أن createdAt و updatedAt هما من نوع Date
    updatedAt: faker.date.recent(),
  };
}
