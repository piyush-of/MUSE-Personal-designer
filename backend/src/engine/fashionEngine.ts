import {
  extractColors,
  pixelToColorName,
  hasNeutral,
  hasEarthy,
  hasBright,
  hasPastel,
  hasClassic
} from './colorDetector';
import { SKIN_DATA, DOS_DONTS } from './skinProfiles';
import { STYLE_RULES, GOOD_PAIRS, BAD_PAIRS, buildBestComboMatches } from './styleRules';
import { SHOPPING_DB, COMBO_DB, buildRetailerLinks } from './shoppingDB';

export function scoreOutfit(colors: string[], skin: string): number {
  const s = SKIN_DATA[skin];
  if (!s) return 50;
  let score = 55;
  const u = [...new Set(colors)];
  const matches = u.filter(c => s.bestColors.some(b => c.toLowerCase().includes(b.split(' ')[0].toLowerCase())));
  score += matches.length * 20;

  const avoids = u.filter(c => s.avoidColors.some(a => c.toLowerCase().includes(a.split(' ')[0].toLowerCase())));
  score -= avoids.length * 12;

  for (const [a, b] of GOOD_PAIRS) {
    if (u.includes(a) && u.includes(b)) score += 18;
  }
  for (const [a, b] of BAD_PAIRS) {
    if (u.includes(a) && u.includes(b)) score -= 15;
  }

  if (hasNeutral(u)) score += 10;
  if (u.length > 5) score += (u.length - 5) * (-8);

  return Math.max(10, Math.min(98, Math.round(score)));
}

export async function analyse(buffer: Buffer, skinTone: string, gender = 'women') {
  const skin = SKIN_DATA[skinTone] || SKIN_DATA.medium;
  const pixels = await extractColors(buffer);
  const colorNames = pixels.map(({ r, g, b }) => pixelToColorName(r, g, b));
  const unique = [...new Set(colorNames)].slice(0, 5);

  let styleObj = STYLE_RULES[STYLE_RULES.length - 1];
  for (const r of STYLE_RULES) {
    if (r.check(unique)) {
      styleObj = r;
      break;
    }
  }

  const score = scoreOutfit(unique, skinTone);
  const hasGoodPair = GOOD_PAIRS.some(([a, b]) => unique.includes(a) && unique.includes(b));

  const feedbacks = [
    score >= 80 && `This is an excellent colour combination — the ${unique[0] || 'chosen'} and ${unique[1] || 'complementary'} tones work in beautiful harmony.`,
    hasGoodPair && `The colour pairing here is well-considered. To elevate further, ensure proportions are balanced between top and bottom.`,
    hasNeutral(unique) && `Using ${unique.find(c => hasNeutral([c])) || 'neutral'} as a base is a smart styling move — it makes mixing other pieces effortless.`,
    hasEarthy(unique) && `The earthy palette is on-trend and deeply flattering for ${skin.undertone} undertones. Earth tones create natural warm harmony.`,
    hasBright(unique) && `The bold colour choice shows confidence. Keep the fit clean and accessories minimal to balance the vibrancy.`,
    score < 65 && `Consider anchoring with a neutral piece — it will bring visual cohesion. ${skin.bestColors[0]} or ${skin.bestColors[1]} would be beautiful for your skin tone.`,
    `${skin.tips[0]}.`,
  ].filter(Boolean) as string[];

  const strengths: string[] = [];
  if (hasNeutral(unique)) strengths.push('Strong neutral base gives the outfit versatility');
  if (hasGoodPair) strengths.push('Excellent colour pairing creates visual harmony');
  if (score >= 75) strengths.push('Colour palette shows sophisticated taste');
  if (hasEarthy(unique)) strengths.push('On-trend earth tones feel current and grounded');
  if (hasBright(unique)) strengths.push('Bold colour choice commands attention');
  if (strengths.length === 0) strengths.push('Clean, clear colour palette');

  const improvements: string[] = [];
  const clashes = BAD_PAIRS.filter(([a, b]) => unique.includes(a) && unique.includes(b));
  if (clashes.length) {
    improvements.push(`${clashes[0][0]} and ${clashes[0][1]} can clash — try swapping one for a neutral`);
  }
  if (unique.length > 4) improvements.push('Simplify to 3 colours max for a more polished result');
  if (!hasNeutral(unique)) {
    improvements.push(`Add a neutral piece in ${skin.neutrals[0]} to ground the look`);
  }
  if (improvements.length === 0) {
    improvements.push(`Experiment with ${skin.bestColors[0]} — it would work beautifully`);
  }

  let shopKey = 'neutral';
  if (hasEarthy(unique)) shopKey = 'earthy';
  else if (hasBright(unique)) shopKey = 'bold';
  else if (hasPastel(unique)) shopKey = 'pastel';
  else if (hasClassic(unique)) shopKey = 'classic';
  
  const shoppingItems = [...(SHOPPING_DB[shopKey] || SHOPPING_DB.neutral)]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const occasionLower = styleObj.occasions.join(' ').toLowerCase();
  let comboKeys = ['casual'];
  if (occasionLower.includes('office') || occasionLower.includes('business')) {
    comboKeys = ['office', 'evening'];
  } else if (occasionLower.includes('party') || occasionLower.includes('night')) {
    comboKeys = ['evening', 'casual'];
  } else if (occasionLower.includes('festival')) {
    comboKeys = ['festival', 'casual'];
  }

  const allCombos = comboKeys.flatMap(k => COMBO_DB[k] || []);
  const seen = new Set<string>();
  const combos = allCombos.filter(c => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  }).slice(0, 3);

  const bestMatches = buildBestComboMatches(skinTone, gender, unique);
  const audienceLabel = gender === 'men' ? 'men' : 'women';

  return {
    outfit_analysis: {
      description: `Your outfit features a ${styleObj.category.toLowerCase()} palette built around ${unique.slice(0, 2).join(' and ').toLowerCase()} tones${unique.length > 2 ? `, accented with ${unique.slice(2, 4).join(' and ').toLowerCase()}` : ''}. This creates a ${score >= 75 ? 'harmonious and well-balanced' : 'casual and relaxed'} overall look for ${audienceLabel}.`,
      style_category: styleObj.category,
      occasion: styleObj.occasions[0],
      season: hasEarthy(unique) ? 'Autumn / Winter' : hasPastel(unique) ? 'Spring / Summer' : 'All Season',
      score,
      feedback: feedbacks[0] || skin.tips[0],
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 2),
      detected_colors: unique
    },
    skin_palette: {
      summary: `With ${skin.undertone} undertones, you have the ${skin.seasonPalette} complexion type. ${skin.tips[0]}.`,
      best_colors: skin.bestColors,
      avoid_colors: skin.avoidColors,
      hex_palette: skin.hexPalette,
      season_palette: skin.seasonPalette,
      metals: skin.metals,
      neutrals: skin.neutrals
    },
    shopping_picks: {
      intro: `Based on your ${styleObj.category.toLowerCase()} colour story and ${skin.name} skin tone, here are the pieces that will elevate your wardrobe:`,
      items: shoppingItems.map(i => ({
        item: i.item,
        category: i.category,
        why: i.why,
        price_range: i.priceRange,
        style_tip: i.styleTip,
        amazon: i.amazon,
        flipkart: i.flipkart,
        retailers: buildRetailerLinks(i)
      }))
    },
    combo_suggestions: {
      intro: `Three complete outfit formulas curated for your colouring and lifestyle:`,
      combos: combos.map(c => ({
        name: c.name,
        pieces: c.pieces,
        vibe: c.vibe,
        occasion: c.occasion
      }))
    },
    best_combo_matches: {
      intro: `Best ${audienceLabel} combos for your ${skin.name} skin tone:`,
      combos: bestMatches.map(c => ({
        name: c.name,
        pieces: c.pieces,
        vibe: c.vibe,
        occasion: c.occasion,
        colors: c.colors,
        why_match: c.whyMatch,
        match_score: c.matchScore
      }))
    },
    style_dos_donts: {
      dos: (DOS_DONTS[skinTone] || DOS_DONTS.medium).dos,
      donts: (DOS_DONTS[skinTone] || DOS_DONTS.medium).donts
    }
  };
}
