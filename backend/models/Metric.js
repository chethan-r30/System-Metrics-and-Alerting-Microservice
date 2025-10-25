/**
 * Metric Model
 * Stores system resource metrics (CPU, Memory)
 */
const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CPU', 'MEMORY'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    totalMemory: Number,
    usedMemory: Number,
    freeMemory: Number,
    cpuModel: String,
    cores: Number
  }
});

// Index for efficient time-based queries
metricSchema.index({ type: 1, timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);
