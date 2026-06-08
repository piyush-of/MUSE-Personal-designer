import { User } from '@prisma/client';
import { TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | null;
      userDoc?: User | null;
    }
  }
}
