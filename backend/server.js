/**
 * Main Server File
 * Initializes Express server, connects to MongoDB, and starts metric collection
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const metricCollector = require('./services/metricCollector');

// Import routes
const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const metricsRoutes = require('./routes/metrics');
const alertsRoutes = require('./routes/alerts');
const summaryRoutes = require('./routes/summary');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/summary', summaryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});
// Auto-analyze sample logs on startup
const logAnalyzer = require('./services/logAnalyzer');
const path = require('path');

// Analyze sample logs on startup
setTimeout(async () => {
  try {
    const sampleLogPath = path.join(__dirname, 'sample-logs.txt');
    console.log('📋 Analyzing sample logs...');
    await logAnalyzer.analyzeLogFile(sampleLogPath);
    console.log('✓ Sample logs analyzed successfully');
  } catch (error) {
    console.error('Failed to analyze sample logs:', error.message);
  }
}, 2000);


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start metric collection (every 5 seconds)
  metricCollector.startCollection(5000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  metricCollector.stopCollection();
  process.exit(0);
});
