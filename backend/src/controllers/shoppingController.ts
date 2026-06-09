import { Request, Response, NextFunction } from 'express';
import { UPDATED_AT } from '../data/trends';
import { getShoppingItems } from '../services/shoppingService';
import { enhanceShoppingContextWithGemini } from '../services/geminiService';

export async function getShopping(req: Request, res: Response, next: NextFunction) {
  const { category, skinTone = 'medium', gender = 'women', itemType } = req.query;

  try {
    const result = getShoppingItems({
      category: category as string | undefined,
      skinTone: skinTone as string,
      gender: gender as string,
      itemType: itemType as string | undefined,
    });

    const aiContent = await enhanceShoppingContextWithGemini(
      { ...result.context, updatedAt: UPDATED_AT },
      result.items,
    );

    res.json({
      success: true,
      data: result.items,
      categories: result.categories,
      filters: result.filters,
      context: { ...result.context, updatedAt: UPDATED_AT, aiContent },
    });
  } catch (err) {
    next(err);
  }
}
