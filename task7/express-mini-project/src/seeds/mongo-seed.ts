import dotenv from 'dotenv';
dotenv.config();

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { createArgonHash } from '../shared/utils/argon.utils';
import { Role } from '../users/role.enum';

// Get MongoDB URL before any imports that use it
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error('❌ MONGODB_URL is not set in .env file');
  process.exit(1);
}

// Import UserModel after checking env
import { UserModel } from '../users/user.model';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.log('MongoDB connection error', err);
    process.exit(1);
  });

async function createRandomMongoUser() {
  const hashedPassword = await createArgonHash("12345678");
  
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement([Role.COACH, Role.ADMIN, Role.STUDENT]),
  };
}

async function main() {
  try {
    console.log('🗑️  Deleting old MongoDB data...');
    await UserModel.deleteMany({});
    console.log('✅ Old data deleted.');

    console.log('🌱 Seeding MongoDB users...');
    
    // Create admin user
    const adminUser = await UserModel.create({
      name: 'Admin User',
      email: 'admin@no.com',
      password: await createArgonHash('admin123'),
      role: Role.ADMIN,
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create random users
    const userCount = 10;
    for (let i = 0; i < userCount; i++) {
      const userData = await createRandomMongoUser();
      const user = await UserModel.create(userData);
      console.log(`✅ User ${i + 1}/${userCount} created:`, user.email);
    }

    console.log('🎉 MongoDB seeding completed!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@no.com');
    console.log('   Password: admin123');
    
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

