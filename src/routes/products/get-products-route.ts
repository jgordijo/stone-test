import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getProducts } from '../../useCases/products/get-products';

export const getProductsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/products',
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute',
        },
      },
      schema: {
        summary: 'Retrieves product list',
        tags: ['products'],
        querystring: z.object({
          page: z.coerce.number().default(1),
          pageSize: z.coerce.number().default(10),
          name: z.string().optional(),
        }),
        response: {
          200: z.object({
            list: z
              .object({
                id: z.string().uuid(),
                name: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              })
              .array(),
            meta: z.object({
              currentPage: z.number(),
              lastPage: z.number(),
              total: z.number(),
            }),
          }),
          400: z.object({
            statusCode: z.number(),
            code: z.string(),
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            statusCode: z.number(),
            code: z.string(),
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async request => {
      const { page, pageSize, name } = request.query;

      const { list, meta } = await getProducts({
        page,
        pageSize,
        name,
      });

      return { list, meta };
    }
  );
};
