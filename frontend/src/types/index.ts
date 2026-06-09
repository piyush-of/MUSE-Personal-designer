export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user?: User;
  error?: string;
  errors?: string[];
}

export interface CartItem {
  id: string;
  item: string;
  category: string;
  priceRange: string;
  why: string;
  styleTip: string;
  story: string;
  lineArtSvg?: string;
  retailers: { name: string; url: string }[];
  targetPrice: number | null;
  currentFloor: number | null;
  createdAt: string;
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
  recommendations: { item: string; retailer: string; price: string; url: string }[];
}

export interface AnalysisResult {
  outfit_analysis: {
    score: number;
    style_category: string;
    description: string;
    occasion: string;
    season: string;
    feedback: string;
    detected_colors: string[];
  };
  skin_palette: {
    summary: string;
    best_colors: string[];
    avoid_colors: string[];
    neutrals: string[];
    hex_palette: string[];
  };
  shopping_picks: {
    intro: string;
    items: ShoppingPick[];
  };
  combo_suggestions: {
    intro: string;
    combos: Combo[];
  };
  best_combo_matches: {
    intro: string;
    combos: BestCombo[];
  };
  style_dos_donts: { dos: string[]; donts: string[] };
  image_url?: string;
  ai_provider?: string;
}

export interface ShoppingPick {
  item: string;
  category: string;
  price_range: string;
  why: string;
  style_tip?: string;
  retailers?: { name: string; url: string }[];
}

export interface Combo {
  name: string;
  pieces: string[];
  vibe: string;
  occasion: string;
}

export interface BestCombo extends Combo {
  colors: string[];
  why_match: string;
  match_score: number;
}

export interface WardrobeItem {
  id: string;
  skinTone: string;
  gender: string;
  score: number | null;
  styleCategory: string | null;
  detectedColors: string[];
  createdAt: string;
}
