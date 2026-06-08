export interface SkinToneProfile {
  name: string;
  undertone: string;
  seasonPalette: string;
  bestColors: string[];
  avoidColors: string[];
  hexPalette: string[];
  metals: string;
  neutrals: string[];
  tips: string[];
}

export interface DosDonts {
  dos: string[];
  donts: string[];
}

export const SKIN_DATA: Record<string, SkinToneProfile> = {
  porcelain: {
    name: 'Porcelain / Rose Ivory',
    undertone: 'Cool-rosy',
    seasonPalette: 'Light Summer / Soft Winter',
    bestColors: ['Rose Pink', 'Powder Blue', 'Periwinkle', 'Soft White', 'Cool Taupe', 'Dusty Mauve', 'Sage Mist', 'Silver Grey'],
    avoidColors: ['Harsh Orange', 'Mustard', 'Dark Olive'],
    hexPalette: ['#F4DCDD', '#D5E3F4', '#C8C9F0', '#F5F4EF', '#C6BBB3', '#B7C8BA'],
    metals: 'Silver, White Gold, Platinum',
    neutrals: ['Soft White', 'Cool Taupe', 'Dove Grey', 'Navy'],
    tips: [
      'Soft cool colours keep your complexion bright and refined',
      'Rosy pastels near the face look naturally polished',
      'Silver jewellery sharpens your undertone beautifully',
      'Avoid muddy warm shades that overpower delicate contrast'
    ]
  },
  fair: {
    name: 'Fair / Ivory',
    undertone: 'Cool-pink',
    seasonPalette: 'Cool Summer / Clear Winter',
    bestColors: ['Dusty Rose', 'Lavender', 'Powder Blue', 'Soft White', 'Cool Grey', 'Navy', 'Berry', 'Sage Green'],
    avoidColors: ['Bright Orange', 'Warm Brown', 'Mustard Yellow'],
    hexPalette: ['#E8D5D5', '#C9D6E8', '#D5E8D5', '#E8E8E8', '#A0A8B8', '#2C3E6B'],
    metals: 'Silver, White Gold, Platinum',
    neutrals: ['White', 'Light Grey', 'Navy', 'Black'],
    tips: [
      'Cool-toned colours harmonise with your complexion',
      'Deep jewel tones like sapphire and emerald look stunning',
      'Wear blush and mauve near your face for a natural flush',
      'Avoid orange tones — they can make fair skin look washed'
    ]
  },
  light: {
    name: 'Light / Warm Beige',
    undertone: 'Warm-neutral',
    seasonPalette: 'Warm Spring / Light Summer',
    bestColors: ['Peach', 'Warm Ivory', 'Coral', 'Light Camel', 'Warm Pink', 'Aqua', 'Soft Gold', 'Mint'],
    avoidColors: ['Stark White', 'Cool Grey', 'Neon Colours'],
    hexPalette: ['#F2C4A0', '#E8B89A', '#D4A8C7', '#B8D4C0', '#E8D4A0', '#C8A870'],
    metals: 'Rose Gold, Yellow Gold, Bronze',
    neutrals: ['Cream', 'Camel', 'Warm Beige', 'Nude'],
    tips: [
      'Warm peachy tones echo the warmth in your skin',
      'Gold jewellery enhances your warm undertones',
      'Avoid very cool or stark colours',
      'Earthy pastels work especially well for your colouring'
    ]
  },
  light_medium: {
    name: 'Light-Medium / Honey Beige',
    undertone: 'Neutral-golden',
    seasonPalette: 'Soft Autumn / Warm Spring',
    bestColors: ['Apricot', 'Honey', 'Muted Teal', 'Warm Rose', 'Olive Beige', 'Soft Coral', 'Antique Gold', 'Cream'],
    avoidColors: ['Icy Lilac', 'Blue Grey', 'Neon Lime'],
    hexPalette: ['#E6B08C', '#D6B05E', '#6C9A8B', '#D48C8C', '#B9A47A', '#F4E7D5'],
    metals: 'Yellow Gold, Rose Gold, Bronze',
    neutrals: ['Cream', 'Mushroom', 'Warm Taupe', 'Soft Olive'],
    tips: [
      'Balanced warm neutrals are elegant on honey-beige skin',
      'Muted teal and apricot create flattering contrast without harshness',
      'Keep very cold greys away from the face',
      'Antique gold accessories look effortless on you'
    ]
  },
  medium: {
    name: 'Medium / Golden Olive',
    undertone: 'Warm-golden',
    seasonPalette: 'Warm Autumn / True Spring',
    bestColors: ['Terracotta', 'Burnt Orange', 'Olive Green', 'Warm Gold', 'Rust', 'Teal', 'Burgundy', 'Chocolate Brown'],
    avoidColors: ['Pastel Pink', 'Cool Lilac', 'Icy Blue'],
    hexPalette: ['#C9816A', '#B8860B', '#6B8E23', '#CD853F', '#8B4513', '#2F8B8B'],
    metals: 'Yellow Gold, Bronze, Copper',
    neutrals: ['Camel', 'Olive', 'Warm Brown', 'Rust'],
    tips: [
      'Earth tones create a gorgeous monochromatic effect',
      'Jewel tones like emerald and sapphire provide beautiful contrast',
      'Copper and bronze accessories are your best friends',
      'Avoid icy pastels that compete with your natural warmth'
    ]
  },
  olive: {
    name: 'Olive / Neutral Gold',
    undertone: 'Olive-neutral',
    seasonPalette: 'Deep Autumn / Soft Winter',
    bestColors: ['Forest Green', 'Petrol Blue', 'Terracotta', 'Warm Ivory', 'Aubergine', 'Brick Red', 'Deep Teal', 'Moss'],
    avoidColors: ['Ash Beige', 'Icy Mint', 'Pale Lavender'],
    hexPalette: ['#3F5B3C', '#2C5F77', '#BA6C49', '#F2E6D8', '#5D3A5A', '#7A8A4B'],
    metals: 'Antique Gold, Bronze, Mixed',
    neutrals: ['Warm Ivory', 'Espresso', 'Olive Brown', 'Soft Black'],
    tips: [
      'Depth and muted richness work beautifully with olive undertones',
      'Petrol, forest, and aubergine give strong contrast without sharpness',
      'Avoid overly ashy shades that flatten your skin',
      'Mixed metals are often more harmonious than ultra-cool finishes'
    ]
  },
  tan: {
    name: 'Tan / Caramel',
    undertone: 'Warm-copper',
    seasonPalette: 'Deep Autumn / Warm Autumn',
    bestColors: ['Ivory White', 'Bright Coral', 'Cobalt Blue', 'Fuchsia', 'Warm Yellow', 'Emerald', 'Cognac', 'Forest Green'],
    avoidColors: ['Nude Beige', 'Dusty Pink', 'Light Brown'],
    hexPalette: ['#FFFAF0', '#FF6B6B', '#0047AB', '#E8D200', '#228B22', '#C8602A'],
    metals: 'Yellow Gold, Copper, Bronze',
    neutrals: ['Crisp White', 'Ivory', 'Cognac', 'Caramel'],
    tips: [
      'Bright saturated colours pop beautifully against your skin',
      'White and ivory are your most powerful neutrals',
      'Avoid muted neutrals close to your skin tone',
      'Bold jewel tones create stunning contrast'
    ]
  },
  deep: {
    name: 'Deep / Rich Brown',
    undertone: 'Warm',
    seasonPalette: 'Deep Autumn / Deep Winter',
    bestColors: ['Cobalt Blue', 'Royal Purple', 'Hot Pink', 'Bright White', 'Emerald Green', 'Saffron Yellow', 'Deep Red', 'Tangerine'],
    avoidColors: ['Dark Brown', 'Dark Olive', 'Charcoal Grey'],
    hexPalette: ['#0047AB', '#7B2D8B', '#FF69B4', '#FFFFFF', '#50C878', '#FF8C00'],
    metals: 'Gold, Rose Gold, Copper',
    neutrals: ['Bright White', 'Cobalt', 'Royal Blue', 'Ivory'],
    tips: [
      'Bright vivid colours create stunning contrast',
      'Crisp white and bright colours make your complexion radiate',
      'Rich jewel tones look absolutely regal on you',
      'Avoid colours too close to your skin tone'
    ]
  },
  rich: {
    name: 'Rich / Espresso Brown',
    undertone: 'Neutral-rich',
    seasonPalette: 'Deep Winter / Jewel Autumn',
    bestColors: ['Ruby', 'Peacock Blue', 'Marigold', 'Pure Ivory', 'Magenta', 'Emerald', 'Electric Blue', 'Amethyst'],
    avoidColors: ['Dusty Brown', 'Muted Khaki', 'Smoke Olive'],
    hexPalette: ['#8B1E3F', '#006D77', '#E3A008', '#FFF8F0', '#B32D7D', '#0F8B5F'],
    metals: 'Gold, Copper, Oxidised Gold',
    neutrals: ['Pure Ivory', 'Espresso', 'Midnight Navy', 'Camel'],
    tips: [
      'High-clarity jewel shades feel luxurious on rich espresso skin',
      'Ivory often creates a cleaner contrast than beige',
      'Keep muddy earth shades away from the face',
      'Strong metallic warmth brings a premium finish'
    ]
  },
  dark: {
    name: 'Dark / Ebony',
    undertone: 'Neutral-warm',
    seasonPalette: 'Deep Winter / True Winter',
    bestColors: ['Pure White', 'Cobalt Blue', 'Canary Yellow', 'Hot Pink', 'Bright Turquoise', 'Electric Red', 'Lime Green', 'Gold'],
    avoidColors: ['Dark Navy', 'Very Dark Colours', 'Muddy Browns'],
    hexPalette: ['#FFFFFF', '#0047AB', '#FFE900', '#FF69B4', '#00CED1', '#FF0000'],
    metals: 'Gold, Rose Gold, Yellow Gold',
    neutrals: ['Pure White', 'Bright Ivory', 'Camel', 'Gold'],
    tips: [
      'High-contrast colours celebrate your complexion',
      'Pure white is one of your most striking choices',
      'Bright saturated hues look extraordinary on deep skin',
      'Avoid very dark tones that reduce visual contrast'
    ]
  },
  ebony: {
    name: 'Ebony / Deep Cool Brown',
    undertone: 'Neutral-cool',
    seasonPalette: 'Deep Winter / True Winter',
    bestColors: ['Pure White', 'Cobalt Blue', 'Canary Yellow', 'Hot Pink', 'Bright Turquoise', 'Electric Red', 'Lime Green', 'Gold'],
    avoidColors: ['Dark Navy', 'Very Dark Colours', 'Muddy Browns'],
    hexPalette: ['#FFFFFF', '#0047AB', '#FFE900', '#FF69B4', '#00CED1', '#FF0000'],
    metals: 'Gold, Rose Gold, Yellow Gold',
    neutrals: ['Pure White', 'Bright Ivory', 'Camel', 'Gold'],
    tips: [
      'Build high-contrast looks with white and cobalt',
      'Use bright turquoise and gold confidently',
      'Keep prints crisp and intentional',
      'Try clean ivory for daywear'
    ]
  }
};

export const DOS_DONTS: Record<string, DosDonts> = {
  porcelain: {
    dos: ['Choose cool rose and blue-based pastels', 'Use silver jewellery to sharpen your palette', 'Keep contrast soft but defined', 'Lean on dove grey and soft white'],
    donts: ['Avoid earthy mustard near the face', 'Skip murky olive tones', 'Avoid harsh warm rust shades']
  },
  fair: {
    dos: ['Wear jewel tones for drama', 'Choose cool pastels daily', 'Layer silver jewellery', 'Try navy — incredibly flattering'],
    donts: ['Avoid orange near your face', 'Skip warm browns in tops', 'Avoid overly warm colour combos']
  },
  light: {
    dos: ['Embrace warm peachy tones', 'Gold jewellery is your best friend', 'Warm camel and nude are perfect bases', 'Coral shades complement beautifully'],
    donts: ['Avoid stark white — try warm ivory', 'Skip cool grey — choose warm beige', 'Avoid neons that wash you out']
  },
  light_medium: {
    dos: ['Build around apricot, cream, and muted teal', 'Use antique gold hardware', 'Keep prints soft and tonal', 'Choose warm taupe instead of cold grey'],
    donts: ['Avoid icy lilac close to your face', 'Skip neon accents', 'Avoid very blue greys in tops']
  },
  medium: {
    dos: ['Earth tones create gorgeous harmony', 'Jewel tones provide beautiful contrast', 'Bronze and copper enhance your glow', 'Deep greens and teals complement perfectly'],
    donts: ['Avoid icy pastels competing with warmth', 'Skip cool lavender and baby pink', 'Avoid very pale colours that look dull']
  },
  olive: {
    dos: ['Wear petrol, forest, and aubergine confidently', 'Use mixed metals when styling', 'Anchor looks with warm ivory', 'Choose depth over brightness'],
    donts: ['Avoid ashy beige near your face', 'Skip pastel mint', 'Avoid overly cool pale lavender']
  },
  tan: {
    dos: ['Bright saturated colours pop beautifully', 'White and ivory are most striking neutrals', 'Cobalt blue looks phenomenal on you', 'Bold prints were made for your colouring'],
    donts: ['Avoid colours too close to your skin tone', 'Skip dusty pinks and nude beiges', 'Avoid very muted greyed-out tones']
  },
  deep: {
    dos: ['Vivid jewel tones are your power colours', 'Pure white creates a stunning contrast', 'Bright accents in accessories add energy', 'Rich saturated fabrics celebrate your skin'],
    donts: ['Avoid dark colours that reduce contrast', 'Skip dusty muted colour versions', 'Avoid very dark brown near your face']
  },
  rich: {
    dos: ['Use jewel tones with clear contrast', 'Choose ivory instead of dusty beige', 'Let gold and copper accessories lead', 'Try strong saturated accents'],
    donts: ['Avoid muddy khaki near your face', 'Skip washed-out olives', 'Avoid overly dusty browns']
  },
  dark: {
    dos: ['High-contrast looks are your signature', 'Pure white and brights make you radiate', 'Gold jewellery creates a regal glow', 'Canary yellow and turquoise are stunning'],
    donts: ['Avoid head-to-toe very dark looks', 'Skip muddy brown tones', 'Avoid colours too close to your undertone']
  },
  ebony: {
    dos: ['Build high-contrast looks with white and cobalt', 'Use bright turquoise and gold confidently', 'Keep prints crisp and intentional', 'Try clean ivory for daywear'],
    donts: ['Avoid head-to-toe very dark looks', 'Skip muddy brown tones', 'Avoid flat low-contrast palettes']
  }
};
