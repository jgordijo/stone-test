import type { FastifyInstance } from 'fastify';
import { getProductsRoute } from './get-products-route';

export async function productRoutes(app: FastifyInstance) {
  app.register(getProductsRoute);
}
