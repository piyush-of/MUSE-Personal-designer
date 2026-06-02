'use strict';

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  skinTone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['women', 'men'],
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  styleCategory: String,
  detectedColors: [String],
  aiProvider: {
    type: String,
    enum: ['gemini', 'groq', 'fallback', 'none'],
    default: 'none',
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  imageHash: String, // sha256 of image for dedup
}, { timestamps: true });

// Index for user's wardrobe view
analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
