import { faker } from '@faker-js/faker';
import { PrismaClient, User } from '../src/generated/prisma';

import { createRandomUser } from "../seeds/user.seed";
import { createRandomCourse } from "../seeds/course.seed";
  console.log("Old data deleted.");

const prisma = new PrismaClient();
  console.log("Old data deleted.");

async function main() {
 
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Old data deleted.");
  // const users = Array.from({ length: 10 }).map(() => createRandomUser());
const users: Omit<User, 'id'>[] = [];
for (let i = 0; i < 10; i++) {
  const user = await createRandomUser(); 
  users.push(user);
}
  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });

    const courseCount = faker.number.int({ min: 3, max: 5 });
    for (let i = 0; i < courseCount; i++) {
      const courseData = createRandomCourse(createdUser.id);
      await prisma.course.create({ data: courseData });
    }
  }

  console.log("Seeding completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });