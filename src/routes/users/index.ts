import type { FastifyInstance } from 'fastify';
import { createUserRoute } from './create-user-route';

export async function userRoutes(app: FastifyInstance) {
  app.register(createUserRoute);
}
