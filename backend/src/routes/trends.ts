import { Router } from 'express';
import { getAllTrends, getWomenTrends, getMenTrends, getStaticTrends } from '../controllers/trendsController';

const router = Router();

router.get('/', getAllTrends);
router.get('/women', getWomenTrends);
router.get('/men', getMenTrends);
router.get('/static', getStaticTrends);

export default router;
