/**
 * Summary Routes
 * Phase 4: Summary reporting API
 */
const express = require('express');
const router = express.Router();
const metricCollector = require('../services/metricCollector');
const alertService = require('../services/alertService');
const logAnalyzer = require('../services/logAnalyzer');
const auth = require('../middleware/auth');

/**
 * GET /api/summary
 * Generate comprehensive summary report
 */
router.get('/', auth, async (req, res) => {
  try {
    const { lastN } = req.query;
    const alertLimit = parseInt(lastN) || 10;
    
    // Get alert statistics
    const alertStats = await alertService.getAlertStatistics();
    
    // Get recent alerts
    const recentAlerts = await alertService.getAlerts({ limit: alertLimit });
    
    // Get last N alert timestamps
    const lastAlertTimestamps = recentAlerts
      .slice(0, alertLimit)
      .map(alert => ({
        type: alert.type,
        severity: alert.severity,
        timestamp: alert.timestamp,
        message: alert.message
      }));
    
    // Get average metric values for last 10 readings
    const avgCPU = await metricCollector.getAverageMetric('CPU', 10);
    const avgMemory = await metricCollector.getAverageMetric('MEMORY', 10);
    
    // Get total alert count
    const totalAlerts = recentAlerts.length;
    
    // Breakdown by type
    const breakdown = {
      CPU: alertStats.CPU || { total: 0, unresolved: 0 },
      MEMORY: alertStats.MEMORY || { total: 0, unresolved: 0 }
    };
    
    // Get log statistics
    const logStats = await logAnalyzer.getLogStatistics();
    
    // Compile summary report
    const summary = {
      timestamp: new Date(),
      alerts: {
        total: totalAlerts,
        breakdown,
        lastN: lastAlertTimestamps
      },
      metrics: {
        averages: {
          CPU: avgCPU,
          MEMORY: avgMemory
        },
        readingCount: 10
      },
      logs: logStats,
      systemHealth: {
        status: avgCPU < 80 && avgMemory < 75 ? 'HEALTHY' : 'WARNING',
        cpuStatus: avgCPU < 70 ? 'NORMAL' : avgCPU < 85 ? 'WARNING' : 'CRITICAL',
        memoryStatus: avgMemory < 75 ? 'NORMAL' : avgMemory < 90 ? 'WARNING' : 'CRITICAL'
      }
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
