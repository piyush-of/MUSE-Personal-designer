import prisma from '../db/prisma';
import { Analysis, Prisma } from '@prisma/client';

export class AnalysisRepository {
  async findById(id: string): Promise<Analysis | null> {
    return prisma.analysis.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Analysis[]> {
    return prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.AnalysisUncheckedCreateInput): Promise<Analysis> {
    return prisma.analysis.create({ data });
  }

  async delete(id: string, userId: string): Promise<Analysis> {
    return prisma.analysis.delete({
      where: { id, userId },
    });
  }

  async findDuplicate(userId: string, imageHash: string): Promise<Analysis | null> {
    return prisma.analysis.findFirst({
      where: { userId, imageHash },
    });
  }
}
