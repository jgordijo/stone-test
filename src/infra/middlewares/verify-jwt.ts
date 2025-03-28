import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserAuthError } from '../../errors/user-errors';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UserAuthError();
  }
}
