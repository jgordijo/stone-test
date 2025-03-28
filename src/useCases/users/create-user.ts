import type { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { EmailInUseError } from '../../errors/user-errors';
import { usersRepository } from '../../infra/repositories/users-repository';

export async function createUser({
  name,
  email,
  password,
}: Prisma.UsersCreateInput) {
  const existingUser = await usersRepository.findUserByEmail({ email });

  if (existingUser) {
    throw new EmailInUseError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await usersRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
}
