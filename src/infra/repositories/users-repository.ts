import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export const usersRepository = {
  createUser: async ({ name, email, password }: Prisma.UsersCreateInput) => {
    return await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        name: true,
        email: true,
      },
    });
  },
  findUserByEmail: async ({ email }: { email: string }) => {
    return await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
      },
    });
  },
};
