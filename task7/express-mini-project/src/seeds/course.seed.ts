import { faker } from '@faker-js/faker';
// import { Course } from '../../../src/generated/prisma';
import { Course } from '../src/generated/prisma';

export function createRandomCourse(userId: number): Omit<Course, 'id' | 'creator'> {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    image: `course${faker.number.int({ min: 1, max: 5 })}.jpg`,
    createdBy: userId, // ✅ هذا صح
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}




