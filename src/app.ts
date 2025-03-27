import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
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
import { helloWorldRoute } from './routes/hello-world-route';

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

export { app };
