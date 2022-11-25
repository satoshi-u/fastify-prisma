import { CreateUserInput } from './user.schema';
import { db } from '../../utils/prisma';
import { hashPassword } from '../../utils/hash';

// *** create a new user with db in pg-db
export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);
  const user = await db.user.create({
    data: { ...rest, salt, password: hash },
  });
  return user;
}

// *** find a user with db in pg-db
export async function findUserByEmail(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

// *** fetch all users with db in pg-db
export async function fetchAllUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return users;
}

// *** fetch user by id with db in pg-db
export async function fetchUserById(id: number) {
  const user = await db.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      id,
    },
  });
  return user;
}
