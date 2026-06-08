import {
  hasNeutral,
  hasBright,
  hasEarthy,
  hasClassic,
  hasPastel,
  hasSimilarFamily
} from './colorDetector';

export interface StyleRule {
  category: string;
  occasions: string[];
  check: (colors: string[]) => boolean;
}

export const STYLE_RULES: StyleRule[] = [
  { category: 'Monochrome Chic',   occasions: ['Office', 'Art Gallery', 'City Walk'],       check: c => hasSimilarFamily(c) },
  { category: 'Smart Casual',      occasions: ['Office', 'Lunch Date', 'Weekend Brunch'],   check: c => hasNeutral(c) && !hasBright(c) },
  { category: 'Bold & Vivid',      occasions: ['Party', 'Night Out', 'Festival', 'Events'],  check: c => hasBright(c) },
  { category: 'Earth Tone Edit',   occasions: ['Casual Day Out', 'Travel', 'Weekend'],      check: c => hasEarthy(c) },
  { category: 'Classic & Refined', occasions: ['Formal Event', 'Business', 'Fine Dining'],  check: c => hasClassic(c) },
  { category: 'Pastel Dream',      occasions: ['Brunch', 'Garden Party', 'Daytime'],        check: c => hasPastel(c) },
  { category: 'Casual Cool',       occasions: ['Everyday', 'Errands', 'Coffee Run'],        check: () => true },
];

export const GOOD_PAIRS: [string, string][] = [
  ['Navy Blue', 'White / Ivory'], ['Black / Charcoal', 'White / Ivory'], ['Camel / Tan', 'White / Ivory'],
  ['Terracotta', 'Olive Green'], ['Burgundy / Wine', 'Grey'], ['Blue', 'White / Ivory'],
  ['Navy Blue', 'Camel / Tan'], ['Brown / Chocolate', 'Beige / Cream'], ['Olive Green', 'Brown / Chocolate'],
  ['Teal / Turquoise', 'White / Ivory'], ['Red', 'Black / Charcoal'], ['Pink', 'Grey'], ['Yellow', 'Navy Blue'],
];

export const BAD_PAIRS: [string, string][] = [
  ['Red', 'Orange'], ['Pink', 'Orange'], ['Purple / Violet', 'Green'], ['Yellow', 'Purple / Violet'], ['Red', 'Pink'],
];

export interface StyleCombo {
  name: string;
  pieces: string[];
  vibe: string;
  occasion: string;
  colors: string[];
  whyMatch: string;
  matchScore?: number;
}

export const GENDER_COMBO_DB: Record<string, Record<string, StyleCombo[]>> = {
  women: {
    porcelain: [
      { name: 'Silver Pastel Set',    pieces: ['Silver-grey top', 'Soft lavender trousers', 'Pearl accessories', 'White flats'],      vibe: 'Ethereal and refined',       occasion: 'Day events', colors: ['Silver Grey', 'Lavender', 'White'],      whyMatch: 'Cool silver and lavender tones are luminous on porcelain skin.' },
      { name: 'Rose Tailoring',       pieces: ['Dusty rose blazer', 'White tee', 'Dove grey trousers', 'Silver loafers'],              vibe: 'Polished and feminine',      occasion: 'Office',     colors: ['Dusty Rose', 'Dove Grey', 'Silver'],    whyMatch: 'Rose-pink tones create a beautiful natural flush on cool complexions.' },
    ],
    fair: [
      { name: 'Cool Pastel Tailoring', pieces: ['Powder blue blazer', 'Soft white tank', 'Grey trousers', 'Silver flats'],              vibe: 'Fresh and polished',         occasion: 'Day events', colors: ['Powder Blue', 'Soft White', 'Cool Grey'], whyMatch: 'Cool pastels and silver-toned styling brighten fair skin.' },
      { name: 'Berry Evening Edit',   pieces: ['Berry slip dress', 'White blazer', 'Silver jewellery', 'Nude heels'],                  vibe: 'Elegant and sharp',          occasion: 'Dinner',     colors: ['Berry', 'White', 'Silver'],             whyMatch: 'Berry tones add definition and contrast beautifully against fair complexions.' },
    ],
    light: [
      { name: 'Peach City Set',       pieces: ['Peach blouse', 'Camel trousers', 'Cream bag', 'Gold sandals'],                        vibe: 'Warm and feminine',          occasion: 'Brunch / Office', colors: ['Peach', 'Camel', 'Cream'],         whyMatch: 'Warm peach and camel tones echo the natural warmth in light beige skin.' },
      { name: 'Mint Summer Combo',    pieces: ['Mint dress', 'Warm ivory layer', 'Rose-gold hoops', 'Tan sandals'],                   vibe: 'Soft and bright',            occasion: 'Summer day', colors: ['Mint', 'Warm Ivory', 'Tan'],          whyMatch: 'Mint adds freshness while warm ivory keeps the palette flattering.' },
    ],
    light_medium: [
      { name: 'Apricot Day Look',     pieces: ['Apricot blouse', 'Cream wide-leg trousers', 'Gold sandals', 'Structured tote'],       vibe: 'Warm and elegant',           occasion: 'Day events', colors: ['Apricot', 'Cream', 'Antique Gold'],   whyMatch: 'Warm apricot harmonises naturally with honey-beige skin.' },
      { name: 'Muted Teal Edit',      pieces: ['Muted teal shirt dress', 'Tan belt', 'Cream mules', 'Bronze earrings'],               vibe: 'Effortest and refined',     occasion: 'Weekend',    colors: ['Muted Teal', 'Tan', 'Bronze'],        whyMatch: 'Muted teal provides flattering contrast without harshness.' },
    ],
    medium: [
      { name: 'Terracotta Power Look', pieces: ['Terracotta blazer', 'Ivory top', 'Olive trousers', 'Gold hoops'],                     vibe: 'Grounded and elevated',      occasion: 'Work / Events', colors: ['Terracotta', 'Ivory', 'Olive'],    whyMatch: 'Earth tones and olive-based depth are especially strong on golden olive skin.' },
      { name: 'Teal Dinner Combo',    pieces: ['Teal satin top', 'Chocolate trousers', 'Bronze accessories', 'Block heels'],          vibe: 'Rich and confident',         occasion: 'Dinner',     colors: ['Teal', 'Chocolate', 'Bronze'],        whyMatch: 'Teal brings contrast while brown and bronze keep the palette harmonious.' },
    ],
    olive: [
      { name: 'Forest Power Suit',    pieces: ['Forest green blazer', 'Warm ivory top', 'Espresso trousers', 'Bronze sandals'],       vibe: 'Bold and rooted',            occasion: 'Events',     colors: ['Forest Green', 'Warm Ivory', 'Bronze'], whyMatch: 'Forest green brings out the depth and richness in olive skin.' },
      { name: 'Aubergine Luxe',       pieces: ['Aubergine silk blouse', 'Black trousers', 'Gold cuff', 'Strappy heels'],              vibe: 'Luxurious and moody',        occasion: 'Evening',    colors: ['Aubergine', 'Black', 'Gold'],         whyMatch: 'Deep jewel tones create stunning contrast against olive undertones.' },
    ],
    tan: [
      { name: 'Cobalt Contrast Set',  pieces: ['Cobalt shirt', 'Ivory trousers', 'Gold earrings', 'Tan heels'],                      vibe: 'Bold and clean',             occasion: 'Party',      colors: ['Cobalt', 'Ivory', 'Gold'],             whyMatch: 'Cobalt and ivory create high contrast that makes tan skin glow.' },
      { name: 'Coral Weekend Combo',  pieces: ['Bright coral dress', 'White flats', 'Structured mini bag', 'Gold bangles'],          vibe: 'Vibrant and easy',           occasion: 'Weekend',    colors: ['Coral', 'White', 'Gold'],              whyMatch: 'Coral and crisp white are especially flattering on warm caramel skin.' },
    ],
    deep: [
      { name: 'Jewel Tone Statement', pieces: ['Emerald blouse', 'Bright white trousers', 'Gold cuff', 'Heeled sandals'],            vibe: 'Luxe and powerful',          occasion: 'Events',     colors: ['Emerald', 'Bright White', 'Gold'],     whyMatch: 'Deep skin carries vivid jewel tones and bright white with exceptional clarity.' },
      { name: 'Hot Pink Night Look',  pieces: ['Hot pink dress', 'Cobalt bag', 'Minimal heels', 'Gold hoops'],                       vibe: 'Playful and striking',       occasion: 'Night out',  colors: ['Hot Pink', 'Cobalt', 'Gold'],          whyMatch: 'High-energy shades create strong, flattering contrast on rich brown skin.' },
    ],
    rich: [
      { name: 'Ruby Royalty',         pieces: ['Ruby red dress', 'Gold cuff bracelet', 'Copper heels', 'Micro bag'],                 vibe: 'Regal and magnetic',         occasion: 'Evening',    colors: ['Ruby', 'Gold', 'Copper'],              whyMatch: 'Ruby and jewel tones are extraordinarily luminous on espresso skin.' },
      { name: 'Peacock Blue Set',     pieces: ['Peacock blue blazer', 'Ivory trousers', 'Oxidised gold earrings', 'Brown loafers'],  vibe: 'Commanding and rich',        occasion: 'Day events', colors: ['Peacock Blue', 'Ivory', 'Gold'],       whyMatch: 'Peacock blue creates dazzling contrast and richness on deep complexions.' },
    ],
    dark: [
      { name: 'Pure White Contrast',  pieces: ['White shirt dress', 'Gold belt', 'Camel heels', 'Structured tote'],                  vibe: 'Clean and regal',            occasion: 'All-day',    colors: ['Pure White', 'Camel', 'Gold'],         whyMatch: 'Pure white is one of the strongest contrast tools for deep ebony skin.' },
      { name: 'Turquoise Spotlight',  pieces: ['Turquoise top', 'Ivory trousers', 'Gold earrings', 'Strappy sandals'],               vibe: 'Bright and modern',          occasion: 'Day event',  colors: ['Turquoise', 'Ivory', 'Gold'],          whyMatch: 'Turquoise and ivory add brightness without dulling deep skin tones.' },
    ],
    ebony: [
      { name: 'Cobalt White Power',   pieces: ['Cobalt blazer', 'Pure white tee', 'Black trousers', 'Gold watch'],                   vibe: 'Sharp and luminous',         occasion: 'Smart casual', colors: ['Cobalt', 'Pure White', 'Black'],     whyMatch: 'Cobalt and white deliver the striking contrast ebony skin wears best.' },
      { name: 'Canary Statement',     pieces: ['Canary yellow dress', 'White sneakers', 'Gold hoop earrings', 'Micro bag'],          vibe: 'Radiant and joyful',         occasion: 'Day out',    colors: ['Canary Yellow', 'White', 'Gold'],      whyMatch: 'Canary yellow creates an extraordinary luminous effect on cool-deep skin.' },
    ],
  },
  men: {
    porcelain: [
      { name: 'Slate Blue Minimal',   pieces: ['Slate blue shirt', 'White tee', 'Light grey trousers', 'Silver watch'],              vibe: 'Cool and sharp',             occasion: 'Smart casual', colors: ['Slate Blue', 'White', 'Silver Grey'], whyMatch: 'Cool tones create refined contrast for porcelain skin.' },
      { name: 'Soft Sage Set',        pieces: ['Sage overshirt', 'Dove grey tee', 'Charcoal jeans', 'White sneakers'],              vibe: 'Relaxed and refined',        occasion: 'Weekend',      colors: ['Sage', 'Dove Grey', 'Charcoal'],    whyMatch: 'Muted sage and cool neutrals feel natural on rosy-fair skin.' },
    ],
    fair: [
      { name: 'Navy Minimal Tailoring', pieces: ['Navy blazer', 'Soft white tee', 'Grey trousers', 'White sneakers'],                vibe: 'Clean and structured',       occasion: 'Smart casual', colors: ['Navy', 'White', 'Grey'],            whyMatch: 'Navy and cool neutrals create crisp definition for fair skin.' },
      { name: 'Sage Weekend Look',    pieces: ['Sage overshirt', 'White tee', 'Charcoal jeans', 'Silver watch'],                    vibe: 'Relaxed and sharp',          occasion: 'Weekend',      colors: ['Sage', 'White', 'Charcoal'],        whyMatch: 'Muted cool greens are flattering without washing out lighter skin.' },
    ],
    light: [
      { name: 'Camel Polo Combo',     pieces: ['Camel polo', 'Cream chinos', 'Brown loafers', 'Gold-toned watch'],                  vibe: 'Warm and refined',           occasion: 'Day out',      colors: ['Camel', 'Cream', 'Brown'],          whyMatch: 'Camel and cream work naturally with warm-beige undertones.' },
      { name: 'Coral Summer Set',     pieces: ['Coral shirt', 'Stone trousers', 'Tan loafers', 'Minimal sunglasses'],               vibe: 'Fresh and modern',           occasion: 'Vacation',     colors: ['Coral', 'Stone', 'Tan'],            whyMatch: 'Coral adds healthy warmth without feeling too strong.' },
    ],
    light_medium: [
      { name: 'Honey Brown Layers',   pieces: ['Honey brown overshirt', 'Ecru tee', 'Stone chinos', 'Tan sneakers'],                vibe: 'Warm and easy',              occasion: 'Casual',       colors: ['Honey', 'Ecru', 'Stone'],           whyMatch: 'Honey and stone shades complement honey-beige undertones naturally.' },
      { name: 'Warm Terracotta Fit',  pieces: ['Terracotta polo', 'Cream shorts', 'White sneakers', 'Bronze sunglasses'],           vibe: 'Sun-warmed and relaxed',     occasion: 'Summer',       colors: ['Terracotta', 'Cream', 'White'],     whyMatch: 'Terracotta echoes the warmth in light-medium skin beautifully.' },
    ],
    medium: [
      { name: 'Olive Utility Combo',  pieces: ['Olive overshirt', 'Ecru tee', 'Brown cargos', 'White sneakers'],                   vibe: 'Current and effortless',     occasion: 'Casual',       colors: ['Olive', 'Ecru', 'Brown'],           whyMatch: 'Olive and brown play especially well with golden olive complexions.' },
      { name: 'Teal Evening Shirt',   pieces: ['Teal shirt', 'Dark trousers', 'Brown loafers', 'Bronze watch'],                    vibe: 'Confident and rich',         occasion: 'Dinner',       colors: ['Teal', 'Brown', 'Bronze'],          whyMatch: 'Teal creates contrast while bronze accessories deepen the harmony.' },
    ],
    olive: [
      { name: 'Petrol Blue Power',    pieces: ['Petrol blue shirt', 'Dark olive chinos', 'Bronze watch', 'Tan loafers'],           vibe: 'Earthy and strong',          occasion: 'Smart casual', colors: ['Petrol Blue', 'Olive', 'Bronze'],   whyMatch: 'Petrol blue creates beautiful contrast against olive-gold skin.' },
      { name: 'Forest Utility Set',   pieces: ['Forest green jacket', 'Ecru tee', 'Warm brown trousers', 'White sneakers'],        vibe: 'Natural and current',        occasion: 'Weekend',      colors: ['Forest Green', 'Ecru', 'Warm Brown'], whyMatch: 'Forest green resonates deeply with olive undertones.' },
    ],
    tan: [
      { name: 'Cobalt Shirt Formula', pieces: ['Cobalt shirt', 'Ivory trousers', 'White sneakers', 'Gold watch'],                  vibe: 'Strong and clean',           occasion: 'Smart casual', colors: ['Cobalt', 'Ivory', 'Gold'],          whyMatch: 'Cobalt and ivory give tan skin the bold contrast it handles best.' },
      { name: 'Emerald Resort Combo', pieces: ['Emerald knit polo', 'Stone trousers', 'Tan loafers', 'Minimal bracelet'],         vibe: 'Luxe and easy',              occasion: 'Summer',       colors: ['Emerald', 'Stone', 'Tan'],          whyMatch: 'Saturated jewel tones make warm caramel skin look brighter.' },
    ],
    deep: [
      { name: 'White Emerald Tailoring', pieces: ['White shirt', 'Emerald overshirt', 'Black trousers', 'Gold watch'],             vibe: 'High contrast and elevated', occasion: 'Smart evening', colors: ['White', 'Emerald', 'Gold'],         whyMatch: 'Deep skin thrives with crisp contrast and vivid jewel shades.' },
      { name: 'Royal Blue Night',     pieces: ['Royal blue shirt', 'Charcoal trousers', 'Black loafers', 'Minimal chain'],        vibe: 'Bold and sleek',             occasion: 'Night out',    colors: ['Royal Blue', 'Charcoal', 'Black'],  whyMatch: 'Royal blue brings striking contrast against rich brown skin.' },
    ],
    rich: [
      { name: 'Marigold Statement',   pieces: ['Marigold linen shirt', 'White trousers', 'Brown sandals', 'Gold cuff'],           vibe: 'Radiant and confident',      occasion: 'Day events',   colors: ['Marigold', 'White', 'Brown'],       whyMatch: 'Marigold creates extraordinary luminosity against espresso skin.' },
      { name: 'Peacock Tailored',     pieces: ['Peacock blue blazer', 'Ivory tee', 'Dark trousers', 'Copper watch'],              vibe: 'Rich and commanding',        occasion: 'Events',       colors: ['Peacock Blue', 'Ivory', 'Copper'],  whyMatch: 'Jewel tones with warm metals are deeply flattering on rich skin.' },
    ],
    dark: [
      { name: 'White Signature',      pieces: ['Pure white shirt', 'Camel trousers', 'Gold watch', 'Brown loafers'],              vibe: 'Regal and clean',            occasion: 'Day events',   colors: ['Pure White', 'Camel', 'Gold'],         whyMatch: 'Pure white and camel create the strong contrast that suits dark skin best.' },
      { name: 'Turquoise Resort',     pieces: ['Turquoise shirt', 'Ivory trousers', 'Leather sandals', 'Gold bracelet'],          vibe: 'Bright and premium',         occasion: 'Holiday',      colors: ['Turquoise', 'Ivory', 'Gold'],       whyMatch: 'Bright turquoise adds energy and keeps the complexion visually lifted.' },
    ],
    ebony: [
      { name: 'Cobalt White Statement', pieces: ['Cobalt shirt', 'Pure white trousers', 'Gold watch', 'White sneakers'],           vibe: 'Sharp and luminous',         occasion: 'Events',       colors: ['Cobalt', 'Pure White', 'Gold'],     whyMatch: 'Cobalt and white deliver the striking contrast ebony skin wears best.' },
      { name: 'Canary Resort',        pieces: ['Canary yellow linen shirt', 'White chinos', 'Gold sunglasses', 'Tan sandals'],    vibe: 'Vibrant and regal',          occasion: 'Holiday',      colors: ['Canary Yellow', 'White', 'Gold'],   whyMatch: 'Bright warm yellows radiate beautifully against deep cool-brown skin.' },
    ],
  },
};

function resolveComboSkinTone(skinTone: string): string {
  const map: Record<string, string> = { porcelain: 'porcelain', fair: 'fair', light: 'light', light_medium: 'light_medium', medium: 'medium', olive: 'olive', tan: 'tan', deep: 'deep', rich: 'rich', dark: 'dark', ebony: 'ebony' };
  return map[skinTone] || 'medium';
}

export function buildBestComboMatches(skinTone: string, gender: string, detectedColors: string[]): StyleCombo[] {
  const genderKey = gender === 'men' ? 'men' : 'women';
  const resolvedSkin = resolveComboSkinTone(skinTone);
  const combos = GENDER_COMBO_DB[genderKey]?.[resolvedSkin] || GENDER_COMBO_DB[genderKey]?.['medium'] || [];
  return combos
    .map(combo => ({
      ...combo,
      matchScore: combo.colors.reduce((score, color) => {
        const found = detectedColors.some(det => det.toLowerCase().includes(color.split(' ')[0].toLowerCase()));
        return score + (found ? 24 : 8);
      }, 28),
    }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 3);
}
