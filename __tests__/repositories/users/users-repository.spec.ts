import type { Users } from '@prisma/client';
import { prisma } from '../../../src/infra/prisma/client';
import { usersRepository } from '../../../src/infra/repositories/users-repository';

jest.mock('../../../src/infra/prisma/client', () => {
  return {
    prisma: {
      users: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    },
  };
});

describe('usersRepository', () => {
  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const user = {
        name: 'Test User',
        email: 'test@mail.com',
        password: 'hashedpassword',
      };

      const expectedUser = {
        name: user.name,
        email: user.email,
      };

      (prisma.users.create as jest.Mock).mockResolvedValueOnce(
        expectedUser as Users
      );

      const response = await usersRepository.createUser(user);

      expect(response).toStrictEqual(expectedUser);

      expect(prisma.users.create).toHaveBeenCalledWith({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      expect(prisma.users.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findUserByEmail', () => {
    it('should successfully query a user by email', async () => {
      const email = 'test@mail.com';

      const expectedUser = {
        name: 'Test User',
        email,
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce(
        expectedUser as Users
      );

      const response = await usersRepository.findUserByEmail({ email });

      expect(response).toStrictEqual(expectedUser);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });

      expect(prisma.users.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
