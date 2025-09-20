import { faker } from '@faker-js/faker';
import { Course } from '../../src/courses/course.entity';

export function createRandomCourse(userId?: string): Course {
  return {
   id: faker.string.uuid(),
    title: faker.lorem.words(3),      // ✅ Already a string
    description: faker.lorem.sentences(2), // ✅ Pass number of sentences
    createdBy: userId || faker.string.uuid(),
    image: `course${faker.number.int({ min: 1, max: 5 })}.jpg`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),

  }
}

