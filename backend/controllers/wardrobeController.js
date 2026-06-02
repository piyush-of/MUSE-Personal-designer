'use strict';

const Analysis = require('../models/Analysis');
const logger = require('../utils/logger');

// Get all saved analyses for user
async function getWardrobe(req, res, next) {
  try {
    const userId = req.user.id;
    // Find all analyses for user, sorted by most recent
    const items = await Analysis.find({ userId })
      .select('skinTone gender score styleCategory detectedColors aiProvider createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    logger.error('Error fetching wardrobe:', err.message);
    next(err);
  }
}

// Get specific analysis details
async function getWardrobeItem(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Analysis.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found in your wardrobe.'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    logger.error('Error fetching wardrobe item:', err.message);
    next(err);
  }
}

// Delete an analysis from wardrobe
async function deleteWardrobeItem(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Analysis.findOneAndDelete({ _id: id, userId });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found or unauthorized.'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted from wardrobe.'
    });
  } catch (err) {
    logger.error('Error deleting wardrobe item:', err.message);
    next(err);
  }
}

module.exports = {
  getWardrobe,
  getWardrobeItem,
  deleteWardrobeItem
};
