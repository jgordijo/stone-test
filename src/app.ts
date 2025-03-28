import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { Prisma } from '@prisma/client';
import { fastify } from 'fastify';
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';
import { EmailInUseError, UserAuthError } from './errors/user-errors';
import { helloWorldRoute } from './routes/hello-world-route';
import { productRoutes } from './routes/products';
import { userRoutes } from './routes/users';

const app = fastify({
  logger: {
    level: 'error',
    transport: {
      target: 'pino-pretty',
    },
  },
}).withTypeProvider<ZodTypeProvider>();

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      code: 'VALIDATION_ERROR',
      message: `Request doesn't match the schema: ${error.message}`,
      statusCode: 400,
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      code: 'VALIDATION_ERROR',
      message: `Response doesn't match the schema: ${error.message}`,
      statusCode: 500,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return reply.status(500).send({
      statusCode: 500,
      code: 'DATABASE_ERROR',
      error: 'Database error',
      message: error.message,
    });
  }

  if (error instanceof EmailInUseError) {
    return reply.status(409).send({
      statusCode: 409,
      code: 'EMAIL_IN_USE',
      error: 'Conflict',
      message: error.message,
    });
  }

  if (error instanceof UserAuthError) {
    return reply.status(401).send({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      error: 'Unauthorized',
      message: error.message,
    });
  }

  return reply.status(500).send({
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    error: 'Internal Server Error',
    message: `Something went wrong: ${error.message}`,
  });
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Stone Auth API',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(helloWorldRoute);

app.register(userRoutes);

app.register(productRoutes);

export { app };
