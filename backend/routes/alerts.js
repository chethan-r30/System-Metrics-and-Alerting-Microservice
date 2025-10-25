/**
 * Alert Routes
 * Phase 3: Alert management endpoints
 */
const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');
const auth = require('../middleware/auth');

/**
 * GET /api/alerts
 * Get alerts with optional filters
 */
router.get('/', auth, async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      severity: req.query.severity,
      resolved: req.query.resolved === 'true' ? true : req.query.resolved === 'false' ? false : undefined,
      limit: parseInt(req.query.limit) || 100
    };
    
    const alerts = await alertService.getAlerts(filters);
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alerts/statistics
 * Get alert statistics
 */
router.get('/statistics', auth, async (req, res) => {
  try {
    const stats = await alertService.getAlertStatistics();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alerts/thresholds
 * Get current threshold configuration
 */
router.get('/thresholds', auth, async (req, res) => {
  try {
    const thresholds = alertService.getThresholds();
    
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/alerts/thresholds
 * Update threshold configuration
 */
router.put('/thresholds', auth, async (req, res) => {
  try {
    const { type, warning, critical } = req.body;
    
    if (!type || (!warning && !critical)) {
      return res.status(400).json({ error: 'Type and threshold values required' });
    }
    
    alertService.updateThreshold(type, { warning, critical });
    
    res.json({
      message: 'Threshold updated successfully',
      thresholds: alertService.getThresholds()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/alerts/:id/resolve
 * Resolve an alert
 */
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const alert = await alertService.resolveAlert(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({
      message: 'Alert resolved',
      alert
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
