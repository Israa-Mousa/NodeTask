import { User } from './user.entity';
import { Role } from './role.enum';
import { createArgonHash } from '../shared/utils/argon.utils';

export const getUserData = async (): Promise<User[]> => [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@no.com',
    password: await createArgonHash('12345678'),
    role: Role.ADMIN,
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Belal',
    email: 'belal@example.com',
    password: await createArgonHash('12345678'),
    role: Role.COACH,
    createdAt: new Date('2025-03-01T14:30:00Z'),
    updatedAt: new Date('2025-03-01T14:30:00Z'),
  },
  {
    id: '3',
    name: 'israa',
    email: 'isra@gmail.com',
    password: await createArgonHash('12345678'),
    role: Role.STUDENT,
    createdAt: new Date('2025-02-01T12:00:00Z'),
    updatedAt: new Date('2025-02-01T12:00:00Z'),
  },
];

export const userData= getUserData(); 