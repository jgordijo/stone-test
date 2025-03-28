import { Prisma } from '@prisma/client';
import { productsRepository } from '../../../src/infra/repositories/products-repository';
import { getProducts } from '../../../src/useCases/products/get-products';

jest.mock('../../../src/infra/repositories/products-repository');

describe('getProducts', () => {
  it('should successfully get products list with pagination params', async () => {
    const params = {
      page: 1,
      pageSize: 5,
    };

    const repositoryResponse = {
      products: [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      count: 1,
    };

    const expected = {
      list: repositoryResponse.products,
      meta: {
        currentPage: 1,
        total: repositoryResponse.count,
        lastPage: 1,
      },
    };

    (productsRepository.getProducts as jest.Mock).mockResolvedValueOnce(
      repositoryResponse
    );

    const result = await getProducts(params);

    expect(result).toStrictEqual(expected);
    expect(productsRepository.getProducts).toHaveBeenCalledWith(params);
    expect(productsRepository.getProducts).toHaveBeenCalledTimes(1);
  });
  it('should successfully get products list without pagination params', async () => {
    const repositoryResponse = {
      products: [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      count: 1,
    };

    const expected = {
      list: repositoryResponse.products,
      meta: {
        currentPage: 1,
        total: repositoryResponse.count,
        lastPage: 1,
      },
    };

    (productsRepository.getProducts as jest.Mock).mockResolvedValueOnce(
      repositoryResponse
    );

    const result = await getProducts({});

    expect(result).toStrictEqual(expected);
    expect(productsRepository.getProducts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      name: undefined,
    });
    expect(productsRepository.getProducts).toHaveBeenCalledTimes(1);
  });
  it('should successfully get products list and filter by name', async () => {
    const repositoryResponse = {
      products: [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      count: 1,
    };

    const expected = {
      list: repositoryResponse.products,
      meta: {
        currentPage: 1,
        total: repositoryResponse.count,
        lastPage: 1,
      },
    };

    (productsRepository.getProducts as jest.Mock).mockResolvedValueOnce(
      repositoryResponse
    );

    const result = await getProducts({
      name: 'Test',
    });

    expect(result).toStrictEqual(expected);
    expect(productsRepository.getProducts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      name: 'Test',
    });
    expect(productsRepository.getProducts).toHaveBeenCalledTimes(1);
  });
});
