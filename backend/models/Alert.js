/**
 * Alert Model
 * Stores generated alerts when thresholds are breached
 */
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CPU', 'MEMORY'],
    required: true
  },
  severity: {
    type: String,
    enum: ['WARNING', 'CRITICAL'],
    default: 'WARNING'
  },
  message: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  }
});

// Index for efficient querying
alertSchema.index({ type: 1, timestamp: -1 });
alertSchema.index({ resolved: 1 });

module.exports = mongoose.model('Alert', alertSchema);
