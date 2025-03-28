import { UserAuthError } from '../../../src/errors/user-errors';
import { verifyJWT } from '../../../src/infra/middlewares/verify-jwt';
import { getProductsRoute } from '../../../src/routes/products/get-products-route';
import { getProducts } from '../../../src/useCases/products/get-products';
import { setupTestServer } from '../../mocks/setupTestServer';

jest.mock('../../../src/useCases/products/get-products');
jest.mock('../../../src/infra/middlewares/verify-jwt');

describe('GET /products', () => {
  let app: Awaited<ReturnType<typeof setupTestServer>>;

  beforeAll(async () => {
    app = await setupTestServer();

    app.setErrorHandler((error, request, reply) => {
      if (error instanceof UserAuthError) {
        return reply.status(401).send({
          statusCode: 401,
          code: 'INVALID_CREDENTIALS',
          error: 'Unauthorized',
          message: error.message,
        });
      }

      return reply.status(500).send({
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        error: 'Internal Server Error',
        message: `Something went wrong: ${error.message}`,
      });
    });

    await app.register(getProductsRoute);
    await app.ready();

    const now = new Date('2025-02-27T00:01:00.000Z');
    jest.useFakeTimers({ advanceTimers: true }).setSystemTime(now);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should successfully retrieve products list and return 200', async () => {
    const listDbResponse = [
      {
        id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
        name: 'Test Product',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const listApiResponse = [
      {
        id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
        name: 'Test Product',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const meta = {
      currentPage: 1,
      lastPage: 1,
      total: 1,
    };

    (getProducts as jest.Mock).mockResolvedValue({
      list: listDbResponse,
      meta,
    });

    (verifyJWT as jest.Mock).mockImplementation((request, reply, done) =>
      done()
    );

    const response = await app.inject({
      method: 'GET',
      url: '/products',
      headers: {
        authorization: 'Bearer fake-token',
      },
    });

    expect(response.json()).toStrictEqual({
      list: listApiResponse,
      meta,
    });

    expect(response.statusCode).toBe(200);
  });

  it('should throw a 401 if no valid token is provided', async () => {
    (verifyJWT as jest.Mock).mockImplementation((request, reply, done) => {
      reply.status(401).send({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
    });

    const response = await app.inject({
      method: 'GET',
      url: '/products',
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toStrictEqual({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  });
});
