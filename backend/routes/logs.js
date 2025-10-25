/**
 * Log Routes
 * Phase 1: Log analysis endpoints
 */
const express = require('express');
const router = express.Router();
const logAnalyzer = require('../services/logAnalyzer');
const auth = require('../middleware/auth');

/**
 * POST /api/logs/analyze
 * Analyze log file
 */
router.post('/analyze', auth, async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const analysis = await logAnalyzer.analyzeLogFile(filePath);
    
    res.json({
      message: 'Log analysis completed',
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/logs/statistics
 * Get log statistics from database
 */
router.get('/statistics', auth, async (req, res) => {
  try {
    const stats = await logAnalyzer.getLogStatistics();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
