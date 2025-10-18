import dotenv from 'dotenv';
dotenv.config();

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { CourseModel } from '../courses/course.model';
import { UserModel } from '../users/user.model';

// Get MongoDB URL before any imports that use it
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error('❌ MONGODB_URL is not set in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected for courses seeding'))
  .catch((err) => {
    console.log('MongoDB connection error', err);
    process.exit(1);
  });

async function main() {
  try {
    console.log('🗑️  Deleting old MongoDB courses...');
    await CourseModel.deleteMany({});
    console.log('✅ Old courses deleted.');

    console.log('🌱 Seeding MongoDB courses...');
    
    // Get all users (coaches and admins who can create courses)
    const users = await UserModel.find({
      role: { $in: ['COACH', 'ADMIN'] }
    }).exec();

    if (users.length === 0) {
      console.log('⚠️  No COACH or ADMIN users found. Please run user seed first.');
      process.exit(0);
    }

    // Create 20 random courses
    const courseCount = 20;
    for (let i = 0; i < courseCount; i++) {
      // Pick a random coach/admin as creator
      const randomUser = faker.helpers.arrayElement(users);
      // Use ObjectId directly (not toString) for proper relationship
      const courseData = {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
        description: faker.lorem.paragraph(),
        image: faker.image.url(),
        createdBy: randomUser._id,  // ✅ ObjectId reference
      };
      const course = await CourseModel.create(courseData);
      console.log(`✅ Course ${i + 1}/${courseCount} created: "${course.title}" by ${randomUser.name}`);
    }

    console.log('🎉 MongoDB courses seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB disconnected.');
    process.exit(0);
  }
}

main();

