import { productsRepository } from '../../infra/repositories/products-repository';

export async function getProducts({
  page = 1,
  pageSize = 10,
  name,
}: {
  page?: number;
  pageSize?: number;
  name?: string;
}) {
  const { products, count } = await productsRepository.getProducts({
    page,
    pageSize,
    name,
  });

  return {
    list: products,
    meta: {
      currentPage: page,
      total: count,
      lastPage: Math.ceil(count / pageSize),
    },
  };
}
