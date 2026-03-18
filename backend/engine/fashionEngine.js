'use strict';
/**
 * backend/engine/fashionEngine.js
 * Complete rule-based fashion intelligence. No external API needed.
 */

const Jimp = require('jimp');

/* ── Skin Tone Knowledge Base ─────────────────────────────────────────── */
const SKIN_DATA = {
  fair:   { name:'Fair / Ivory',          undertone:'Cool-pink',    seasonPalette:'Cool Summer / Clear Winter', bestColors:['Dusty Rose','Lavender','Powder Blue','Soft White','Cool Grey','Navy','Berry','Sage Green'], avoidColors:['Bright Orange','Warm Brown','Mustard Yellow'], hexPalette:['#E8D5D5','#C9D6E8','#D5E8D5','#E8E8E8','#A0A8B8','#2C3E6B'], metals:'Silver, White Gold, Platinum', neutrals:['White','Light Grey','Navy','Black'], tips:['Cool-toned colours harmonise with your complexion','Deep jewel tones like sapphire and emerald look stunning','Wear blush and mauve near your face for a natural flush','Avoid orange tones — they can make fair skin look washed'] },
  light:  { name:'Light / Warm Beige',    undertone:'Warm-neutral', seasonPalette:'Warm Spring / Light Summer',  bestColors:['Peach','Warm Ivory','Coral','Light Camel','Warm Pink','Aqua','Soft Gold','Mint'], avoidColors:['Stark White','Cool Grey','Neon Colours'], hexPalette:['#F2C4A0','#E8B89A','#D4A8C7','#B8D4C0','#E8D4A0','#C8A870'], metals:'Rose Gold, Yellow Gold, Bronze', neutrals:['Cream','Camel','Warm Beige','Nude'], tips:['Warm peachy tones echo the warmth in your skin','Gold jewellery enhances your warm undertones','Avoid very cool or stark colours','Earthy pastels work especially well for your colouring'] },
  medium: { name:'Medium / Golden Olive', undertone:'Warm-golden',  seasonPalette:'Warm Autumn / True Spring',   bestColors:['Terracotta','Burnt Orange','Olive Green','Warm Gold','Rust','Teal','Burgundy','Chocolate Brown'], avoidColors:['Pastel Pink','Cool Lilac','Icy Blue'], hexPalette:['#C9816A','#B8860B','#6B8E23','#CD853F','#8B4513','#2F8B8B'], metals:'Yellow Gold, Bronze, Copper', neutrals:['Camel','Olive','Warm Brown','Rust'], tips:['Earth tones create a gorgeous monochromatic effect','Jewel tones like emerald and sapphire provide beautiful contrast','Copper and bronze accessories are your best friends','Avoid icy pastels that compete with your natural warmth'] },
  tan:    { name:'Tan / Caramel',         undertone:'Warm-copper',  seasonPalette:'Deep Autumn / Warm Autumn',   bestColors:['Ivory White','Bright Coral','Cobalt Blue','Fuchsia','Warm Yellow','Emerald','Cognac','Forest Green'], avoidColors:['Nude Beige','Dusty Pink','Light Brown'], hexPalette:['#FFFAF0','#FF6B6B','#0047AB','#E8D200','#228B22','#C8602A'], metals:'Yellow Gold, Copper, Bronze', neutrals:['Crisp White','Ivory','Cognac','Caramel'], tips:['Bright saturated colours pop beautifully against your skin','White and ivory are your most powerful neutrals','Avoid muted neutrals close to your skin tone','Bold jewel tones create stunning contrast'] },
  deep:   { name:'Deep / Rich Brown',     undertone:'Warm',         seasonPalette:'Deep Autumn / Deep Winter',   bestColors:['Cobalt Blue','Royal Purple','Hot Pink','Bright White','Emerald Green','Saffron Yellow','Deep Red','Tangerine'], avoidColors:['Dark Brown','Dark Olive','Charcoal Grey'], hexPalette:['#0047AB','#7B2D8B','#FF69B4','#FFFFFF','#50C878','#FF8C00'], metals:'Gold, Rose Gold, Copper', neutrals:['Bright White','Cobalt','Royal Blue','Ivory'], tips:['Bright vivid colours create stunning contrast','Crisp white and bright colours make your complexion radiate','Rich jewel tones look absolutely regal on you','Avoid colours too close to your skin tone'] },
  dark:   { name:'Dark / Ebony',          undertone:'Neutral-warm', seasonPalette:'Deep Winter / True Winter',   bestColors:['Pure White','Cobalt Blue','Canary Yellow','Hot Pink','Bright Turquoise','Electric Red','Lime Green','Gold'], avoidColors:['Dark Navy','Very Dark Colours','Muddy Browns'], hexPalette:['#FFFFFF','#0047AB','#FFE900','#FF69B4','#00CED1','#FF0000'], metals:'Gold, Rose Gold, Yellow Gold', neutrals:['Pure White','Bright Ivory','Camel','Gold'], tips:['High-contrast colours celebrate your complexion','Pure white is one of your most striking choices','Bright saturated hues look extraordinary on deep skin','Avoid very dark tones that reduce visual contrast'] }
};

SKIN_DATA.porcelain = { name:'Porcelain / Rose Ivory', undertone:'Cool-rosy', seasonPalette:'Light Summer / Soft Winter', bestColors:['Rose Pink','Powder Blue','Periwinkle','Soft White','Cool Taupe','Dusty Mauve','Sage Mist','Silver Grey'], avoidColors:['Harsh Orange','Mustard','Dark Olive'], hexPalette:['#F4DCDD','#D5E3F4','#C8C9F0','#F5F4EF','#C6BBB3','#B7C8BA'], metals:'Silver, White Gold, Platinum', neutrals:['Soft White','Cool Taupe','Dove Grey','Navy'], tips:['Soft cool colours keep your complexion bright and refined','Rosy pastels near the face look naturally polished','Silver jewellery sharpens your undertone beautifully','Avoid muddy warm shades that overpower delicate contrast'] };
SKIN_DATA.light_medium = { name:'Light-Medium / Honey Beige', undertone:'Neutral-golden', seasonPalette:'Soft Autumn / Warm Spring', bestColors:['Apricot','Honey','Muted Teal','Warm Rose','Olive Beige','Soft Coral','Antique Gold','Cream'], avoidColors:['Icy Lilac','Blue Grey','Neon Lime'], hexPalette:['#E6B08C','#D6B05E','#6C9A8B','#D48C8C','#B9A47A','#F4E7D5'], metals:'Yellow Gold, Rose Gold, Bronze', neutrals:['Cream','Mushroom','Warm Taupe','Soft Olive'], tips:['Balanced warm neutrals are especially elegant on honey-beige skin','Muted teal and apricot create flattering contrast without harshness','Keep very cold greys away from the face','Antique gold accessories look effortless on you'] };
SKIN_DATA.olive = { name:'Olive / Neutral Gold', undertone:'Olive-neutral', seasonPalette:'Deep Autumn / Soft Winter', bestColors:['Forest Green','Petrol Blue','Terracotta','Warm Ivory','Aubergine','Brick Red','Deep Teal','Moss'], avoidColors:['Ash Beige','Icy Mint','Pale Lavender'], hexPalette:['#3F5B3C','#2C5F77','#BA6C49','#F2E6D8','#5D3A5A','#7A8A4B'], metals:'Antique Gold, Bronze, Mixed Metals', neutrals:['Warm Ivory','Espresso','Olive Brown','Soft Black'], tips:['Depth and muted richness work beautifully with olive undertones','Petrol, forest, and aubergine give strong contrast without sharpness','Avoid overly ashy shades that flatten your skin','Mixed metals are often more harmonious than ultra-cool finishes'] };
SKIN_DATA.rich = { name:'Rich / Espresso Brown', undertone:'Neutral-rich', seasonPalette:'Deep Winter / Jewel Autumn', bestColors:['Ruby','Peacock Blue','Marigold','Pure Ivory','Magenta','Emerald','Electric Blue','Amethyst'], avoidColors:['Dusty Brown','Muted Khaki','Smoke Olive'], hexPalette:['#8B1E3F','#006D77','#E3A008','#FFF8F0','#B32D7D','#0F8B5F'], metals:'Gold, Copper, Oxidised Gold', neutrals:['Pure Ivory','Espresso','Midnight Navy','Camel'], tips:['High-clarity jewel shades feel luxurious on rich espresso skin','Ivory often creates a cleaner contrast than beige','Keep muddy earth shades away from the face','Strong metallic warmth brings a premium finish to your palette'] };
SKIN_DATA.ebony = { ...SKIN_DATA.dark, name:'Ebony / Deep Cool Brown', undertone:'Neutral-cool' };

const COLOR_CATEGORIES = [
  { name:'White / Ivory',     test:(r,g,b)=>r>210&&g>210&&b>210 },
  { name:'Black / Charcoal',  test:(r,g,b)=>r<60&&g<60&&b<60 },
  { name:'Grey',              test:(r,g,b)=>Math.abs(r-g)<20&&Math.abs(g-b)<20&&r>60&&r<210 },
  { name:'Navy Blue',         test:(r,g,b)=>b>r+40&&b>g+40&&b<130 },
  { name:'Blue',              test:(r,g,b)=>b>r+30&&b>g+20&&b>120 },
  { name:'Sky Blue',          test:(r,g,b)=>b>180&&g>160&&r<160 },
  { name:'Teal / Turquoise',  test:(r,g,b)=>g>r+20&&b>r+20&&g>100&&b>100 },
  { name:'Green',             test:(r,g,b)=>g>r+30&&g>b+20&&g>100 },
  { name:'Olive Green',       test:(r,g,b)=>g>r&&g>b&&r>80&&r<160&&g<160 },
  { name:'Yellow',            test:(r,g,b)=>r>180&&g>180&&b<120 },
  { name:'Mustard',           test:(r,g,b)=>r>160&&g>120&&g<180&&b<80 },
  { name:'Orange',            test:(r,g,b)=>r>180&&g>80&&g<160&&b<80 },
  { name:'Terracotta',        test:(r,g,b)=>r>160&&g>80&&g<130&&b<100 },
  { name:'Red',               test:(r,g,b)=>r>160&&g<100&&b<100 },
  { name:'Burgundy / Wine',   test:(r,g,b)=>r>100&&r<180&&g<60&&b<80 },
  { name:'Pink',              test:(r,g,b)=>r>180&&b>140&&g<r-30 },
  { name:'Blush',             test:(r,g,b)=>r>200&&g>160&&b>160&&r>g&&r>b },
  { name:'Purple / Violet',   test:(r,g,b)=>r>80&&b>r&&b>g+20&&b<200 },
  { name:'Lavender',          test:(r,g,b)=>r>160&&b>180&&g>140&&b>r },
  { name:'Brown / Chocolate', test:(r,g,b)=>r>80&&r<180&&g>40&&g<120&&b<80 },
  { name:'Camel / Tan',       test:(r,g,b)=>r>160&&g>120&&b>80&&r>g&&g>b },
  { name:'Beige / Cream',     test:(r,g,b)=>r>200&&g>185&&b>160&&r>b },
  { name:'Denim Blue',        test:(r,g,b)=>b>r&&b>g&&r>60&&r<130&&b>100&&b<180 },
];

const STYLE_RULES=[
  {category:'Monochrome Chic',   occasions:['Office','Art Gallery','City Walk'],      check:c=>hasSimilarFamily(c)},
  {category:'Smart Casual',      occasions:['Office','Lunch Date','Weekend Brunch'],  check:c=>hasNeutral(c)&&!hasBright(c)},
  {category:'Bold & Vivid',      occasions:['Party','Night Out','Festival','Events'], check:c=>hasBright(c)},
  {category:'Earth Tone Edit',   occasions:['Casual Day Out','Travel','Weekend'],     check:c=>hasEarthy(c)},
  {category:'Classic & Refined', occasions:['Formal Event','Business','Fine Dining'], check:c=>hasClassic(c)},
  {category:'Pastel Dream',      occasions:['Brunch','Garden Party','Daytime'],       check:c=>hasPastel(c)},
  {category:'Casual Cool',       occasions:['Everyday','Errands','Coffee Run'],       check:()=>true},
];

const GOOD_PAIRS=[['Navy Blue','White / Ivory'],['Black / Charcoal','White / Ivory'],['Camel / Tan','White / Ivory'],['Terracotta','Olive Green'],['Burgundy / Wine','Grey'],['Blue','White / Ivory'],['Navy Blue','Camel / Tan'],['Brown / Chocolate','Beige / Cream'],['Olive Green','Brown / Chocolate'],['Teal / Turquoise','White / Ivory'],['Red','Black / Charcoal'],['Pink','Grey'],['Yellow','Navy Blue']];
const BAD_PAIRS=[['Red','Orange'],['Pink','Orange'],['Purple / Violet','Green'],['Yellow','Purple / Violet'],['Red','Pink']];

const SHOPPING_DB={
  earthy:[
    {item:'Terracotta Linen Co-ord Set',category:'Co-ord',priceRange:'₹2,000–5,000',why:'Earthy terracotta is deeply flattering for warm skin tones',styleTip:'Add gold jewellery to amplify the warm tones',amazon:'https://www.amazon.in/s?k=terracotta+linen+co-ord+set+women',flipkart:'https://www.flipkart.com/search?q=terracotta+co+ord+set'},
    {item:'Rust Midi Skirt',category:'Bottoms',priceRange:'₹1,000–2,800',why:'A rust-toned midi skirt is the perfect earth-tone statement',styleTip:'Pair with a simple white or cream top',amazon:'https://www.amazon.in/s?k=rust+midi+skirt+women',flipkart:'https://www.flipkart.com/search?q=rust+midi+skirt+women'},
    {item:'Olive Green Cargo Pants',category:'Bottoms',priceRange:'₹1,500–4,000',why:'Olive adds earthy utilitarian edge that is very current',styleTip:'Tuck in a fitted tee and add white sneakers',amazon:'https://www.amazon.in/s?k=olive+cargo+pants+women',flipkart:'https://www.flipkart.com/search?q=olive+cargo+pants+women'},
    {item:'Tan Block-Heel Mules',category:'Footwear',priceRange:'₹1,200–3,000',why:'Tan mules elongate the leg and complement all earth tones',styleTip:'Wear with ankle-length trousers',amazon:'https://www.amazon.in/s?k=tan+block+heel+mules+women',flipkart:'https://www.flipkart.com/search?q=tan+block+heel+mules'},
    {item:'Mocha Utility Jacket',category:'Outerwear',priceRange:'₹2,200–5,500',why:'A structured mocha jacket layers beautifully over earth-tone basics',styleTip:'Pair with a fitted rib tank and straight denim',amazon:'https://www.amazon.in/s?k=mocha+utility+jacket+women',flipkart:'https://www.flipkart.com/search?q=brown+utility+jacket+women'},
    {item:'Olive Satin Midi Dress',category:'Dress',priceRange:'₹1,800–4,800',why:'Olive satin brings softness and polish to an earthy palette',styleTip:'Add tan sandals and gold hoops for evening',amazon:'https://www.amazon.in/s?k=olive+satin+midi+dress+women',flipkart:'https://www.flipkart.com/search?q=olive+midi+dress+women'},
  ],
  bold:[
    {item:'Cobalt Blue Wrap Dress',category:'Dress',priceRange:'₹1,800–4,500',why:'Cobalt blue is incredibly flattering and universally versatile',styleTip:'A wrap style suits all body types',amazon:'https://www.amazon.in/s?k=cobalt+blue+wrap+dress+women',flipkart:'https://www.flipkart.com/search?q=cobalt+blue+wrap+dress'},
    {item:'Printed Palazzo Set',category:'Co-ord',priceRange:'₹1,500–3,500',why:'A bold print adds personality and visual interest',styleTip:'Keep accessories minimal when wearing a statement print',amazon:'https://www.amazon.in/s?k=printed+palazzo+set+women',flipkart:'https://www.flipkart.com/search?q=printed+palazzo+set+women'},
    {item:'Red Strappy Block Heels',category:'Footwear',priceRange:'₹1,500–4,000',why:'Red shoes are the perfect pop of colour to any look',styleTip:'Even all-black outfits come alive with a red shoe',amazon:'https://www.amazon.in/s?k=red+block+heels+women',flipkart:'https://www.flipkart.com/search?q=red+block+heels+women'},
    {item:'Statement Colourblock Tote',category:'Accessories',priceRange:'₹800–2,500',why:'A colourblock bag ties together colourful outfit elements',styleTip:'Match one colour in the bag to something in your outfit',amazon:'https://www.amazon.in/s?k=colourblock+tote+bag+women',flipkart:'https://www.flipkart.com/search?q=colourblock+tote+bag'},
    {item:'Fuchsia Satin Shirt',category:'Tops',priceRange:'₹1,200–3,200',why:'Fuchsia instantly energizes denim, black tailoring and festive looks',styleTip:'Balance the shine with matte trousers or jeans',amazon:'https://www.amazon.in/s?k=fuchsia+satin+shirt+women',flipkart:'https://www.flipkart.com/search?q=pink+satin+shirt+women'},
    {item:'Emerald Statement Earrings',category:'Accessories',priceRange:'₹700–2,200',why:'A jewel-tone accessory adds boldness without overwhelming the outfit',styleTip:'Use them to wake up neutral eveningwear',amazon:'https://www.amazon.in/s?k=emerald+statement+earrings+women',flipkart:'https://www.flipkart.com/search?q=green+statement+earrings+women'},
  ],
  classic:[
    {item:'Tailored Beige Blazer',category:'Outerwear',priceRange:'₹2,500–7,000',why:'A neutral blazer instantly elevates any casual outfit',styleTip:'Wear oversized for a current fashion-forward feel',amazon:'https://www.amazon.in/s?k=beige+blazer+women+formal',flipkart:'https://www.flipkart.com/search?q=beige+blazer+women'},
    {item:'White Button-Down Shirt',category:'Tops',priceRange:'₹800–2,500',why:'The definition of effortless polished dressing',styleTip:'Leave the collar open and roll the sleeves',amazon:'https://www.amazon.in/s?k=white+button+down+shirt+women',flipkart:'https://www.flipkart.com/search?q=white+formal+shirt+women'},
    {item:'Dark-Wash Straight Jeans',category:'Bottoms',priceRange:'₹1,500–4,500',why:'Dark jeans are the most versatile trouser you can own',styleTip:'A darker wash reads more formal — pair with heels',amazon:'https://www.amazon.in/s?k=dark+wash+straight+jeans+women',flipkart:'https://www.flipkart.com/search?q=dark+wash+straight+jeans+women'},
    {item:'Nude Block-Heel Court Shoes',category:'Footwear',priceRange:'₹1,200–3,500',why:'Nude heels elongate the leg and go with everything',styleTip:'Match to your skin tone for maximum leg-lengthening',amazon:'https://www.amazon.in/s?k=nude+block+heel+court+shoes',flipkart:'https://www.flipkart.com/search?q=nude+court+shoes+women'},
    {item:'Navy Waistcoat Set',category:'Co-ord',priceRange:'₹2,800–6,500',why:'A matching waistcoat and trouser set gives classic tailoring a modern edge',styleTip:'Wear with loafers for day and heels for dinner',amazon:'https://www.amazon.in/s?k=women+navy+waistcoat+set',flipkart:'https://www.flipkart.com/search?q=women+waistcoat+trouser+set'},
    {item:'Leather Loafers',category:'Footwear',priceRange:'₹1,800–4,800',why:'Loafers add a polished finish while staying practical for everyday wear',styleTip:'Pair with ankle-length trousers to show the shape',amazon:'https://www.amazon.in/s?k=women+leather+loafers',flipkart:'https://www.flipkart.com/search?q=women+loafers+formal'},
  ],
  pastel:[
    {item:'Lavender Linen Co-ord',category:'Co-ord',priceRange:'₹2,200–5,500',why:'Lavender co-ords are the perfect relaxed-chic summer outfit',styleTip:'Add white accessories to keep the look fresh',amazon:'https://www.amazon.in/s?k=lavender+linen+co+ord+set',flipkart:'https://www.flipkart.com/search?q=lavender+co+ord+set+women'},
    {item:'Powder Blue Midi Dress',category:'Dress',priceRange:'₹1,800–4,000',why:'A powder blue midi is elegant, airy and endlessly wearable',styleTip:'Straw accessories add beautiful texture contrast',amazon:'https://www.amazon.in/s?k=powder+blue+midi+dress+women',flipkart:'https://www.flipkart.com/search?q=powder+blue+midi+dress'},
    {item:'Blush Pink Cardigan',category:'Tops',priceRange:'₹1,000–3,000',why:'A blush cardigan adds feminine softness to any outfit',styleTip:'Layer over a white slip dress for a romantic look',amazon:'https://www.amazon.in/s?k=blush+pink+cardigan+women',flipkart:'https://www.flipkart.com/search?q=blush+pink+cardigan+women'},
    {item:'White Strappy Flat Sandals',category:'Footwear',priceRange:'₹800–2,500',why:'White sandals complement all pastels without competing',styleTip:'A barely-there sandal keeps focus on dreamy colours',amazon:'https://www.amazon.in/s?k=white+strappy+flat+sandals+women',flipkart:'https://www.flipkart.com/search?q=white+strappy+sandals+women'},
    {item:'Mint Knit Polo',category:'Tops',priceRange:'₹900–2,600',why:'Mint feels fresh in warm weather and layers well with cream basics',styleTip:'Tuck into wide-leg white trousers for a polished pastel look',amazon:'https://www.amazon.in/s?k=mint+knit+polo+women',flipkart:'https://www.flipkart.com/search?q=mint+top+women'},
    {item:'Butter Yellow Shoulder Bag',category:'Accessories',priceRange:'₹1,000–2,800',why:'A soft yellow bag adds a gentle accent without overpowering the palette',styleTip:'Use it to brighten monochrome ivory outfits',amazon:'https://www.amazon.in/s?k=butter+yellow+shoulder+bag+women',flipkart:'https://www.flipkart.com/search?q=yellow+shoulder+bag+women'},
  ],
  neutral:[
    {item:'White Linen Shirt',category:'Tops',priceRange:'₹800–2,000',why:'A crisp white shirt is the ultimate wardrobe foundation',styleTip:'Tuck half into high-waisted trousers for effortless smart look',amazon:'https://www.amazon.in/s?k=white+linen+shirt+women',flipkart:'https://www.flipkart.com/search?q=white+linen+shirt+women'},
    {item:'Black Slim Trousers',category:'Bottoms',priceRange:'₹1,200–3,500',why:'Versatile black trousers anchor any outfit and work day to night',styleTip:'Roll the hem one fold for a modern relaxed silhouette',amazon:'https://www.amazon.in/s?k=black+slim+trousers+women+formal',flipkart:'https://www.flipkart.com/search?q=black+slim+fit+trousers+women'},
    {item:'Camel Trench Coat',category:'Outerwear',priceRange:'₹3,500–9,000',why:'A trench coat is the single most timeless outerwear you can own',styleTip:'Belt at the waist to create a defined elegant silhouette',amazon:'https://www.amazon.in/s?k=camel+trench+coat+women',flipkart:'https://www.flipkart.com/search?q=camel+trench+coat+women'},
    {item:'White Leather Sneakers',category:'Footwear',priceRange:'₹1,500–5,000',why:'Clean white sneakers work with virtually every style',styleTip:'Keep them clean — scuffed white sneakers undermine the look',amazon:'https://www.amazon.in/s?k=white+leather+sneakers+women',flipkart:'https://www.flipkart.com/search?q=white+sneakers+women'},
    {item:'Stone Knit Tank',category:'Tops',priceRange:'₹700–1,800',why:'A stone knit tank is a versatile base layer for blazers, shirts and skirts',styleTip:'Use it under a tonal beige outfit for quiet-luxury energy',amazon:'https://www.amazon.in/s?k=beige+knit+tank+women',flipkart:'https://www.flipkart.com/search?q=beige+knit+top+women'},
    {item:'Greige Wide-Leg Trousers',category:'Bottoms',priceRange:'₹1,500–4,200',why:'Greige trousers soften black-and-white wardrobes and feel more elevated than denim',styleTip:'Pair with a fitted white tee and gold hoops',amazon:'https://www.amazon.in/s?k=greige+wide+leg+trousers+women',flipkart:'https://www.flipkart.com/search?q=beige+wide+leg+trousers+women'},
  ],
};

const COMBO_DB={
  office:[
    {name:'The Power Edit',    pieces:['Tailored Blazer','Straight-leg Trousers','Silk Blouse','Block-heel Pumps'],vibe:'Authoritative & Polished',occasion:'Boardroom / Client Meetings'},
    {name:'Smart Minimal',     pieces:['White Shirt','Dark Trousers','Leather Loafers','Structured Tote'],vibe:'Clean & Confident',occasion:'Everyday Office'},
    {name:'Feminine Corporate',pieces:['Wrap Dress','Court Heels','Gold Chain Necklace','Minimal Watch'],vibe:'Professional & Graceful',occasion:'Important Presentations'},
    {name:'Modern Waistcoat',pieces:['Matching Waistcoat','Wide-leg Trousers','Pointed Flats','Structured Shoulder Bag'],vibe:'Tailored & Current',occasion:'Creative Office / Meetings'},
    {name:'Monochrome Boardroom',pieces:['Ivory Blouse','Charcoal Trousers','Single-breasted Blazer','Leather Pumps'],vibe:'Sharp & Elevated',occasion:'Senior Leadership Meetings'},
  ],
  casual:[
    {name:'Weekend Ease',      pieces:['Linen Tee','Straight-cut Jeans','White Sneakers','Canvas Tote'],vibe:'Relaxed & Effortless',occasion:'Weekend Errands / Markets'},
    {name:'Coffee Shop Chic',  pieces:['Oversized Shirt','Bike Shorts','Chunky Sneakers','Mini Bag'],vibe:'Cool & Casual',occasion:'Brunch / Coffee Dates'},
    {name:'Soft Day Out',      pieces:['Flowy Midi Skirt','Fitted Tank','Flat Sandals','Straw Hat'],vibe:'Breezy & Feminine',occasion:'Afternoon Out'},
    {name:'Utility Off-Duty',pieces:['Cargo Pants','Ribbed Tank','Overshirt','Retro Trainers'],vibe:'Laid-back & Contemporary',occasion:'Travel / Day Out'},
    {name:'Denim Balance',pieces:['Denim Shirt','White Tank','Ecru Trousers','Leather Slides'],vibe:'Clean & Easy',occasion:'Casual Lunch'},
  ],
  evening:[
    {name:'Night Out Edit',    pieces:['Satin Slip Dress','Strappy Heels','Clutch Bag','Statement Earrings'],vibe:'Sultry & Sophisticated',occasion:'Dinner / Night Out'},
    {name:'Party Ready',       pieces:['Sequin Top','Wide-leg Trousers','Block Heels','Mini Bag'],vibe:'Festive & Fun',occasion:'Parties / Events'},
    {name:'Elevated Casual',   pieces:['Blazer','Cami Top','Straight Jeans','Pointed-toe Flats'],vibe:'Smart & Stylish',occasion:'Casual Dinner Date'},
    {name:'Liquid Metal',pieces:['Metallic Midi Dress','Minimal Sandals','Cuff Bracelet','Micro Bag'],vibe:'Sleek & Luminous',occasion:'Cocktail Evening'},
    {name:'Dark Romance',pieces:['Off-shoulder Top','Satin Skirt','Heeled Mules','Drop Earrings'],vibe:'Romantic & Refined',occasion:'Date Night'},
  ],
  festival:[
    {name:'Boho Goddess',      pieces:['Embroidered Kurta','Palazzo Pants','Kolhapuri Chappals','Jhumkas'],vibe:'Ethnic-modern Fusion',occasion:'Festivals / Pujas'},
    {name:'Indo-Western',      pieces:['Crop Top','High-waist Dhoti Pants','Heeled Sandals','Statement Necklace'],vibe:'Contemporary Indian',occasion:'Engagement / Mehendi'},
    {name:'Modern Saree',      pieces:['Pre-draped Saree','Fitted Blouse','Block-heel Sandals','Potli Bag'],vibe:'Traditional & Elegant',occasion:'Formal Functions / Weddings'},
    {name:'Handloom Heritage',pieces:['Woven Saree','Temple Jewellery','Classic Blouse','Leather Flats'],vibe:'Timeless & Cultural',occasion:'Festive Lunch / Family Events'},
    {name:'Mirrorwork Moment',pieces:['Mirrorwork Kurta Set','Embellished Juttis','Stacked Bangles','Mini Potli'],vibe:'Bright & Celebratory',occasion:'Festive Evening'},
  ],
};

const GENDER_COMBO_DB = {
  women: {
    fair: [
      {name:'Cool Pastel Tailoring', pieces:['Powder blue blazer','Soft white tank','Grey trousers','Silver flats'], vibe:'Fresh and polished', occasion:'Day events', colors:['Powder Blue','Soft White','Cool Grey'], whyMatch:'Cool pastels and silver-toned styling brighten fair skin without overpowering it.'},
      {name:'Berry Evening Edit', pieces:['Berry slip dress','White blazer','Silver jewellery','Nude heels'], vibe:'Elegant and sharp', occasion:'Dinner / Evening', colors:['Berry','White','Silver'], whyMatch:'Berry tones add definition and contrast beautifully against fair complexions.'},
    ],
    light: [
      {name:'Peach City Set', pieces:['Peach blouse','Camel trousers','Cream bag','Gold sandals'], vibe:'Warm and feminine', occasion:'Brunch / Office', colors:['Peach','Camel','Cream'], whyMatch:'Warm peach and camel tones echo the natural warmth in light beige skin.'},
      {name:'Mint Summer Combo', pieces:['Mint dress','Warm ivory layer','Rose-gold hoops','Tan sandals'], vibe:'Soft and bright', occasion:'Summer day out', colors:['Mint','Warm Ivory','Tan'], whyMatch:'Mint adds freshness while warm ivory keeps the palette flattering and light.'},
    ],
    medium: [
      {name:'Terracotta Power Look', pieces:['Terracotta blazer','Ivory top','Olive trousers','Gold hoops'], vibe:'Grounded and elevated', occasion:'Work / Events', colors:['Terracotta','Ivory','Olive'], whyMatch:'Earth tones and olive-based depth are especially strong on golden olive skin.'},
      {name:'Teal Dinner Combo', pieces:['Teal satin top','Chocolate trousers','Bronze accessories','Block heels'], vibe:'Rich and confident', occasion:'Dinner', colors:['Teal','Chocolate','Bronze'], whyMatch:'Teal brings contrast while brown and bronze keep the palette naturally harmonious.'},
    ],
    tan: [
      {name:'Cobalt Contrast Set', pieces:['Cobalt shirt','Ivory trousers','Gold earrings','Tan heels'], vibe:'Bold and clean', occasion:'Party / Day event', colors:['Cobalt','Ivory','Gold'], whyMatch:'Cobalt and ivory create the kind of high contrast that makes tan skin glow.'},
      {name:'Coral Weekend Combo', pieces:['Bright coral dress','White flats','Structured mini bag','Gold bangles'], vibe:'Vibrant and easy', occasion:'Weekend / Travel', colors:['Coral','White','Gold'], whyMatch:'Coral and crisp white are especially flattering on warm caramel skin.'},
    ],
    deep: [
      {name:'Jewel Tone Statement', pieces:['Emerald blouse','Bright white trousers','Gold cuff','Heeled sandals'], vibe:'Luxe and powerful', occasion:'Events / Dinner', colors:['Emerald','Bright White','Gold'], whyMatch:'Deep skin carries vivid jewel tones and bright white with exceptional clarity.'},
      {name:'Hot Pink Night Look', pieces:['Hot pink dress','Cobalt bag','Minimal heels','Gold hoops'], vibe:'Playful and striking', occasion:'Night out', colors:['Hot Pink','Cobalt','Gold'], whyMatch:'High-energy shades create strong, flattering contrast on rich brown skin.'},
    ],
    dark: [
      {name:'Pure White Contrast', pieces:['White shirt dress','Gold belt','Camel heels','Structured tote'], vibe:'Clean and regal', occasion:'All-day wear', colors:['Pure White','Camel','Gold'], whyMatch:'Pure white is one of the strongest contrast tools for deep ebony skin.'},
      {name:'Turquoise Spotlight', pieces:['Turquoise top','Ivory trousers','Gold earrings','Strappy sandals'], vibe:'Bright and modern', occasion:'Day event', colors:['Turquoise','Ivory','Gold'], whyMatch:'Turquoise and ivory add brightness without dulling deep skin tones.'},
    ],
  },
  men: {
    fair: [
      {name:'Navy Minimal Tailoring', pieces:['Navy blazer','Soft white tee','Grey trousers','White sneakers'], vibe:'Clean and structured', occasion:'Smart casual', colors:['Navy','White','Grey'], whyMatch:'Navy and cool neutrals create crisp definition for fair skin.'},
      {name:'Sage Weekend Look', pieces:['Sage overshirt','White tee','Charcoal jeans','Silver watch'], vibe:'Relaxed and sharp', occasion:'Weekend', colors:['Sage','White','Charcoal'], whyMatch:'Muted cool greens are flattering without washing out lighter skin.'},
    ],
    light: [
      {name:'Camel Polo Combo', pieces:['Camel polo','Cream chinos','Brown loafers','Gold-toned watch'], vibe:'Warm and refined', occasion:'Day out', colors:['Camel','Cream','Brown'], whyMatch:'Camel and cream work naturally with warm-beige undertones.'},
      {name:'Coral Summer Set', pieces:['Coral shirt','Stone trousers','Tan loafers','Minimal sunglasses'], vibe:'Fresh and modern', occasion:'Vacation / Summer', colors:['Coral','Stone','Tan'], whyMatch:'Coral adds healthy warmth without feeling too strong.'},
    ],
    medium: [
      {name:'Olive Utility Combo', pieces:['Olive overshirt','Ecru tee','Brown cargos','White sneakers'], vibe:'Current and effortless', occasion:'Travel / Casual', colors:['Olive','Ecru','Brown'], whyMatch:'Olive and brown play especially well with golden olive complexions.'},
      {name:'Teal Evening Shirt', pieces:['Teal shirt','Dark trousers','Brown loafers','Bronze watch'], vibe:'Confident and rich', occasion:'Dinner', colors:['Teal','Brown','Bronze'], whyMatch:'Teal creates contrast while bronze accessories deepen the overall harmony.'},
    ],
    tan: [
      {name:'Cobalt Shirt Formula', pieces:['Cobalt shirt','Ivory trousers','White sneakers','Gold watch'], vibe:'Strong and clean', occasion:'Parties / Smart casual', colors:['Cobalt','Ivory','Gold'], whyMatch:'Cobalt and ivory give tan skin the bold contrast it handles best.'},
      {name:'Emerald Resort Combo', pieces:['Emerald knit polo','Stone trousers','Tan loafers','Minimal bracelet'], vibe:'Luxe and easy', occasion:'Summer evenings', colors:['Emerald','Stone','Tan'], whyMatch:'Saturated jewel tones make warm caramel skin look brighter.'},
    ],
    deep: [
      {name:'White and Emerald Tailoring', pieces:['White shirt','Emerald overshirt','Black trousers','Gold watch'], vibe:'High contrast and elevated', occasion:'Smart evening', colors:['White','Emerald','Gold'], whyMatch:'Deep skin thrives with crisp contrast and vivid jewel shades.'},
      {name:'Royal Blue Night Combo', pieces:['Royal blue shirt','Charcoal trousers','Black loafers','Minimal chain'], vibe:'Bold and sleek', occasion:'Night out', colors:['Royal Blue','Charcoal','Black'], whyMatch:'Royal blue brings striking contrast against rich brown skin.'},
    ],
    dark: [
      {name:'White Signature Combo', pieces:['Pure white shirt','Camel trousers','Gold watch','Brown loafers'], vibe:'Regal and clean', occasion:'Day events', colors:['Pure White','Camel','Gold'], whyMatch:'Pure white and camel create the strong contrast that suits dark skin best.'},
      {name:'Turquoise Resort Fit', pieces:['Turquoise shirt','Ivory trousers','Leather sandals','Gold bracelet'], vibe:'Bright and premium', occasion:'Holiday / Summer', colors:['Turquoise','Ivory','Gold'], whyMatch:'Bright turquoise adds energy and keeps the complexion visually lifted.'},
    ],
  },
};

const DOS_DONTS={
  fair:{dos:['Wear jewel tones for drama','Choose cool pastels daily','Layer silver jewellery','Try navy — incredibly flattering'],donts:['Avoid orange near your face','Skip warm browns in tops','Avoid overly warm colour combos']},
  light:{dos:['Embrace warm peachy tones','Gold jewellery is your best friend','Warm camel and nude are perfect bases','Coral shades complement beautifully'],donts:['Avoid stark white — try warm ivory','Skip cool grey — choose warm beige','Avoid neons that wash you out']},
  medium:{dos:['Earth tones create gorgeous harmony','Jewel tones provide beautiful contrast','Bronze and copper enhance your glow','Deep greens and teals complement perfectly'],donts:['Avoid icy pastels competing with warmth','Skip cool lavender and baby pink','Avoid very pale colours that look dull']},
  tan:{dos:['Bright saturated colours pop beautifully','White and ivory are most striking neutrals','Cobalt blue looks phenomenal on you','Bold prints were made for your colouring'],donts:['Avoid colours too close to your skin tone','Skip dusty pinks and nude beiges','Avoid very muted greyed-out tones']},
  deep:{dos:['Vivid jewel tones are your power colours','Pure white creates a stunning contrast','Bright accents in accessories add energy','Rich saturated fabrics celebrate your skin'],donts:['Avoid dark colours that reduce contrast','Skip dusty muted colour versions','Avoid very dark brown near your face']},
  dark:{dos:['High-contrast looks are your signature','Pure white and brights make you radiate','Gold jewellery creates a regal glow','Canary yellow and turquoise are stunning'],donts:['Avoid head-to-toe very dark looks','Skip muddy brown tones','Avoid colours too close to your undertone']},
};

DOS_DONTS.porcelain = { dos:['Choose cool rose and blue-based pastels','Use silver jewellery to sharpen your palette','Keep contrast soft but defined','Lean on dove grey and soft white'], donts:['Avoid earthy mustard near the face','Skip murky olive tones','Avoid harsh warm rust shades'] };
DOS_DONTS.light_medium = { dos:['Build around apricot, cream, and muted teal','Use antique gold hardware','Keep prints soft and tonal','Choose warm taupe instead of cold grey'], donts:['Avoid icy lilac close to your face','Skip neon accents','Avoid very blue greys in tops'] };
DOS_DONTS.olive = { dos:['Wear petrol, forest, and aubergine confidently','Use mixed metals when styling','Anchor looks with warm ivory','Choose depth over brightness'], donts:['Avoid ashy beige near your face','Skip pastel mint','Avoid overly cool pale lavender'] };
DOS_DONTS.rich = { dos:['Use jewel tones with clear contrast','Choose ivory instead of dusty beige','Let gold and copper accessories lead','Try strong saturated accents'], donts:['Avoid muddy khaki near your face','Skip washed-out olives','Avoid overly dusty browns'] };
DOS_DONTS.ebony = { ...DOS_DONTS.dark, dos:['Build high-contrast looks with white and cobalt','Use bright turquoise and gold confidently','Keep prints crisp and intentional','Try clean ivory for daywear'], donts:['Avoid head-to-toe very dark looks','Skip muddy brown tones','Avoid flat low-contrast palettes'] };

function buildRetailerLinks(item){
  const query = encodeURIComponent(String(item.item || '').trim().replace(/\s+/g, ' '));
  const links = [
    { name: 'Amazon', url: item.amazon || `https://www.amazon.in/s?k=${query}` },
    { name: 'Flipkart', url: item.flipkart || `https://www.flipkart.com/search?q=${query}` },
    { name: 'Myntra', url: `https://www.myntra.com/${query}` },
    { name: 'AJIO', url: `https://www.ajio.com/search/?text=${query}` },
    { name: 'Nykaa Fashion', url: `https://www.nykaafashion.com/catalogsearch/result/?q=${query}` },
    { name: 'Tata CLiQ', url: `https://www.tatacliq.com/search/?searchCategory=all&text=${query}` },
  ];

  return links.filter((link, index, arr) =>
    link.url && arr.findIndex(other => other.url === link.url) === index
  );
}

/* ── Helper functions ──────────────────────────────────────────────────── */
function hasSimilarFamily(c){const f=c.map(getColorFamily);return new Set(f).size<=2;}
function hasNeutral(c){return c.some(x=>['White / Ivory','Black / Charcoal','Grey','Beige / Cream','Camel / Tan','Navy Blue'].includes(x));}
function hasBright(c){return c.some(x=>['Red','Orange','Yellow','Pink','Purple / Violet','Sky Blue','Teal / Turquoise'].includes(x));}
function hasEarthy(c){return c.some(x=>['Terracotta','Brown / Chocolate','Olive Green','Mustard','Camel / Tan'].includes(x));}
function hasClassic(c){return c.some(x=>['Black / Charcoal','Navy Blue','White / Ivory','Grey'].includes(x));}
function hasPastel(c){return c.some(x=>['Lavender','Blush','Sky Blue','Beige / Cream'].includes(x));}
function getColorFamily(c){
  if(['Red','Pink','Blush','Burgundy / Wine'].includes(c))return'warm-red';
  if(['Blue','Navy Blue','Sky Blue','Denim Blue'].includes(c))return'blue';
  if(['Green','Olive Green','Teal / Turquoise'].includes(c))return'green';
  if(['Orange','Terracotta','Brown / Chocolate','Mustard','Camel / Tan'].includes(c))return'earth';
  if(['White / Ivory','Grey','Black / Charcoal','Beige / Cream'].includes(c))return'neutral';
  return'other';
}

function resolveComboSkinTone(skinTone) {
  const map = {
    porcelain: 'fair',
    light_medium: 'light',
    olive: 'medium',
    rich: 'deep',
    ebony: 'dark',
  };
  return map[skinTone] || skinTone;
}

function buildBestComboMatches(skinTone, gender, detectedColors){
  const genderKey = gender === 'men' ? 'men' : 'women';
  const resolvedSkin = resolveComboSkinTone(skinTone);
  const combos = GENDER_COMBO_DB[genderKey][resolvedSkin] || GENDER_COMBO_DB[genderKey].medium || [];
  return combos
    .map(combo => ({
      ...combo,
      matchScore: combo.colors.reduce((score, color) => {
        const found = detectedColors.some(det => det.toLowerCase().includes(color.split(' ')[0].toLowerCase()));
        return score + (found ? 24 : 8);
      }, 28),
    }))
    .sort((a,b) => b.matchScore - a.matchScore)
    .slice(0,3);
}

/* ── Image colour extraction ───────────────────────────────────────────── */
async function extractColors(buffer){
  try{
    const img=await Jimp.read(buffer);
    img.resize(80,80);
    const map={};
    for(let y=0;y<img.getHeight();y++){
      for(let x=0;x<img.getWidth();x++){
        const hex=img.getPixelColor(x,y);
        const {r,g,b,a}=Jimp.intToRGBA(hex);
        if(a<50)continue;
        const k=`${Math.round(r/32)*32},${Math.round(g/32)*32},${Math.round(b/32)*32}`;
        map[k]=(map[k]||0)+1;
      }
    }
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k])=>{const[r,g,b]=k.split(',').map(Number);return{r,g,b};});
  }catch{
    return[{r:200,g:190,b:180},{r:50,g:50,b:50},{r:180,g:160,b:140}];
  }
}

/* ── Scoring ────────────────────────────────────────────────────────────── */
function scoreOutfit(colors,skin){
  const s=SKIN_DATA[skin];
  let score=55;
  const u=[...new Set(colors)];
  const matches=u.filter(c=>s.bestColors.some(b=>c.toLowerCase().includes(b.split(' ')[0].toLowerCase())));
  score+=matches.length*20;
  const avoids=u.filter(c=>s.avoidColors.some(a=>c.toLowerCase().includes(a.split(' ')[0].toLowerCase())));
  score-=avoids.length*12;
  for(const[a,b]of GOOD_PAIRS)if(u.includes(a)&&u.includes(b))score+=18;
  for(const[a,b]of BAD_PAIRS)if(u.includes(a)&&u.includes(b))score-=15;
  if(hasNeutral(u))score+=10;
  if(u.length>5)score+=(u.length-5)*(-8);
  return Math.max(10,Math.min(98,Math.round(score)));
}

/* ── Main analyse ───────────────────────────────────────────────────────── */
async function analyse(buffer,skinTone,gender='women'){
  const skin=SKIN_DATA[skinTone]||SKIN_DATA.medium;
  const pixels=await extractColors(buffer);
  const colorNames=pixels.map(({r,g,b})=>{for(const c of COLOR_CATEGORIES)if(c.test(r,g,b))return c.name;return'Mixed Tone';});
  const unique=[...new Set(colorNames)].slice(0,5);
  const hexColors=pixels.slice(0,5).map(({r,g,b})=>'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join(''));

  let styleObj=STYLE_RULES[STYLE_RULES.length-1];
  for(const r of STYLE_RULES)if(r.check(unique)){styleObj=r;break;}

  const score=scoreOutfit(unique,skinTone);
  const hasGoodPair=GOOD_PAIRS.some(([a,b])=>unique.includes(a)&&unique.includes(b));

  const feedbacks=[
    score>=80&&`This is an excellent colour combination — the ${unique[0]||'chosen'} and ${unique[1]||'complementary'} tones work in beautiful harmony.`,
    hasGoodPair&&`The colour pairing here is well-considered. To elevate further, ensure proportions are balanced between top and bottom.`,
    hasNeutral(unique)&&`Using ${unique.find(c=>hasNeutral([c]))||'neutral'} as a base is a smart styling move — it makes mixing other pieces effortless.`,
    hasEarthy(unique)&&`The earthy palette is on-trend and deeply flattering for ${skin.undertone} undertones. Earth tones create natural warm harmony.`,
    hasBright(unique)&&`The bold colour choice shows confidence. Keep the fit clean and accessories minimal to balance the vibrancy.`,
    score<65&&`Consider anchoring with a neutral piece — it will bring visual cohesion. ${skin.bestColors[0]} or ${skin.bestColors[1]} would be beautiful for your skin tone.`,
    `${skin.tips[0]}.`,
  ].filter(Boolean);

  const strengths=[];
  if(hasNeutral(unique))strengths.push('Strong neutral base gives the outfit versatility');
  if(hasGoodPair)strengths.push('Excellent colour pairing creates visual harmony');
  if(score>=75)strengths.push('Colour palette shows sophisticated taste');
  if(hasEarthy(unique))strengths.push('On-trend earth tones feel current and grounded');
  if(hasBright(unique))strengths.push('Bold colour choice commands attention');
  if(strengths.length===0)strengths.push('Clean, clear colour palette');

  const improvements=[];
  const clashes=BAD_PAIRS.filter(([a,b])=>unique.includes(a)&&unique.includes(b));
  if(clashes.length)improvements.push(`${clashes[0][0]} and ${clashes[0][1]} can clash — try swapping one for a neutral`);
  if(unique.length>4)improvements.push('Simplify to 3 colours max for a more polished result');
  if(!hasNeutral(unique))improvements.push(`Add a neutral piece in ${skin.neutrals[0]} to ground the look`);
  if(improvements.length===0)improvements.push(`Experiment with ${skin.bestColors[0]} — it would work beautifully`);

  let shopKey='neutral';
  if(hasEarthy(unique))shopKey='earthy';
  else if(hasBright(unique))shopKey='bold';
  else if(hasPastel(unique))shopKey='pastel';
  else if(hasClassic(unique))shopKey='classic';
  const shoppingItems=[...(SHOPPING_DB[shopKey]||SHOPPING_DB.neutral)].sort(()=>Math.random()-.5).slice(0,4);

  const occasionLower=styleObj.occasions.join(' ').toLowerCase();
  let comboKeys=['casual'];
  if(occasionLower.includes('office')||occasionLower.includes('business'))comboKeys=['office','evening'];
  else if(occasionLower.includes('party')||occasionLower.includes('night'))comboKeys=['evening','casual'];
  else if(occasionLower.includes('festival'))comboKeys=['festival','casual'];
  const allCombos=comboKeys.flatMap(k=>COMBO_DB[k]||[]);
  const seen=new Set();
  const combos=allCombos.filter(c=>{if(seen.has(c.name))return false;seen.add(c.name);return true;}).slice(0,3);
  const bestMatches = buildBestComboMatches(skinTone, gender, unique);
  const audienceLabel = gender === 'men' ? 'men' : 'women';

  return{
    outfit_analysis:{description:`Your outfit features a ${styleObj.category.toLowerCase()} palette built around ${unique.slice(0,2).join(' and ').toLowerCase()} tones${unique.length>2?`, accented with ${unique.slice(2,4).join(' and ').toLowerCase()}`:''}. This creates a ${score>=75?'harmonious and well-balanced':'casual and relaxed'} overall look for ${audienceLabel}.`,style_category:styleObj.category,occasion:styleObj.occasions[0],season:hasEarthy(unique)?'Autumn / Winter':hasPastel(unique)?'Spring / Summer':'All Season',score,feedback:feedbacks[0]||skin.tips[0],strengths:strengths.slice(0,3),improvements:improvements.slice(0,2),detected_colors:unique},
    skin_palette:{summary:`With ${skin.undertone} undertones, you have the ${skin.seasonPalette} complexion type. ${skin.tips[0]}.`,best_colors:skin.bestColors,avoid_colors:skin.avoidColors,hex_palette:skin.hexPalette,season_palette:skin.seasonPalette,metals:skin.metals,neutrals:skin.neutrals},
    shopping_picks:{intro:`Based on your ${styleObj.category.toLowerCase()} colour story and ${skin.name} skin tone, here are the pieces that will elevate your wardrobe:`,items:shoppingItems.map(i=>({item:i.item,category:i.category,why:i.why,price_range:i.priceRange,style_tip:i.styleTip,amazon:i.amazon,flipkart:i.flipkart,retailers:buildRetailerLinks(i)}))},
    combo_suggestions:{intro:`Three complete outfit formulas curated for your colouring and lifestyle:`,combos:combos.map(c=>({name:c.name,pieces:c.pieces,vibe:c.vibe,occasion:c.occasion}))},
    best_combo_matches:{intro:`Best ${audienceLabel} combos for your ${skin.name} skin tone:`,combos:bestMatches.map(c=>({name:c.name,pieces:c.pieces,vibe:c.vibe,occasion:c.occasion,colors:c.colors,why_match:c.whyMatch,match_score:c.matchScore}))},
    style_dos_donts:{dos:(DOS_DONTS[skinTone]||DOS_DONTS.medium).dos,donts:(DOS_DONTS[skinTone]||DOS_DONTS.medium).donts},
  };
}

module.exports={analyse,SKIN_DATA,SHOPPING_DB,COMBO_DB,GENDER_COMBO_DB,buildRetailerLinks};
