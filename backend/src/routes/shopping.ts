import { Router } from 'express';
import { getShopping } from '../controllers/shoppingController';

const router = Router();

router.get('/', getShopping);

export default router;
