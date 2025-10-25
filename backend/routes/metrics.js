/**
 * Metrics Routes
 * Phase 3: Metric collection endpoints
 */
const express = require('express');
const router = express.Router();
const metricCollector = require('../services/metricCollector');
const auth = require('../middleware/auth');

/**
 * GET /api/metrics
 * Get recent metrics
 */
router.get('/', auth, async (req, res) => {
  try {
    const { type, limit } = req.query;
    
    const metrics = await metricCollector.getRecentMetrics(
      type,
      parseInt(limit) || 50
    );
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/metrics/average
 * Get average metric values
 */
router.get('/average', auth, async (req, res) => {
  try {
    const { type, count } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: 'Metric type is required' });
    }
    
    const average = await metricCollector.getAverageMetric(
      type,
      parseInt(count) || 10
    );
    
    res.json({ type, average, count: parseInt(count) || 10 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/metrics/collect
 * Manually trigger metric collection
 */
router.post('/collect', auth, async (req, res) => {
  try {
    await metricCollector.collectMetrics();
    
    res.json({ message: 'Metrics collected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
