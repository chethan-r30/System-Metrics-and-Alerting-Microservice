/**
 * Log Model
 * Stores parsed log entries
 */
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'system'
  },
  metadata: {
    type: Map,
    of: String
  }
});

logSchema.index({ level: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
