export const UPDATED_AT = '2026-03-17';

export interface TrendRecommendation {
  item: string;
  retailer: string;
  price: string;
  url: string;
}

export interface Trend {
  id: string;
  trend: string;
  audience: string;
  description: string;
  keyPieces: string[];
  colors: string[];
  hexColors: string[];
  season: string;
  tag: string;
  sourceLabel: string;
  sourceUrl: string;
  recommendations: TrendRecommendation[];
}

export const WOMEN_TRENDS: Trend[] = [
  {
    id: 'soft-power-tailoring',
    trend: 'Soft Power Tailoring',
    audience: 'women',
    description: 'Relaxed blazers, fluid trousers and waistcoats are leading women\'s daywear in Spring/Summer 2026. The silhouette feels sharper than casualwear but softer than corporate suiting.',
    keyPieces: ['Single-breasted blazer', 'Wide-leg trousers', 'Waistcoat', 'Pointed flats'],
    colors: ['Butter', 'Stone', 'Chocolate', 'Powder Blue'],
    hexColors: ['#F3E5AB', '#D8D2C2', '#5C4033', '#B0D6F5'],
    season: 'Spring / Summer 2026',
    tag: 'Latest Women',
    sourceLabel: 'Vogue runway direction',
    sourceUrl: 'https://www.vogue.com/',
    recommendations: [
      { item: 'Women blazer set', retailer: 'Amazon', price: 'Rs 2,799', url: 'https://www.amazon.in/s?k=women+blazer+set' },
      { item: 'Wide leg formal trousers', retailer: 'Amazon', price: 'Rs 1,299', url: 'https://www.amazon.in/s?k=women+wide+leg+formal+trousers' },
      { item: 'Waistcoat co-ord set', retailer: 'Flipkart', price: 'Rs 1,899', url: 'https://www.flipkart.com/search?q=women+waistcoat+set' },
    ],
  },
  {
    id: 'sheer-layering',
    trend: 'Sheer Layering',
    audience: 'women',
    description: 'Transparent skirts, mesh tops and tonal underlayers are staying strong for evening and resort dressing, but the styling is now more polished and less overtly dramatic.',
    keyPieces: ['Mesh top', 'Sheer overlay skirt', 'Structured camisole', 'Minimal heeled sandals'],
    colors: ['Smoke Grey', 'Black', 'Pearl', 'Sand'],
    hexColors: ['#738276', '#111111', '#F0EAD6', '#C2B280'],
    season: 'Spring / Summer 2026',
    tag: 'Latest Women',
    sourceLabel: 'Who What Wear editorial trend watch',
    sourceUrl: 'https://www.whowhatwear.com/',
    recommendations: [
      { item: 'Women mesh top', retailer: 'Amazon', price: 'Rs 799', url: 'https://www.amazon.in/s?k=women+mesh+top' },
      { item: 'Sheer midi skirt', retailer: 'Flipkart', price: 'Rs 1,499', url: 'https://www.flipkart.com/search?q=sheer+midi+skirt+women' },
      { item: 'Strappy heeled sandals', retailer: 'Amazon', price: 'Rs 1,199', url: 'https://www.amazon.in/s?k=women+strappy+heeled+sandals' },
    ],
  },
  {
    id: 'modern-romantic',
    trend: 'Modern Romantic',
    audience: 'women',
    description: 'Soft florals, puff sleeves, lace textures and ballet-inspired details are being worn in cleaner silhouettes, giving romantic dressing a more wearable 2026 update.',
    keyPieces: ['Puff-sleeve blouse', 'Floral midi dress', 'Ballet flats', 'Mini shoulder bag'],
    colors: ['Dusty Rose', 'Cream', 'Sage', 'Ribbon Pink'],
    hexColors: ['#D4A5A5', '#FFFDD0', '#8FBC8F', '#E8A2B8'],
    season: 'Spring / Summer 2026',
    tag: 'Latest Women',
    sourceLabel: 'Vogue and runway recap',
    sourceUrl: 'https://www.vogue.com/',
    recommendations: [
      { item: 'Floral midi dress', retailer: 'Amazon', price: 'Rs 1,699', url: 'https://www.amazon.in/s?k=floral+midi+dress+women' },
      { item: 'Ballet flats', retailer: 'Flipkart', price: 'Rs 999', url: 'https://www.flipkart.com/search?q=ballet+flats+women' },
      { item: 'Puff sleeve blouse', retailer: 'Amazon', price: 'Rs 899', url: 'https://www.amazon.in/s?k=puff+sleeve+blouse+women' },
    ],
  },
  {
    id: 'quiet-luxury-neutrals',
    trend: 'Quiet Luxury Neutrals',
    audience: 'women',
    description: 'Cream, camel, greige and espresso remain essential because luxury dressing is still being defined by texture, proportion and restraint rather than loud branding.',
    keyPieces: ['Longline coat', 'Knit tank', 'Greige trousers', 'Leather tote'],
    colors: ['Camel', 'Greige', 'Ivory', 'Espresso'],
    hexColors: ['#C8A870', '#B5A899', '#F8F5EE', '#4B3621'],
    season: 'Year-round 2026',
    tag: 'Latest Women',
    sourceLabel: 'Luxury wardrobe trend coverage',
    sourceUrl: 'https://www.vogue.com/',
    recommendations: [
      { item: 'Greige trousers', retailer: 'Amazon', price: 'Rs 1,499', url: 'https://www.amazon.in/s?k=greige+trousers+women' },
      { item: 'Camel tote bag', retailer: 'Flipkart', price: 'Rs 1,299', url: 'https://www.flipkart.com/search?q=camel+tote+bag+women' },
      { item: 'Ivory knit tank', retailer: 'Amazon', price: 'Rs 699', url: 'https://www.amazon.in/s?k=ivory+knit+tank+women' },
    ],
  },
  {
    id: 'sporty-luxe',
    trend: 'Sporty Luxe',
    audience: 'women',
    description: 'Refined athleisure is evolving into polished sporty dressing: zip jackets, sleek leggings, baseball caps and retro trainers styled with tailored outer layers.',
    keyPieces: ['Track jacket', 'Leggings', 'Retro sneakers', 'Structured tote'],
    colors: ['Graphite', 'Olive', 'Bone', 'White'],
    hexColors: ['#4B4E53', '#708238', '#E3DAC9', '#FFFFFF'],
    season: 'Spring 2026',
    tag: 'Latest Women',
    sourceLabel: 'Street style trend direction',
    sourceUrl: 'https://www.whowhatwear.com/',
    recommendations: [
      { item: 'Women athleisure set', retailer: 'Amazon', price: 'Rs 1,599', url: 'https://www.amazon.in/s?k=women+athleisure+set' },
      { item: 'Retro sneakers', retailer: 'Flipkart', price: 'Rs 1,799', url: 'https://www.flipkart.com/search?q=retro+sneakers+women' },
      { item: 'Track jacket women', retailer: 'Amazon', price: 'Rs 1,099', url: 'https://www.amazon.in/s?k=women+track+jacket' },
    ],
  },
];

export const MEN_TRENDS: Trend[] = [
  {
    id: 'relaxed-tailoring',
    trend: 'Relaxed Tailoring',
    audience: 'men',
    description: 'Men\'s 2026 style is leaning toward unstructured blazers, roomy trousers and easier suiting that still looks refined. It is the cleanest way to look current without being loud.',
    keyPieces: ['Unstructured blazer', 'Pleated trousers', 'Knitted polo', 'Loafers'],
    colors: ['Stone', 'Navy', 'Olive', 'Cream'],
    hexColors: ['#D8D2C2', '#1F3A5F', '#6B8E23', '#FFFDD0'],
    season: 'Spring / Summer 2026',
    tag: 'Latest Men',
    sourceLabel: 'GQ menswear direction',
    sourceUrl: 'https://www.gq.com/',
    recommendations: [
      { item: 'Men blazer', retailer: 'Amazon', price: 'Rs 2,499', url: 'https://www.amazon.in/s?k=men+unstructured+blazer' },
      { item: 'Pleated trousers men', retailer: 'Amazon', price: 'Rs 1,399', url: 'https://www.amazon.in/s?k=men+pleated+trousers' },
      { item: 'Loafers for men', retailer: 'Flipkart', price: 'Rs 1,699', url: 'https://www.flipkart.com/search?q=loafers+for+men' },
    ],
  },
  {
    id: 'smart-utility',
    trend: 'Smart Utility',
    audience: 'men',
    description: 'Overshirts, cargo trousers and field jackets are being refined with better fabrics and cleaner fits, making utility dressing one of the strongest everyday trends for men.',
    keyPieces: ['Overshirt', 'Cargo trousers', 'Field jacket', 'Leather sneakers'],
    colors: ['Khaki', 'Forest', 'Charcoal', 'Sand'],
    hexColors: ['#C3B091', '#228B22', '#36454F', '#C2B280'],
    season: 'Spring 2026',
    tag: 'Latest Men',
    sourceLabel: 'GQ and menswear editorial watch',
    sourceUrl: 'https://www.gq.com/',
    recommendations: [
      { item: 'Men overshirt', retailer: 'Amazon', price: 'Rs 1,299', url: 'https://www.amazon.in/s?k=men+overshirt' },
      { item: 'Cargo trousers men', retailer: 'Flipkart', price: 'Rs 1,199', url: 'https://www.flipkart.com/search?q=men+cargo+trousers' },
      { item: 'Field jacket men', retailer: 'Amazon', price: 'Rs 2,199', url: 'https://www.amazon.in/s?k=men+field+jacket' },
    ],
  },
  {
    id: 'resort-knitwear',
    trend: 'Resort Knitwear',
    audience: 'men',
    description: 'Textured polos, crochet shirts and open-collar knits are defining warm-weather menswear, especially when paired with relaxed shorts or drawstring trousers.',
    keyPieces: ['Knitted polo', 'Crochet shirt', 'Drawstring trousers', 'Leather sandals'],
    colors: ['Ecru', 'Chocolate', 'Sky Blue', 'Terracotta'],
    hexColors: ['#F5F5DC', '#5C4033', '#87CEEB', '#C9816A'],
    season: 'Summer 2026',
    tag: 'Latest Men',
    sourceLabel: 'MR PORTER and GQ seasonal direction',
    sourceUrl: 'https://www.mrporter.com/',
    recommendations: [
      { item: 'Men knitted polo', retailer: 'Amazon', price: 'Rs 999', url: 'https://www.amazon.in/s?k=men+knitted+polo' },
      { item: 'Crochet shirt men', retailer: 'Flipkart', price: 'Rs 1,399', url: 'https://www.flipkart.com/search?q=crochet+shirt+men' },
      { item: 'Drawstring trousers men', retailer: 'Amazon', price: 'Rs 1,299', url: 'https://www.amazon.in/s?k=drawstring+trousers+men' },
    ],
  },
  {
    id: 'denim-minimal',
    trend: 'Denim Minimal',
    audience: 'men',
    description: 'Clean dark denim, denim shirts and straight fits are replacing distressed looks. The latest approach is simpler, sharper and much easier to style well.',
    keyPieces: ['Dark denim shirt', 'Straight jeans', 'White tee', 'Minimal sneakers'],
    colors: ['Indigo', 'White', 'Black', 'Stone'],
    hexColors: ['#1F3A5F', '#FFFFFF', '#111111', '#D8D2C2'],
    season: 'Year-round 2026',
    tag: 'Latest Men',
    sourceLabel: 'Contemporary menswear trend watch',
    sourceUrl: 'https://www.gq.com/',
    recommendations: [
      { item: 'Dark denim shirt men', retailer: 'Amazon', price: 'Rs 1,099', url: 'https://www.amazon.in/s?k=dark+denim+shirt+men' },
      { item: 'Straight fit jeans men', retailer: 'Flipkart', price: 'Rs 1,199', url: 'https://www.flipkart.com/search?q=straight+fit+jeans+men' },
      { item: 'Minimal white sneakers men', retailer: 'Amazon', price: 'Rs 1,899', url: 'https://www.amazon.in/s?k=minimal+white+sneakers+men' },
    ],
  },
  {
    id: 'monochrome-evening',
    trend: 'Monochrome Evening',
    audience: 'men',
    description: 'For dinners and events, men\'s latest styling is all about tonal dressing in black, espresso, navy or charcoal with texture changes doing the work.',
    keyPieces: ['Camp collar shirt', 'Tailored trousers', 'Suede loafers', 'Minimal watch'],
    colors: ['Black', 'Espresso', 'Navy', 'Charcoal'],
    hexColors: ['#111111', '#4B3621', '#1F3A5F', '#36454F'],
    season: 'Evening 2026',
    tag: 'Latest Men',
    sourceLabel: 'GQ eveningwear direction',
    sourceUrl: 'https://www.gq.com/',
    recommendations: [
      { item: 'Camp collar shirt men', retailer: 'Amazon', price: 'Rs 899', url: 'https://www.amazon.in/s?k=camp+collar+shirt+men' },
      { item: 'Formal trousers men', retailer: 'Flipkart', price: 'Rs 1,299', url: 'https://www.flipkart.com/search?q=formal+trousers+men' },
      { item: 'Suede loafers men', retailer: 'Amazon', price: 'Rs 2,299', url: 'https://www.amazon.in/s?k=suede+loafers+men' },
    ],
  },
];
