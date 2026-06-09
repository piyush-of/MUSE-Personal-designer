import { validateAnalyze } from '../middleware/validate';

function mockReqRes(body: Record<string, unknown>, file?: Express.Multer.File) {
  const req = { body, file } as import('express').Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as import('express').Response;
  const next = jest.fn();
  return { req, res, next };
}

describe('validateAnalyze', () => {
  it('rejects missing file', () => {
    const { req, res, next } = mockReqRes({ skinTone: 'medium', gender: 'women' });
    validateAnalyze(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes valid request', () => {
    const file = { size: 1000 } as Express.Multer.File;
    const { req, res, next } = mockReqRes({ skinTone: 'medium', gender: 'women' }, file);
    validateAnalyze(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects invalid skin tone', () => {
    const file = { size: 1000 } as Express.Multer.File;
    const { req, res, next } = mockReqRes({ skinTone: 'invalid', gender: 'women' }, file);
    validateAnalyze(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
