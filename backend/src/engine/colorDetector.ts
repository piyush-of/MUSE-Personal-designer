import Jimp from 'jimp';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const COLOR_CATEGORIES = [
  { name: 'White / Ivory',     test: (r: number, g: number, b: number) => r > 210 && g > 210 && b > 210 },
  { name: 'Black / Charcoal',  test: (r: number, g: number, b: number) => r < 60 && g < 60 && b < 60 },
  { name: 'Grey',              test: (r: number, g: number, b: number) => Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 60 && r < 210 },
  { name: 'Navy Blue',         test: (r: number, g: number, b: number) => b > r + 40 && b > g + 40 && b < 130 },
  { name: 'Blue',              test: (r: number, g: number, b: number) => b > r + 30 && b > g + 20 && b > 120 },
  { name: 'Sky Blue',          test: (r: number, g: number, b: number) => b > 180 && g > 160 && r < 160 },
  { name: 'Teal / Turquoise',  test: (r: number, g: number, b: number) => g > r + 20 && b > r + 20 && g > 100 && b > 100 },
  { name: 'Green',             test: (r: number, g: number, b: number) => g > r + 30 && g > b + 20 && g > 100 },
  { name: 'Olive Green',       test: (r: number, g: number, b: number) => g > r && g > b && r > 80 && r < 160 && g < 160 },
  { name: 'Yellow',            test: (r: number, g: number, b: number) => r > 180 && g > 180 && b < 120 },
  { name: 'Mustard',           test: (r: number, g: number, b: number) => r > 160 && g > 120 && g < 180 && b < 80 },
  { name: 'Orange',            test: (r: number, g: number, b: number) => r > 180 && g > 80 && g < 160 && b < 80 },
  { name: 'Terracotta',        test: (r: number, g: number, b: number) => r > 160 && g > 80 && g < 130 && b < 100 },
  { name: 'Red',               test: (r: number, g: number, b: number) => r > 160 && g < 100 && b < 100 },
  { name: 'Burgundy / Wine',   test: (r: number, g: number, b: number) => r > 100 && r < 180 && g < 60 && b < 80 },
  { name: 'Pink',              test: (r: number, g: number, b: number) => r > 180 && b > 140 && g < r - 30 },
  { name: 'Blush',             test: (r: number, g: number, b: number) => r > 200 && g > 160 && b > 160 && r > g && r > b },
  { name: 'Purple / Violet',   test: (r: number, g: number, b: number) => r > 80 && b > r && b > g + 20 && b < 200 },
  { name: 'Lavender',          test: (r: number, g: number, b: number) => r > 160 && b > 180 && g > 140 && b > r },
  { name: 'Brown / Chocolate', test: (r: number, g: number, b: number) => r > 80 && r < 180 && g > 40 && g < 120 && b < 80 },
  { name: 'Camel / Tan',       test: (r: number, g: number, b: number) => r > 160 && g > 120 && b > 80 && r > g && g > b },
  { name: 'Beige / Cream',     test: (r: number, g: number, b: number) => r > 200 && g > 185 && b > 160 && r > b },
  { name: 'Denim Blue',        test: (r: number, g: number, b: number) => b > r && b > g && r > 60 && r < 130 && b > 100 && b < 180 },
];

export async function extractColors(buffer: Buffer): Promise<RGB[]> {
  try {
    const img = await Jimp.read(buffer);
    img.resize(80, 80);
    const map: Record<string, number> = {};
    for (let y = 0; y < img.getHeight(); y++) {
      for (let x = 0; x < img.getWidth(); x++) {
        const hex = img.getPixelColor(x, y);
        const { r, g, b, a } = Jimp.intToRGBA(hex);
        if (a < 50) continue;
        const k = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
        map[k] = (map[k] || 0) + 1;
      }
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k]) => {
        const [r, g, b] = k.split(',').map(Number);
        return { r, g, b };
      });
  } catch {
    return [{ r: 200, g: 190, b: 180 }, { r: 50, g: 50, b: 50 }, { r: 180, g: 160, b: 140 }];
  }
}

export function pixelToColorName(r: number, g: number, b: number): string {
  for (const c of COLOR_CATEGORIES) {
    if (c.test(r, g, b)) return c.name;
  }
  return 'Mixed Tone';
}

export function getColorFamily(c: string): string {
  if (['Red', 'Pink', 'Blush', 'Burgundy / Wine'].includes(c)) return 'warm-red';
  if (['Blue', 'Navy Blue', 'Sky Blue', 'Denim Blue'].includes(c)) return 'blue';
  if (['Green', 'Olive Green', 'Teal / Turquoise'].includes(c)) return 'green';
  if (['Orange', 'Terracotta', 'Brown / Chocolate', 'Mustard', 'Camel / Tan'].includes(c)) return 'earth';
  if (['White / Ivory', 'Grey', 'Black / Charcoal', 'Beige / Cream'].includes(c)) return 'neutral';
  return 'other';
}

export function hasSimilarFamily(c: string[]): boolean {
  const f = c.map(getColorFamily);
  return new Set(f).size <= 2;
}

export function hasNeutral(c: string[]): boolean {
  return c.some(x => ['White / Ivory', 'Black / Charcoal', 'Grey', 'Beige / Cream', 'Camel / Tan', 'Navy Blue'].includes(x));
}

export function hasBright(c: string[]): boolean {
  return c.some(x => ['Red', 'Orange', 'Yellow', 'Pink', 'Purple / Violet', 'Sky Blue', 'Teal / Turquoise'].includes(x));
}

export function hasEarthy(c: string[]): boolean {
  return c.some(x => ['Terracotta', 'Brown / Chocolate', 'Olive Green', 'Mustard', 'Camel / Tan'].includes(x));
}

export function hasClassic(c: string[]): boolean {
  return c.some(x => ['Black / Charcoal', 'Navy Blue', 'White / Ivory', 'Grey'].includes(x));
}

export function hasPastel(c: string[]): boolean {
  return c.some(x => ['Lavender', 'Blush', 'Sky Blue', 'Beige / Cream'].includes(x));
}
