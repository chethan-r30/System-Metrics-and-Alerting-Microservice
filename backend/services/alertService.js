/**
 * Alert Service
 * Phase 3: Generates and manages alerts based on thresholds
 */
const Alert = require('../models/Alert');

class AlertService {
  constructor() {
    // Default thresholds (can be configured via API)
    this.thresholds = {
      CPU: { warning: 70, critical: 85 },
      MEMORY: { warning: 75, critical: 90 }
    };
  }
  
  /**
   * Check if metric breaches threshold and create alert
   * @param {Object} metric - Metric object
   */
  async checkThresholds(metric) {
    try {
      const threshold = this.thresholds[metric.type];
      
      if (!threshold) return;
      
      let severity = null;
      let thresholdValue = null;
      
      // Determine severity level
      if (metric.value >= threshold.critical) {
        severity = 'CRITICAL';
        thresholdValue = threshold.critical;
      } else if (metric.value >= threshold.warning) {
        severity = 'WARNING';
        thresholdValue = threshold.warning;
      }
      
      // Create alert if threshold breached
      if (severity) {
        const alert = await Alert.create({
          type: metric.type,
          severity,
          message: `${metric.type} usage ${severity.toLowerCase()}: ${metric.value}% (threshold: ${thresholdValue}%)`,
          value: metric.value,
          threshold: thresholdValue
        });
        
        console.log(`⚠️  Alert generated: ${alert.message}`);
        return alert;
      }
    } catch (error) {
      console.error('Error checking thresholds:', error.message);
    }
  }
  
  /**
   * Get alerts with filtering options
   * @param {Object} filters - Filter criteria
   * @returns {Array} - Array of alerts
   */
  async getAlerts(filters = {}) {
    try {
      const query = {};
      
      if (filters.type) query.type = filters.type;
      if (filters.severity) query.severity = filters.severity;
      if (filters.resolved !== undefined) query.resolved = filters.resolved;
      
      const alerts = await Alert.find(query)
        .sort({ timestamp: -1 })
        .limit(filters.limit || 100);
      
      return alerts;
    } catch (error) {
      throw new Error(`Failed to retrieve alerts: ${error.message}`);
    }
  }
  
  /**
   * Get alert statistics
   * @returns {Object} - Alert statistics
   */
  async getAlertStatistics() {
    try {
      const stats = await Alert.aggregate([
        {
          $group: {
            _id: '$type',
            total: { $sum: 1 },
            unresolved: {
              $sum: { $cond: [{ $eq: ['$resolved', false] }, 1, 0] }
            }
          }
        }
      ]);
      
      return stats.reduce((acc, stat) => {
        acc[stat._id] = {
          total: stat.total,
          unresolved: stat.unresolved
        };
        return acc;
      }, {});
    } catch (error) {
      throw new Error(`Failed to get alert statistics: ${error.message}`);
    }
  }
  
  /**
   * Update threshold configuration
   * @param {string} type - Metric type
   * @param {Object} values - New threshold values
   */
  updateThreshold(type, values) {
    if (this.thresholds[type]) {
      this.thresholds[type] = {
        ...this.thresholds[type],
        ...values
      };
      console.log(`Threshold updated for ${type}:`, this.thresholds[type]);
    }
  }
  
  /**
   * Get current thresholds
   * @returns {Object} - Current thresholds
   */
  getThresholds() {
    return this.thresholds;
  }
  
  /**
   * Resolve an alert
   * @param {string} alertId - Alert ID
   */
  async resolveAlert(alertId) {
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        { resolved: true, resolvedAt: new Date() },
        { new: true }
      );
      
      return alert;
    } catch (error) {
      throw new Error(`Failed to resolve alert: ${error.message}`);
    }
  }
}

module.exports = new AlertService();
