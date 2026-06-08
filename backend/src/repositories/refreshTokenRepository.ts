import prisma from '../db/prisma';
import { RefreshToken } from '@prisma/client';

export class RefreshTokenRepository {
  async save(token: string, userId: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async find(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async delete(token: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
  }

  async deleteForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
