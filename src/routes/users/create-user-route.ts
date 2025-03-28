import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createUser } from '../../useCases/users/create-user';

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must have at least 8 characters.' })
  .max(20, { message: 'Password must have 20 characters maximum.' })
  .refine(password => /[A-Z]/.test(password), {
    message: 'Password must have at least one uppercase letter.',
  })
  .refine(password => /[a-z]/.test(password), {
    message: 'Password must have at least one lowercase letter.',
  })
  .refine(password => /[0-9]/.test(password), {
    message: 'Password must have at least one number.',
  })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: 'Password must have at least one special character.',
  });

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/register',
    {
      schema: {
        summary: 'Registers an user',
        tags: ['Users'],
        body: z
          .object({
            name: z.string(),
            email: z.string().email(),
            password: passwordSchema,
            passwordConfirmation: z.string(),
          })
          .refine(data => data.password === data.passwordConfirmation, {
            message: "Passwords don't match",
            path: ['passwordConfirmation'],
          }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          400: z.object({
            statusCode: z.number(),
            message: z.string(),
            error: z.string(),
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      await createUser({ name, email, password });

      return reply.status(201).send({ message: 'User created successfully' });
    }
  );
};
