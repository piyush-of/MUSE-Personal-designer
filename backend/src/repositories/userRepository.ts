import prisma from '../db/prisma';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async incrementAnalysesUsed(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { analysesUsed: { increment: 1 } },
    });
  }

  async resetAttempts(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  }

  async incrementAttempts(id: string, lockUntil?: Date): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        loginAttempts: { increment: 1 },
        ...(lockUntil ? { lockedUntil: lockUntil } : {}),
      },
    });
  }
}
