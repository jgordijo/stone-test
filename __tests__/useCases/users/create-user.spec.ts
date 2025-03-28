import bcrypt from 'bcrypt';
import { usersRepository } from '../../../src/infra/repositories/users-repository';
import { createUser } from '../../../src/useCases/users/create-user';

jest.mock('../../../src/infra/repositories/users-repository');

jest.mock('bcrypt', () => {
  return {
    hash: jest.fn(),
  };
});

describe('createUser', () => {
  it('should successfully create a user with hashed password', async () => {
    const user = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'Test@123',
    };

    const hashedPassword = 'hashed_password';

    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValueOnce(null);

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    (usersRepository.createUser as jest.Mock).mockResolvedValueOnce({
      name: user.name,
      email: user.email,
    });

    const response = await createUser(user);

    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith({
      email: user.email,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);

    expect(usersRepository.createUser).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    expect(response).toStrictEqual({
      name: user.name,
      email: user.email,
    });
  });
  it('should throw error if user with same email already exists', async () => {
    const user = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'Test@123',
    };

    (usersRepository.findUserByEmail as jest.Mock).mockResolvedValueOnce({
      name: 'Existing User',
      email: 'test@mail.com',
    });

    await expect(createUser(user)).rejects.toThrow('Email already in use');

    expect(usersRepository.findUserByEmail).toHaveBeenCalledWith({
      email: user.email,
    });

    expect(bcrypt.hash).not.toHaveBeenCalledWith(user.password, 10);

    expect(usersRepository.createUser).not.toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      password: 'hashed',
    });
  });
});
