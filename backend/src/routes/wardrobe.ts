import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getWardrobe,
  getWardrobeItem,
  deleteWardrobeItem
} from '../controllers/wardrobeController';

const router = Router();

router.use(requireAuth);

router.get('/', getWardrobe);
router.get('/:id', getWardrobeItem);
router.delete('/:id', deleteWardrobeItem);

export default router;
