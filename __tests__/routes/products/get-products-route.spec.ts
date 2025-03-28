import { getProductsRoute } from '../../../src/routes/products/get-products-route';
import { getProducts } from '../../../src/useCases/products/get-products';
import { setupTestServer } from '../../mocks/setupTestServer';

jest.mock('../../../src/useCases/products/get-products');

describe('GET /products', () => {
  let app: Awaited<ReturnType<typeof setupTestServer>>;

  beforeAll(async () => {
    app = await setupTestServer();
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

    const response = await app.inject({
      method: 'GET',
      url: '/products',
    });

    expect(response.json()).toStrictEqual({
      list: listApiResponse,
      meta,
    });

    expect(response.statusCode).toBe(200);
  });
});
