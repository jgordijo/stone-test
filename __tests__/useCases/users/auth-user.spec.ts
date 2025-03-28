import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../../../src/infra/repositories/users-repository';
import { authUser } from '../../../src/useCases/users/auth-user';

jest.mock('../../../src/infra/repositories/users-repository');

jest.mock('bcrypt', () => {
  return {
    compare: jest.fn(),
  };
});

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(),
  };
});

describe('authUser', () => {
  it('should successfully authenticate an user and return a signed token', async () => {
    const credentials = {
      email: 'test@mail.com',
      password: 'Test@123',
    };

    const existingUser = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'hashed-password',
      id: 'user-id',
    };

    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValueOnce(
      existingUser
    );

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock).mockResolvedValue('signed-token');

    const response = await authUser(credentials);

    expect(response).toStrictEqual('signed-token');

    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith({
      email: credentials.email,
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      credentials.password,
      existingUser.password
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: existingUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });
  it('should throw a credentials error if no user is found with provided email', async () => {
    const credentials = {
      email: 'test@mail.com',
      password: 'Test@123',
    };

    const existingUser = null;

    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValueOnce(
      existingUser
    );

    await expect(authUser(credentials)).rejects.toThrow('Invalid credentials');

    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith({
      email: credentials.email,
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();

    expect(jwt.sign).not.toHaveBeenCalled();
  });
  it('should throw a credentials error if passwords mismatch', async () => {
    const credentials = {
      email: 'test@mail.com',
      password: 'Test@123',
    };

    const existingUser = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'hashed-password',
      id: 'user-id',
    };

    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValueOnce(
      existingUser
    );

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authUser(credentials)).rejects.toThrow('Invalid credentials');

    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith({
      email: credentials.email,
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      credentials.password,
      existingUser.password
    );

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
