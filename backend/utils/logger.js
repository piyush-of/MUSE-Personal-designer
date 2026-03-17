'use strict';
const C={error:'\x1b[31m',warn:'\x1b[33m',info:'\x1b[36m',debug:'\x1b[90m',reset:'\x1b[0m'};
const log=(l,...a)=>console[l==='error'?'error':'log'](`${C[l]||''}[${new Date().toISOString()}][${l.toUpperCase()}]${C.reset}`,...a);
module.exports={error:(...a)=>log('error',...a),warn:(...a)=>log('warn',...a),info:(...a)=>log('info',...a),debug:(...a)=>log('debug',...a),http:(...a)=>log('debug',...a)};
