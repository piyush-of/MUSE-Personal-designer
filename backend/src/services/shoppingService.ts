import { SHOPPING_DB, buildRetailerLinks } from '../engine/shoppingDB';
import { SKIN_DATA } from '../engine/skinProfiles';
import { WOMEN_TRENDS, MEN_TRENDS, Trend } from '../data/trends';

const STYLE_STORIES: Record<string, {
  label: string;
  desc: string;
  palette: string[];
  silhouette: string;
  mood: string;
  occasions: string[];
}> = {
  neutral: {
    label: 'Classic Neutrals',
    desc: 'Quiet-luxury layers, foundational wardrobe builders, and polished everyday styling.',
    palette: ['Ivory', 'Camel', 'Greige', 'Soft Black'],
    silhouette: 'tailored',
    mood: 'Refined and versatile',
    occasions: ['Office', 'Travel', 'Daily polish'],
  },
  earthy: {
    label: 'Earth Tones',
    desc: 'Grounded warm dressing with terracotta, olive, rust, and texture-rich layers.',
    palette: ['Terracotta', 'Olive', 'Sand', 'Chocolate'],
    silhouette: 'flowing',
    mood: 'Warm and elevated',
    occasions: ['Weekend', 'Brunch', 'Resort'],
  },
  bold: {
    label: 'Bold & Vivid',
    desc: 'High-energy statement dressing led by saturated colors and sharper contrast.',
    palette: ['Cobalt', 'Fuchsia', 'Emerald', 'Bright White'],
    silhouette: 'statement',
    mood: 'Confident and expressive',
    occasions: ['Party', 'Events', 'Night out'],
  },
  pastel: {
    label: 'Pastels',
    desc: 'Soft-focus color stories with airy silhouettes and light layering.',
    palette: ['Powder Blue', 'Blush', 'Mint', 'Butter'],
    silhouette: 'soft',
    mood: 'Light and romantic',
    occasions: ['Garden party', 'Day dates', 'Summer days'],
  },
  classic: {
    label: 'Timeless Classic',
    desc: 'Structured essentials that stay relevant across seasons and occasions.',
    palette: ['Navy', 'White', 'Beige', 'Espresso'],
    silhouette: 'tailored',
    mood: 'Sharp and timeless',
    occasions: ['Work', 'Meetings', 'Evening dinner'],
  },
};

const PATTERN_GUIDE: Record<string, { best: string; avoid: string; mix: string }> = {
  neutral: { best: 'Solid dressing with one subtle stripe or check', avoid: 'Too many competing loud prints', mix: 'Layer matte and satin neutrals to keep the look dimensional.' },
  earthy: { best: 'Texture-led solids with soft botanical or handloom-inspired prints', avoid: 'Icy geometric prints', mix: 'Keep one warm anchor shade like terracotta or olive in every look.' },
  bold: { best: 'Strong color blocking or one hero statement print', avoid: 'Stacking multiple neon patterns together', mix: 'Pair one saturated piece with one calmer support tone for balance.' },
  pastel: { best: 'Watercolor florals and tonal ombre details', avoid: 'Harsh black-based graphics', mix: 'Use creamy white to connect pastel pieces without breaking softness.' },
  classic: { best: 'Pinstripes, heritage checks, or fully solid tailoring', avoid: 'Overly distressed patterns', mix: 'Repeat one dark neutral twice to make the outfit feel intentional.' },
};

function titleCase(value = ''): string {
  return String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ');
}

function resolveAudience(gender: string): string {
  return gender === 'men' ? 'men' : 'women';
}

function getTrendPool(gender: string): Trend[] {
  return resolveAudience(gender) === 'men' ? MEN_TRENDS : WOMEN_TRENDS;
}

export function buildPalette(styleKey: string, skinTone: string) {
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const skin = SKIN_DATA[skinTone] || SKIN_DATA.medium;
  const primary = skin.bestColors.slice(0, 2);
  const support = story.palette.slice(0, 2);
  const accents = skin.neutrals.slice(0, 2);

  return {
    headline: `${titleCase(skinTone || 'medium')} skin tone + ${story.label}`,
    bestColors: [...new Set([...primary, ...support])].slice(0, 4),
    accents,
    avoid: skin.avoidColors.slice(0, 2),
    metals: skin.metals,
  };
}

function createSketchSvg(item: { category?: string }, styleKey: string): string {
  const categoryMap: Record<string, string> = {
    dress: 'dress', 'co-ord': 'dress', tops: 'top', bottoms: 'bottom',
    outerwear: 'jacket', footwear: 'shoe', accessories: 'bag',
  };
  const categoryKey = categoryMap[String(item.category || '').toLowerCase()] || 'dress';
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const stroke = styleKey === 'bold' ? '#B5674D' : '#1A1714';
  const accent: Record<string, string> = { neutral: '#C8A870', earthy: '#9A6B4F', bold: '#B5674D', pastel: '#A886C1', classic: '#35506B' };
  const accentColor = accent[styleKey] || '#B5674D';

  const figures: Record<string, string> = {
    dress: '<path d="M59 25c3-8 12-13 21-13s18 5 21 13l5 15c2 5 7 10 12 13l12 8-16 17-7 45H53l-7-45-16-17 12-8c5-3 10-8 12-13l5-15Z"/><path d="M66 39h28"/><path d="M58 75h44" stroke="' + accentColor + '"/>',
    top: '<path d="M52 25c4-7 12-12 20-12h16c8 0 16 5 20 12l11 18-15 13-9 67H45L36 56 21 43l11-18Z"/><path d="M57 42h46" stroke="' + accentColor + '"/>',
    bottom: '<path d="M48 15h56l7 30-10 78H77l-7-45-7 45H39L29 45l19-30Z"/><path d="M48 15l14 32"/><path d="M104 15 90 47"/>',
    jacket: '<path d="M50 17h60l12 20-16 16-10 70H74l-4-38-4 38H44L34 53 18 37l12-20Z"/><path d="M80 18v105" stroke="' + accentColor + '"/><path d="M60 46h40"/>',
    shoe: '<path d="M25 84c11 0 18-8 26-20l8-12 13 3c6 2 12 6 18 12l16 16c4 4 9 6 15 6h10v14H25c-8 0-14-5-14-11s6-8 14-8Z"/><path d="M58 55c6 9 14 15 22 18" stroke="' + accentColor + '"/>',
    bag: '<path d="M37 45h86l-6 68c-1 9-8 15-17 15H60c-9 0-16-6-17-15l-6-68Z"/><path d="M58 45c0-18 10-29 22-29s22 11 22 29"/><path d="M54 70h52" stroke="' + accentColor + '"/>',
  };

  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f8f2ea"/><stop offset="100%" stop-color="#efe3d4"/></linearGradient></defs><rect width="160" height="160" rx="28" fill="url(#bg)"/><circle cx="124" cy="36" r="18" fill="${accentColor}" fill-opacity="0.08"/><g fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${figures[categoryKey]}</g><text x="18" y="145" fill="${accentColor}" font-family="DM Mono, monospace" font-size="10" letter-spacing="1.6">${story.mood.toUpperCase()}</text></svg>`;
}

export function enrichShoppingItem(item: Record<string, unknown>, styleKey: string, skinTone: string, gender: string) {
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const palette = buildPalette(styleKey, skinTone);
  const trendMatch = getTrendPool(gender).find(trend =>
    trend.colors.some(color => palette.bestColors.some(best => best.toLowerCase().includes(color.split(' ')[0].toLowerCase())))
  );
  const pattern = PATTERN_GUIDE[styleKey] || PATTERN_GUIDE.neutral;

  return {
    ...item,
    styleKey,
    story: story.label,
    audience: resolveAudience(gender),
    silhouette: story.silhouette,
    recommendedPalette: palette,
    patternAdvice: pattern,
    styleInsights: {
      mood: story.mood,
      occasions: story.occasions,
      stylingNote: `${story.desc} Best when anchored with ${palette.accents[0] || 'a strong neutral'}.`,
    },
    trendSignal: trendMatch
      ? { trend: trendMatch.trend, season: trendMatch.season, colors: trendMatch.colors.slice(0, 3) }
      : null,
    retailers: buildRetailerLinks(item as unknown as import('../engine/shoppingDB').ShoppingItem),
    lineArtSvg: createSketchSvg(item as { category?: string }, styleKey),
  };
}

export function getShoppingItems(filters: {
  category?: string;
  skinTone?: string;
  gender?: string;
  itemType?: string;
}) {
  const { category, skinTone = 'medium', gender = 'women', itemType } = filters;

  const all = Object.entries(SHOPPING_DB).flatMap(([key, items]) =>
    items.map(item => enrichShoppingItem(item as unknown as Record<string, unknown>, key, skinTone, gender))
  );

  const filtered = all.filter(item => {
    if (category && category !== 'all' && item.styleKey !== category) return false;
    if (itemType && itemType !== 'all' && String((item as { category?: string }).category || '').toLowerCase() !== String(itemType).toLowerCase()) return false;
    return true;
  });

  const trendPool = getTrendPool(gender).slice(0, 3).map(trend => ({
    trend: trend.trend,
    season: trend.season,
    colors: trend.colors,
  }));

  return {
    items: filtered,
    context: {
      audience: resolveAudience(gender),
      skinTone,
      paletteHeadline: buildPalette(category && category !== 'all' ? category : 'neutral', skinTone),
      trendHighlights: trendPool,
    },
    categories: ['all', ...Object.keys(SHOPPING_DB)],
    filters: {
      genders: ['women', 'men'],
      skinTones: Object.keys(SKIN_DATA),
      itemTypes: ['all', 'Dress', 'Co-ord', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'],
    },
  };
}
