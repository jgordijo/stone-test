import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authUser } from '../../useCases/users/auth-user';

export const authUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        summary: 'Logs an user in the platform',
        tags: ['Users'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            statusCode: z.number(),
            message: z.string(),
            error: z.string(),
            code: z.string(),
          }),
          401: z.object({
            statusCode: z.number(),
            message: z.string(),
            error: z.string(),
            code: z.string(),
          }),
        },
      },
    },
    async request => {
      const { email, password } = request.body;

      const token = await authUser({ email, password });

      return { token };
    }
  );
};
