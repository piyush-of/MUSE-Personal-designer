'use strict';
/**
 * backend/engine/colorDetector.js
 * Pixel-level image color extraction and scoring
 */

const Jimp = require('jimp');

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

async function extractColors(buffer) {
  try {
    const img = await Jimp.read(buffer);
    // Resize for performance
    img.resize(80, 80);
    const map = {};
    for (let y = 0; y < img.getHeight(); y++) {
      for (let x = 0; x < img.getWidth(); x++) {
        const hex = img.getPixelColor(x, y);
        const { r, g, b, a } = Jimp.intToRGBA(hex);
        if (a < 50) continue;
        const k = `${Math.round(r/32)*32},${Math.round(g/32)*32},${Math.round(b/32)*32}`;
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
    return [{ r:200, g:190, b:180 }, { r:50, g:50, b:50 }, { r:180, g:160, b:140 }];
  }
}

function pixelToColorName(r, g, b) {
  for (const c of COLOR_CATEGORIES) {
    if (c.test(r, g, b)) return c.name;
  }
  return 'Mixed Tone';
}

function getColorFamily(c) {
  if (['Red','Pink','Blush','Burgundy / Wine'].includes(c)) return 'warm-red';
  if (['Blue','Navy Blue','Sky Blue','Denim Blue'].includes(c)) return 'blue';
  if (['Green','Olive Green','Teal / Turquoise'].includes(c)) return 'green';
  if (['Orange','Terracotta','Brown / Chocolate','Mustard','Camel / Tan'].includes(c)) return 'earth';
  if (['White / Ivory','Grey','Black / Charcoal','Beige / Cream'].includes(c)) return 'neutral';
  return 'other';
}

function hasSimilarFamily(c) { const f = c.map(getColorFamily); return new Set(f).size <= 2; }
function hasNeutral(c) { return c.some(x => ['White / Ivory','Black / Charcoal','Grey','Beige / Cream','Camel / Tan','Navy Blue'].includes(x)); }
function hasBright(c)  { return c.some(x => ['Red','Orange','Yellow','Pink','Purple / Violet','Sky Blue','Teal / Turquoise'].includes(x)); }
function hasEarthy(c)  { return c.some(x => ['Terracotta','Brown / Chocolate','Olive Green','Mustard','Camel / Tan'].includes(x)); }
function hasClassic(c) { return c.some(x => ['Black / Charcoal','Navy Blue','White / Ivory','Grey'].includes(x)); }
function hasPastel(c)  { return c.some(x => ['Lavender','Blush','Sky Blue','Beige / Cream'].includes(x)); }

module.exports = {
  COLOR_CATEGORIES,
  extractColors,
  pixelToColorName,
  getColorFamily,
  hasSimilarFamily, hasNeutral, hasBright, hasEarthy, hasClassic, hasPastel,
};
