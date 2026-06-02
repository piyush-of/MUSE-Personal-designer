'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [60, 'Name cannot exceed 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // never returned by default
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member',
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  analysesUsed: {
    type: Number,
    default: 0,
  },
  analysesLimit: {
    type: Number,
    default: 10, // free tier: 10/month
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: Date,
  refreshTokens: [String], // store hashed refresh tokens
  lastLoginAt: Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Brute force check
userSchema.methods.isLocked = function () {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

// Increment login attempts + lock after 5
userSchema.methods.incLoginAttempts = async function () {
  // Reset if lock expired
  if (this.lockedUntil && this.lockedUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockedUntil = undefined;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5 && !this.isLocked()) {
      this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    }
  }
  return this.save({ validateBeforeSave: false });
};

// Safe public profile
userSchema.methods.toProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    plan: this.plan,
    analysesUsed: this.analysesUsed,
    analysesLimit: this.analysesLimit,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
