'use strict';
const logger = require('../utils/logger');
const config = require('../../config');
// eslint-disable-next-line no-unused-vars
module.exports = (err,req,res,next) => {
  const s = err.status||err.statusCode||500;
  logger.error(`${req.method} ${req.path} → ${s}: ${err.message}`);
  if(err.code==='LIMIT_FILE_SIZE') return res.status(413).json({success:false,error:'File too large. Max 10MB.'});
  res.status(s).json({success:false,error:s<500||config.isDev?err.message:'Unexpected error. Please try again.'});
};
