import { faker } from '@faker-js/faker';

import { PrismaClient} from '../src/generated/prisma';

import { createRandomUser } from "../express-mini-project/src/seeds/user.seed";
import { createRandomCourse } from "../express-mini-project/src/seeds/course.seed";

const prisma = new PrismaClient();

async function main() {
  // مسح البيانات القديمة
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  // إنشاء 10 مستخدمين
  const users = Array.from({ length: 10 }).map(() => createRandomUser());

  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });

    // لكل مستخدم، إنشاء 3-5 كورسات
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