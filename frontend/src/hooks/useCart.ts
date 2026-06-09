import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

function parsePriceFloor(priceRange = ''): number | null {
  const match = String(priceRange).replace(/,/g, '').match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function getCartKey(userEmail?: string): string {
  return `muse-cart:${userEmail || 'guest'}`;
}

export function useCart() {
  const { user } = useAuth();
  const key = getCartKey(user?.email);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  }, [key]);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(key, JSON.stringify(next));
  }, [key]);

  const addItem = useCallback((item: Partial<CartItem> & { item: string }) => {
    const normalized: CartItem = {
      id: item.id || [item.item, item.category, item.priceRange].filter(Boolean).join(':'),
      item: item.item,
      category: item.category || '',
      priceRange: item.priceRange || '',
      why: item.why || '',
      styleTip: item.styleTip || '',
      story: item.story || '',
      lineArtSvg: item.lineArtSvg,
      retailers: item.retailers || [],
      targetPrice: item.targetPrice ?? null,
      currentFloor: parsePriceFloor(item.priceRange),
      createdAt: item.createdAt || new Date().toISOString(),
    };
    const existing = items.findIndex(i => i.id === normalized.id);
    const next = existing >= 0
      ? items.map((i, idx) => idx === existing ? { ...i, ...normalized } : i)
      : [normalized, ...items];
    save(next);
    return normalized;
  }, [items, save]);

  const removeItem = useCallback((id: string) => {
    save(items.filter(i => i.id !== id));
  }, [items, save]);

  const updateTarget = useCallback((id: string, targetPrice: number | null) => {
    save(items.map(i => i.id === id ? { ...i, targetPrice } : i));
  }, [items, save]);

  const alerts = items.filter(i => i.targetPrice && i.currentFloor && i.currentFloor <= i.targetPrice);

  return { items, addItem, removeItem, updateTarget, alerts, count: items.length };
}
