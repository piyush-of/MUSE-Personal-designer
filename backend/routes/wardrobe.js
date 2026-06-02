'use strict';

const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
  getWardrobe,
  getWardrobeItem,
  deleteWardrobeItem
} = require('../controllers/wardrobeController');

// All wardrobe routes require authentication
router.use(requireAuth);

router.get('/', getWardrobe);
router.get('/:id', getWardrobeItem);
router.delete('/:id', deleteWardrobeItem);

module.exports = router;
