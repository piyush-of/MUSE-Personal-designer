import { errorHandler } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

function mockRes() {
  const res: Record<string, unknown> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as unknown as import('express').Response;
}

describe('errorHandler', () => {
  it('handles Prisma unique constraint errors', () => {
    const err = new Prisma.PrismaClientKnownRequestError('Unique', { code: 'P2002', clientVersion: '5', meta: { target: ['email'] } });
    const res = mockRes();
    errorHandler(err, {} as import('express').Request, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('handles file size limit errors', () => {
    const err = Object.assign(new Error('Too big'), { code: 'LIMIT_FILE_SIZE' });
    const res = mockRes();
    errorHandler(err, {} as import('express').Request, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('masks 500 errors in production', () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const err = new Error('secret db error');
    const res = mockRes();
    errorHandler(err, { method: 'GET', path: '/test' } as import('express').Request, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'An unexpected error occurred.' }));
    process.env.NODE_ENV = original;
  });
});
