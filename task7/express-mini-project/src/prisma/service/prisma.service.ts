// import { Prisma, PrismaClient } from '../../src/generated/prisma';
// import { Prisma, PrismaClient } from '../../../../src/generated/prisma';
import { Prisma, PrismaClient } from '../../src/generated/prisma';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty'
});


