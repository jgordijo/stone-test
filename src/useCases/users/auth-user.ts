import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { UserAuthError } from '../../errors/user-errors';
import { usersRepository } from '../../infra/repositories/users-repository';

export async function authUser({
  email,
  password,
}: { email: string; password: string }) {
  const user = await usersRepository.findUserByEmail({ email });

  if (!user) {
    throw new UserAuthError();
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new UserAuthError();
  }

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });

  return token;
}
