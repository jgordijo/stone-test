import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserAuthError } from '../../src/errors/user-errors';
import { verifyJWT } from '../../src/infra/middlewares/verify-jwt';

jest.mock('fastify', () => ({
  ...jest.requireActual('fastify'),
  FastifyRequest: jest.fn(),
  FastifyReply: jest.fn(),
}));

describe('verifyJWT', () => {
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;
  let mockJwtVerify: jest.Mock;

  beforeEach(() => {
    mockRequest = { jwtVerify: jest.fn() } as unknown as FastifyRequest;
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;
    mockJwtVerify = mockRequest.jwtVerify as jest.Mock;
  });

  it('should call jwtVerify and proceed if the token is valid', async () => {
    mockJwtVerify.mockResolvedValueOnce(true);

    await verifyJWT(mockRequest, mockReply);

    expect(mockJwtVerify).toHaveBeenCalledTimes(1);
    expect(mockReply.status).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });

  it('should throw UserAuthError if the token is invalid', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('Invalid token'));

    await expect(verifyJWT(mockRequest, mockReply)).rejects.toThrow(
      UserAuthError
    );

    expect(mockReply.status).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });
});
