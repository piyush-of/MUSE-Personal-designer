'use strict';
const VALID = new Set(['porcelain','fair','light','light_medium','medium','olive','tan','deep','rich','ebony']);
const VALID_GENDERS = new Set(['women','men']);
module.exports = (req,res,next) => {
  const errs=[];
  if(!req.file) errs.push('Image required (field: image).');
  const s=(req.body.skinTone||'').trim().toLowerCase();
  const g=(req.body.gender||'women').trim().toLowerCase();
  if(!s) errs.push('skinTone required.');
  else if(!VALID.has(s)) errs.push(`Invalid skinTone. Use: ${[...VALID].join(', ')}`);
  else req.body.skinTone=s;
  if(!VALID_GENDERS.has(g)) errs.push(`Invalid gender. Use: ${[...VALID_GENDERS].join(', ')}`);
  else req.body.gender=g;
  if(errs.length) return res.status(400).json({success:false,errors:errs});
  next();
};
