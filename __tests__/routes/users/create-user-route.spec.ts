import { createUserRoute } from '../../../src/routes/users/create-user-route';
import { createUser } from '../../../src/useCases/users/create-user';
import { setupTestServer } from '../../mocks/setupTestServer';

jest.mock('../../../src/useCases/users/create-user');

describe('createUserRoute', () => {
  let app: Awaited<ReturnType<typeof setupTestServer>>;

  beforeAll(async () => {
    app = await setupTestServer();
    await app.register(createUserRoute);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 201 when creating a user successfully', async () => {
    const userMock = {
      name: 'Test User',
      email: 'testmail@gmail.com',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/register',
      body: {
        name: 'Test User',
        email: 'testmail@gmail.com',
        password: 'Test@123',
        passwordConfirmation: 'Test@123',
      },
    });

    (createUser as jest.Mock).mockResolvedValue(userMock);

    expect(response.statusCode).toBe(201);
    expect(response.json()).toStrictEqual({
      message: 'User created successfully',
    });
  });

  it('should return 400 when passwordConfirmation do not match', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      body: {
        name: 'Test User',
        email: 'testmail@gmail.com',
        password: 'Test@123',
        passwordConfirmation: '123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      code: 'FST_ERR_VALIDATION',
      message: "body/passwordConfirmation Passwords don't match",
    });
  });

  it('should return 400 when password requirements are not met', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      body: {
        name: 'Test User',
        email: 'testmail@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      code: 'FST_ERR_VALIDATION',
      message:
        'body/password Password must have at least 8 characters., body/password Password must have at least one uppercase letter., body/password Password must have at least one lowercase letter., body/password Password must have at least one special character.',
    });
  });
});
