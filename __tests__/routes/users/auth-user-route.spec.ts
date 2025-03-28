import { authUserRoute } from '../../../src/routes/users/auth-user-route';
import { authUser } from '../../../src/useCases/users/auth-user';
import { setupTestServer } from '../../mocks/setupTestServer';

jest.mock('../../../src/useCases/users/auth-user');

describe('authUserRoute', () => {
  let app: Awaited<ReturnType<typeof setupTestServer>>;

  beforeAll(async () => {
    app = await setupTestServer();
    await app.register(authUserRoute);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 when successfully authenticating an user', async () => {
    const token = 'fake-token';

    (authUser as jest.Mock).mockResolvedValue(token);

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      body: {
        email: 'testmail@gmail.com',
        password: 'Test@123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      token,
    });
  });

  it('should return 400 when password or email is not provided', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      body: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      code: 'FST_ERR_VALIDATION',
      message: 'body/email Required, body/password Required',
    });
  });
});
