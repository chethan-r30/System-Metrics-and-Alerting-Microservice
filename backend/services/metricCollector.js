/**
 * Metric Collector Service
 * Phase 3: Collects system metrics (CPU and Memory usage)
 */
const si = require('systeminformation');
const Metric = require('../models/Metric');
const alertService = require('./alertService');

class MetricCollector {
  constructor() {
    this.isCollecting = false;
    this.collectionInterval = null;
  }
  
  /**
   * Start collecting metrics at specified interval
   * @param {number} intervalMs - Collection interval in milliseconds
   */
  startCollection(intervalMs = 5000) {
    if (this.isCollecting) {
      console.log('Metric collection already running');
      return;
    }
    
    this.isCollecting = true;
    console.log(`Starting metric collection every ${intervalMs}ms`);
    
    // Collect immediately
    this.collectMetrics();
    
    // Then collect at intervals
    this.collectionInterval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);
  }
  
  /**
   * Stop metric collection
   */
  stopCollection() {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
      this.isCollecting = false;
      console.log('Metric collection stopped');
    }
  }
  
  /**
   * Collect CPU and Memory metrics
   */
  async collectMetrics() {
    try {
      // Collect CPU metrics
      const cpuData = await si.currentLoad();
      const cpuUsage = cpuData.currentLoad;
      
      // Collect Memory metrics
      const memData = await si.mem();
      const memoryUsage = (memData.used / memData.total) * 100;
      
      // Get CPU info for metadata
      const cpuInfo = await si.cpu();
      
      // Store CPU metric
      const cpuMetric = await Metric.create({
        type: 'CPU',
        value: parseFloat(cpuUsage.toFixed(2)),
        metadata: {
          cpuModel: cpuInfo.manufacturer + ' ' + cpuInfo.brand,
          cores: cpuInfo.cores
        }
      });
      
      // Store Memory metric
      const memMetric = await Metric.create({
        type: 'MEMORY',
        value: parseFloat(memoryUsage.toFixed(2)),
        metadata: {
          totalMemory: memData.total,
          usedMemory: memData.used,
          freeMemory: memData.free
        }
      });
      
      // Check for threshold breaches
      await alertService.checkThresholds(cpuMetric);
      await alertService.checkThresholds(memMetric);
      
      console.log(`Metrics collected - CPU: ${cpuUsage.toFixed(2)}%, Memory: ${memoryUsage.toFixed(2)}%`);
    } catch (error) {
      console.error('Error collecting metrics:', error.message);
    }
  }
  
  /**
   * Get recent metrics
   * @param {string} type - Metric type (CPU or MEMORY)
   * @param {number} limit - Number of metrics to retrieve
   * @returns {Array} - Array of metrics
   */
  async getRecentMetrics(type = null, limit = 50) {
    try {
      const query = type ? { type } : {};
      
      const metrics = await Metric.find(query)
        .sort({ timestamp: -1 })
        .limit(limit);
      
      return metrics;
    } catch (error) {
      throw new Error(`Failed to retrieve metrics: ${error.message}`);
    }
  }
  
  /**
   * Get average metric values
   * @param {string} type - Metric type
   * @param {number} count - Number of recent readings
   * @returns {number} - Average value
   */
  async getAverageMetric(type, count = 10) {
    try {
      const metrics = await Metric.find({ type })
        .sort({ timestamp: -1 })
        .limit(count);
      
      if (metrics.length === 0) return 0;
      
      const sum = metrics.reduce((acc, m) => acc + m.value, 0);
      return parseFloat((sum / metrics.length).toFixed(2));
    } catch (error) {
      throw new Error(`Failed to calculate average: ${error.message}`);
    }
  }
}

module.exports = new MetricCollector();
