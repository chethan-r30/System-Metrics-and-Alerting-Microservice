/**
 * Log Analyzer Service
 * Phase 1: Parses log files and analyzes patterns
 * Uses HashMap for O(1) counting efficiency
 */
const fs = require('fs').promises;
const Log = require('../models/Log');

class LogAnalyzer {
  /**
   * Parse log file and analyze
   * @param {string} filePath - Path to log file
   * @returns {Object} - Analysis results
   */
  async analyzeLogFile(filePath) {
    try {
      // Read log file
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      // HashMaps for efficient counting
      const levelCounts = new Map();
      const errorMessages = new Map();
      
      // Parse each log line
      for (const line of lines) {
        const logEntry = this.parseLogLine(line);
        
        if (logEntry) {
          // Count log levels
          levelCounts.set(
            logEntry.level,
            (levelCounts.get(logEntry.level) || 0) + 1
          );
          
          // Track error messages for frequency analysis
          if (logEntry.level === 'ERROR') {
            errorMessages.set(
              logEntry.message,
              (errorMessages.get(logEntry.message) || 0) + 1
            );
          }
          
          // Store in database
          await Log.create(logEntry);
        }
      }
      
      // Get top 5 most frequent errors
      const topErrors = Array.from(errorMessages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([message, count]) => ({ message, count }));
      
      return {
        totalLogs: lines.length,
        levelCounts: Object.fromEntries(levelCounts),
        topErrors,
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Log analysis failed: ${error.message}`);
    }
  }
  
  /**
   * Parse individual log line
   * Expected format: [TIMESTAMP] LEVEL: Message
   * @param {string} line - Log line
   * @returns {Object|null} - Parsed log entry
   */
  parseLogLine(line) {
    // Regex pattern for log parsing
    const pattern = /\[(.+?)\]\s+(INFO|WARN|ERROR|DEBUG):\s+(.+)/;
    const match = line.match(pattern);
    
    if (match) {
      return {
        timestamp: new Date(match[1]),
        level: match[2],
        message: match[3].trim(),
        source: 'file'
      };
    }
    
    return null;
  }
  
  /**
   * Get log statistics from database
   * @returns {Object} - Log statistics
   */
  async getLogStatistics() {
    try {
      // Aggregate counts by level
      const levelCounts = await Log.aggregate([
        {
          $group: {
            _id: '$level',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Get top errors
      const topErrors = await Log.aggregate([
        { $match: { level: 'ERROR' } },
        {
          $group: {
            _id: '$message',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      return {
        levelCounts: levelCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topErrors: topErrors.map(e => ({
          message: e._id,
          count: e.count
        }))
      };
    } catch (error) {
      throw new Error(`Failed to get log statistics: ${error.message}`);
    }
  }
}

module.exports = new LogAnalyzer();
