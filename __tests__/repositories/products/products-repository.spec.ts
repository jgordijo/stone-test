import { prisma } from '../../../src/infra/prisma/client';
import { productsRepository } from '../../../src/infra/repositories/products-repository';

jest.mock('../../../src/infra/prisma/client', () => {
  return {
    prisma: {
      products: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    },
  };
});

beforeAll(() => {
  jest.useFakeTimers({ advanceTimers: true }).setSystemTime(new Date());
});

afterAll(() => {
  jest.useRealTimers();
});

describe('productsRepository', () => {
  describe('getProducts', () => {
    it('should successfully get products list', async () => {
      const list = [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const countResult = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValueOnce([
        list,
        countResult,
      ]);

      const result = await productsRepository.getProducts({
        page: 1,
        pageSize: 5,
      });

      expect(result).toStrictEqual({ products: list, count: countResult });

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.products.findMany({
          where: {},
          take: 5,
          skip: 0,
        }),
        prisma.products.count({
          where: {},
        }),
      ]);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
    it('should successfully get products list and filter by name', async () => {
      const name = 'Test';

      const list = [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const countResult = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValueOnce([
        list,
        countResult,
      ]);

      const result = await productsRepository.getProducts({
        page: 1,
        pageSize: 5,
        name,
      });

      expect(result).toStrictEqual({ products: list, count: countResult });

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.products.findMany({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
          take: 5,
          skip: 0,
        }),
        prisma.products.count({
          where: {
            name: { contains: name, mode: 'insensitive' },
          },
        }),
      ]);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
    it('should successfully get products list with default pagination params', async () => {
      const list = [
        {
          id: '6a0cfdbf-0c97-463b-8217-824ee206e959',
          name: 'Test Product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const countResult = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValueOnce([
        list,
        countResult,
      ]);

      const result = await productsRepository.getProducts({});

      expect(result).toStrictEqual({ products: list, count: countResult });

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.products.findMany({
          where: {},
          take: 5,
          skip: 0,
        }),
        prisma.products.count({
          where: {},
        }),
      ]);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
