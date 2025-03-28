import type { FastifyInstance } from 'fastify';
import { authUserRoute } from './auth-user-route';
import { createUserRoute } from './create-user-route';

export async function userRoutes(app: FastifyInstance) {
  app.register(createUserRoute);
  app.register(authUserRoute);
}
