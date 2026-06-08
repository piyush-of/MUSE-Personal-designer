export interface ShoppingItem {
  item: string;
  category: string;
  priceRange: string;
  why: string;
  styleTip: string;
  amazon?: string;
  flipkart?: string;
}

export const SHOPPING_DB: Record<string, ShoppingItem[]> = {
  earthy: [
    { item: 'Terracotta Linen Co-ord Set', category: 'Co-ord', priceRange: '₹2,000–5,000', why: 'Earthy terracotta is deeply flattering for warm skin tones', styleTip: 'Add gold jewellery to amplify the warm tones', amazon: 'https://www.amazon.in/s?k=terracotta+linen+co-ord+set+women', flipkart: 'https://www.flipkart.com/search?q=terracotta+co+ord+set' },
    { item: 'Rust Midi Skirt', category: 'Bottoms', priceRange: '₹1,000–2,800', why: 'A rust-toned midi skirt is the perfect earth-tone statement', styleTip: 'Pair with a simple white or cream top', amazon: 'https://www.amazon.in/s?k=rust+midi+skirt+women', flipkart: 'https://www.flipkart.com/search?q=rust+midi+skirt+women' },
    { item: 'Olive Green Cargo Pants', category: 'Bottoms', priceRange: '₹1,500–4,000', why: 'Olive adds earthy utilitarian edge that is very current', styleTip: 'Tuck in a fitted tee and add white sneakers', amazon: 'https://www.amazon.in/s?k=olive+cargo+pants+women', flipkart: 'https://www.flipkart.com/search?q=olive+cargo+pants+women' },
    { item: 'Tan Block-Heel Mules', category: 'Footwear', priceRange: '₹1,200–3,000', why: 'Tan mules elongate the leg and complement all earth tones', styleTip: 'Wear with ankle-length trousers', amazon: 'https://www.amazon.in/s?k=tan+block+heel+mules+women', flipkart: 'https://www.flipkart.com/search?q=tan+block+heel+mules' },
    { item: 'Mocha Utility Jacket', category: 'Outerwear', priceRange: '₹2,200–5,500', why: 'A structured mocha jacket layers beautifully over earth-tone basics', styleTip: 'Pair with a fitted rib tank and straight denim', amazon: 'https://www.amazon.in/s?k=mocha+utility+jacket+women', flipkart: 'https://www.flipkart.com/search?q=brown+utility+jacket+women' },
    { item: 'Olive Satin Midi Dress', category: 'Dress', priceRange: '₹1,800–4,800', why: 'Olive satin brings softness and polish to an earthy palette', styleTip: 'Add tan sandals and gold hoops for evening', amazon: 'https://www.amazon.in/s?k=olive+satin+midi+dress+women', flipkart: 'https://www.flipkart.com/search?q=olive+midi+dress+women' },
  ],
  bold: [
    { item: 'Cobalt Blue Wrap Dress', category: 'Dress', priceRange: '₹1,800–4,500', why: 'Cobalt blue is incredibly flattering and universally versatile', styleTip: 'A wrap style suits all body types', amazon: 'https://www.amazon.in/s?k=cobalt+blue+wrap+dress+women', flipkart: 'https://www.flipkart.com/search?q=cobalt+blue+wrap+dress' },
    { item: 'Printed Palazzo Set', category: 'Co-ord', priceRange: '₹1,500–3,500', why: 'A bold print adds personality and visual interest', styleTip: 'Keep accessories minimal when wearing a statement print', amazon: 'https://www.amazon.in/s?k=printed+palazzo+set+women', flipkart: 'https://www.flipkart.com/search?q=printed+palazzo+set+women' },
    { item: 'Red Strappy Block Heels', category: 'Footwear', priceRange: '₹1,500–4,000', why: 'Red shoes are the perfect pop of colour to any look', styleTip: 'Even all-black outfits come alive with a red shoe', amazon: 'https://www.amazon.in/s?k=red+block+heels+women', flipkart: 'https://www.flipkart.com/search?q=red+block+heels+women' },
    { item: 'Statement Colourblock Tote', category: 'Accessories', priceRange: '₹800–2,500', why: 'A colourblock bag ties together colourful outfit elements', styleTip: 'Match one colour in the bag to something in your outfit', amazon: 'https://www.amazon.in/s?k=colourblock+tote+bag+women', flipkart: 'https://www.flipkart.com/search?q=colourblock+tote+bag' },
    { item: 'Fuchsia Satin Shirt', category: 'Tops', priceRange: '₹1,200–3,200', why: 'Fuchsia instantly energizes denim, black tailoring and festive looks', styleTip: 'Balance the shine with matte trousers or jeans', amazon: 'https://www.amazon.in/s?k=fuchsia+satin+shirt+women', flipkart: 'https://www.flipkart.com/search?q=pink+satin+shirt+women' },
    { item: 'Emerald Statement Earrings', category: 'Accessories', priceRange: '₹700–2,200', why: 'A jewel-tone accessory adds boldness without overwhelming the outfit', styleTip: 'Use them to wake up neutral eveningwear', amazon: 'https://www.amazon.in/s?k=emerald+statement+earrings+women', flipkart: 'https://www.flipkart.com/search?q=green+statement+earrings+women' },
  ],
  classic: [
    { item: 'Tailored Beige Blazer', category: 'Outerwear', priceRange: '₹2,500–7,000', why: 'A neutral blazer instantly elevates any casual outfit', styleTip: 'Wear oversized for a current fashion-forward feel', amazon: 'https://www.amazon.in/s?k=beige+blazer+women+formal', flipkart: 'https://www.flipkart.com/search?q=beige+blazer+women' },
    { item: 'White Button-Down Shirt', category: 'Tops', priceRange: '₹800–2,500', why: 'The definition of effortless polished dressing', styleTip: 'Leave the collar open and roll the sleeves', amazon: 'https://www.amazon.in/s?k=white+button+down+shirt+women', flipkart: 'https://www.flipkart.com/search?q=white+formal+shirt+women' },
    { item: 'Dark-Wash Straight Jeans', category: 'Bottoms', priceRange: '₹1,500–4,500', why: 'Dark jeans are the most versatile trouser you can own', styleTip: 'A darker wash reads more formal — pair with heels', amazon: 'https://www.amazon.in/s?k=dark+wash+straight+jeans+women', flipkart: 'https://www.flipkart.com/search?q=dark+wash+straight+jeans+women' },
    { item: 'Nude Block-Heel Court Shoes', category: 'Footwear', priceRange: '₹1,200–3,500', why: 'Nude heels elongate the leg and go with everything', styleTip: 'Match to your skin tone for maximum leg-lengthening', amazon: 'https://www.amazon.in/s?k=nude+block+heel+court+shoes', flipkart: 'https://www.flipkart.com/search?q=nude+court+shoes+women' },
    { item: 'Navy Waistcoat Set', category: 'Co-ord', priceRange: '₹2,800–6,500', why: 'A matching waistcoat and trouser set gives classic tailoring a modern edge', styleTip: 'Wear with loafers for day and heels for dinner', amazon: 'https://www.amazon.in/s?k=women+navy+waistcoat+set', flipkart: 'https://www.flipkart.com/search?q=women+waistcoat+trouser+set' },
    { item: 'Leather Loafers', category: 'Footwear', priceRange: '₹1,800–4,800', why: 'Loafers add a polished finish while staying practical for everyday wear', styleTip: 'Pair with ankle-length trousers to show the shape', amazon: 'https://www.amazon.in/s?k=women+leather+loafers', flipkart: 'https://www.flipkart.com/search?q=women+loafers+formal' },
  ],
  pastel: [
    { item: 'Lavender Linen Co-ord', category: 'Co-ord', priceRange: '₹2,200–5,500', why: 'Lavender co-ords are the perfect relaxed-chic summer outfit', styleTip: 'Add white accessories to keep the look fresh', amazon: 'https://www.amazon.in/s?k=lavender+linen+co+ord+set', flipkart: 'https://www.flipkart.com/search?q=lavender+co+ord+set+women' },
    { item: 'Powder Blue Midi Dress', category: 'Dress', priceRange: '₹1,800–4,000', why: 'A powder blue midi is elegant, airy and endlessly wearable', styleTip: 'Straw accessories add beautiful texture contrast', amazon: 'https://www.amazon.in/s?k=powder+blue+midi+dress+women', flipkart: 'https://www.flipkart.com/search?q=powder+blue+midi+dress' },
    { item: 'Blush Pink Cardigan', category: 'Tops', priceRange: '₹1,000–3,000', why: 'A blush cardigan adds feminine softness to any outfit', styleTip: 'Layer over a white slip dress for a romantic look', amazon: 'https://www.amazon.in/s?k=blush+pink+cardigan+women', flipkart: 'https://www.flipkart.com/search?q=blush+pink+cardigan+women' },
    { item: 'White Strappy Flat Sandals', category: 'Footwear', priceRange: '₹800–2,500', why: 'White sandals complement all pastels without competing', styleTip: 'A barely-there sandal keeps focus on dreamy colours', amazon: 'https://www.amazon.in/s?k=white+strappy+flat+sandals+women', flipkart: 'https://www.flipkart.com/search?q=white+strappy+sandals+women' },
    { item: 'Mint Knit Polo', category: 'Tops', priceRange: '₹900–2,600', why: 'Mint feels fresh in warm weather and layers well with cream basics', styleTip: 'Tuck into wide-leg white trousers for a polished pastel look', amazon: 'https://www.amazon.in/s?k=mint+knit+polo+women', flipkart: 'https://www.flipkart.com/search?q=mint+top+women' },
    { item: 'Butter Yellow Shoulder Bag', category: 'Accessories', priceRange: '₹1,000–2,800', why: 'A soft yellow bag adds a gentle accent without overpowering the palette', styleTip: 'Use it to brighten monochrome ivory outfits', amazon: 'https://www.amazon.in/s?k=butter+yellow+shoulder+bag+women', flipkart: 'https://www.flipkart.com/search?q=yellow+shoulder+bag+women' },
  ],
  neutral: [
    { item: 'White Linen Shirt', category: 'Tops', priceRange: '₹800–2,000', why: 'A crisp white shirt is the ultimate wardrobe foundation', styleTip: 'Tuck half into high-waisted trousers for effortless smart look', amazon: 'https://www.amazon.in/s?k=white+linen+shirt+women', flipkart: 'https://www.flipkart.com/search?q=white+linen+shirt+women' },
    { item: 'Black Slim Trousers', category: 'Bottoms', priceRange: '₹1,200–3,500', why: 'Versatile black trousers anchor any outfit and work day to night', styleTip: 'Roll the hem one fold for a modern relaxed silhouette', amazon: 'https://www.amazon.in/s?k=black+slim+trousers+women+formal', flipkart: 'https://www.flipkart.com/search?q=black+slim+fit+trousers+women' },
    { item: 'Camel Trench Coat', category: 'Outerwear', priceRange: '₹3,500–9,000', why: 'A trench coat is the single most timeless outerwear you can own', styleTip: 'Belt at the waist to create a defined elegant silhouette', amazon: 'https://www.amazon.in/s?k=camel+trench+coat+women', flipkart: 'https://www.flipkart.com/search?q=camel+trench+coat+women' },
    { item: 'White Leather Sneakers', category: 'Footwear', priceRange: '₹1,500–5,000', why: 'Clean white sneakers work with virtually every style', styleTip: 'Keep them clean — scuffed white sneakers undermine the look', amazon: 'https://www.amazon.in/s?k=white+leather+sneakers+women', flipkart: 'https://www.flipkart.com/search?q=white+sneakers+women' },
    { item: 'Stone Knit Tank', category: 'Tops', priceRange: '₹700–1,800', why: 'A stone knit tank is a versatile base layer for blazers, shirts and skirts', styleTip: 'Use it under a tonal beige outfit for quiet-luxury energy', amazon: 'https://www.amazon.in/s?k=beige+knit+tank+women', flipkart: 'https://www.flipkart.com/search?q=beige+knit+top+women' },
    { item: 'Greige Wide-Leg Trousers', category: 'Bottoms', priceRange: '₹1,500–4,200', why: 'Greige trousers soften black-and-white wardrobes and feel more elevated than denim', styleTip: 'Pair with a fitted white tee and gold hoops', amazon: 'https://www.amazon.in/s?k=greige+wide+leg+trousers+women', flipkart: 'https://www.flipkart.com/search?q=beige+wide+leg+trousers+women' },
  ],
};

export interface OutfitFormula {
  name: string;
  pieces: string[];
  vibe: string;
  occasion: string;
}

export const COMBO_DB: Record<string, OutfitFormula[]> = {
  office: [
    { name: 'The Power Edit',    pieces: ['Tailored Blazer', 'Straight-leg Trousers', 'Silk Blouse', 'Block-heel Pumps'], vibe: 'Authoritative & Polished', occasion: 'Boardroom / Client Meetings' },
    { name: 'Smart Minimal',     pieces: ['White Shirt', 'Dark Trousers', 'Leather Loafers', 'Structured Tote'], vibe: 'Clean & Confident', occasion: 'Everyday Office' },
    { name: 'Feminine Corporate', pieces: ['Wrap Dress', 'Court Heels', 'Gold Chain Necklace', 'Minimal Watch'], vibe: 'Professional & Graceful', occasion: 'Important Presentations' },
    { name: 'Modern Waistcoat',   pieces: ['Matching Waistcoat', 'Wide-leg Trousers', 'Pointed Flats', 'Structured Shoulder Bag'], vibe: 'Tailored & Current', occasion: 'Creative Office / Meetings' },
    { name: 'Monochrome Boardroom', pieces: ['Ivory Blouse', 'Charcoal Trousers', 'Single-breasted Blazer', 'Leather Pumps'], vibe: 'Sharp & Elevated', occasion: 'Senior Leadership Meetings' },
  ],
  casual: [
    { name: 'Weekend Ease',      pieces: ['Linen Tee', 'Straight-cut Jeans', 'White Sneakers', 'Canvas Tote'], vibe: 'Relaxed & Effortless', occasion: 'Weekend Errands / Markets' },
    { name: 'Coffee Shop Chic',  pieces: ['Oversized Shirt', 'Bike Shorts', 'Chunky Sneakers', 'Mini Bag'], vibe: 'Cool & Casual', occasion: 'Brunch / Coffee Dates' },
    { name: 'Soft Day Out',      pieces: ['Flowy Midi Skirt', 'Fitted Tank', 'Flat Sandals', 'Straw Hat'], vibe: 'Breezy & Feminine', occasion: 'Afternoon Out' },
    { name: 'Utility Off-Duty',   pieces: ['Cargo Pants', 'Ribbed Tank', 'Overshirt', 'Retro Trainers'], vibe: 'Laid-back & Contemporary', occasion: 'Travel / Day Out' },
    { name: 'Denim Balance',     pieces: ['Denim Shirt', 'White Tank', 'Ecru Trousers', 'Leather Slides'], vibe: 'Clean & Easy', occasion: 'Casual Lunch' },
  ],
  evening: [
    { name: 'Night Out Edit',    pieces: ['Satin Slip Dress', 'Strappy Heels', 'Clutch Bag', 'Statement Earrings'], vibe: 'Sultry & Sophisticated', occasion: 'Dinner / Night Out' },
    { name: 'Party Ready',       pieces: ['Sequin Top', 'Wide-leg Trousers', 'Block Heels', 'Mini Bag'], vibe: 'Festive & Fun', occasion: 'Parties / Events' },
    { name: 'Elevated Casual',   pieces: ['Blazer', 'Cami Top', 'Straight Jeans', 'Pointed-toe Flats'], vibe: 'Smart & Stylish', occasion: 'Casual Dinner Date' },
    { name: 'Liquid Metal',      pieces: ['Metallic Midi Dress', 'Minimal Sandals', 'Cuff Bracelet', 'Micro Bag'], vibe: 'Sleek & Luminous', occasion: 'Cocktail Evening' },
    { name: 'Dark Romance',      pieces: ['Off-shoulder Top', 'Satin Skirt', 'Heeled Mules', 'Drop Earrings'], vibe: 'Romantic & Refined', occasion: 'Date Night' },
  ],
  festival: [
    { name: 'Boho Goddess',      pieces: ['Embroidered Kurta', 'Palazzo Pants', 'Kolhapuri Chappals', 'Jhumkas'], vibe: 'Ethnic-modern Fusion', occasion: 'Festivals / Pujas' },
    { name: 'Indo-Western',      pieces: ['Crop Top', 'High-waist Dhoti Pants', 'Heeled Sandals', 'Statement Necklace'], vibe: 'Contemporary Indian', occasion: 'Engagement / Mehendi' },
    { name: 'Modern Saree',      pieces: ['Pre-draped Saree', 'Fitted Blouse', 'Block-heel Sandals', 'Potli Bag'], vibe: 'Traditional & Elegant', occasion: 'Formal Functions / Weddings' },
    { name: 'Handloom Heritage',  pieces: ['Woven Saree', 'Temple Jewellery', 'Classic Blouse', 'Leather Flats'], vibe: 'Timeless & Cultural', occasion: 'Festive Lunch / Family Events' },
    { name: 'Mirrorwork Moment',  pieces: ['Mirrorwork Kurta Set', 'Embellished Juttis', 'Stacked Bangles', 'Mini Potli'], vibe: 'Bright & Celebratory', occasion: 'Festive Evening' },
  ],
};

export interface RetailerLink {
  name: string;
  url: string;
}

export function buildRetailerLinks(item: ShoppingItem): RetailerLink[] {
  const query = encodeURIComponent(String(item.item || '').trim().replace(/\s+/g, ' '));
  const links = [
    { name: 'Amazon', url: item.amazon || `https://www.amazon.in/s?k=${query}` },
    { name: 'Flipkart', url: item.flipkart || `https://www.flipkart.com/search?q=${query}` },
    { name: 'Myntra', url: `https://www.myntra.com/${query}` },
    { name: 'AJIO', url: `https://www.ajio.com/search/?text=${query}` },
    { name: 'Nykaa Fashion', url: `https://www.nykaafashion.com/catalogsearch/result/?q=${query}` },
    { name: 'Tata CLiQ', url: `https://www.tatacliq.com/search/?searchCategory=all&text=${query}` },
  ];
  return links;
}
