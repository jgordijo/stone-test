import { prisma } from '../prisma/client';

interface IGetProductsFilter {
  name?: object;
}

export const productsRepository = {
  getProducts: async ({
    name,
    page = 1,
    pageSize = 10,
  }: { name?: string; page?: number; pageSize?: number }) => {
    const filter: IGetProductsFilter = {};

    if (name) {
      filter.name = { contains: name, mode: 'insensitive' };
    }

    const [products, count] = await prisma.$transaction([
      prisma.products.findMany({
        where: filter,
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.products.count({ where: filter }),
    ]);

    return { products, count };
  },
};
