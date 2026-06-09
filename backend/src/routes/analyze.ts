import { Router } from 'express';
import multer from 'multer';
import { config } from '../config';
import { validateAnalyze } from '../middleware/validate';
import { checkAnalysisQuota } from '../middleware/auth';
import { analyzeLimiter } from '../middleware/rateLimiter';
import { analyzeOutfit } from '../controllers/analyzeController';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxBytes },
  fileFilter(_req, file, cb) {
    if (config.upload.allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(Object.assign(new Error(`Unsupported type: ${file.mimetype}`), { status: 415 }));
    }
  },
});

router.post('/', analyzeLimiter, upload.single('image'), validateAnalyze, checkAnalysisQuota, analyzeOutfit);

export default router;
