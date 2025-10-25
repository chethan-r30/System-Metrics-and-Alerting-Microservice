/**
 * Log Analyzer Component
 * Displays log analysis results
 */
import React, { useState } from 'react';
import { FileText, AlertCircle, Upload } from 'lucide-react';
import { logsAPI } from '../services/api';

const LogAnalyzer = ({ statistics, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { levelCounts, topErrors } = statistics;

  const analyzeSampleLogs = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Analyze the sample log file
      await logsAPI.analyze('sample-logs.txt');
      setMessage('✓ Logs analyzed successfully!');
      
      // Refresh the statistics
      if (onRefresh) {
        setTimeout(() => onRefresh(), 1000);
      }
    } catch (error) {
      setMessage('✗ Failed to analyze logs: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      INFO: 'bg-blue-100 text-blue-800',
      WARN: 'bg-yellow-100 text-yellow-800',
      ERROR: 'bg-red-100 text-red-800',
      DEBUG: 'bg-gray-100 text-gray-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const hasData = levelCounts && Object.keys(levelCounts).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Log Analysis</h2>
        </div>
        <button
          onClick={analyzeSampleLogs}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          <Upload className="w-4 h-4 mr-2" />
          {loading ? 'Analyzing...' : 'Analyze Sample Logs'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {!hasData ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No log data available</p>
          <p className="text-sm text-gray-500">Click "Analyze Sample Logs" to process the sample log file</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Log Level Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(levelCounts).map(([level, count]) => (
                <div key={level} className={`p-4 rounded-lg ${getLevelColor(level)}`}>
                  <p className="text-sm font-medium">{level}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Top 5 Errors</h3>
            </div>
            {topErrors && topErrors.length > 0 ? (
              <div className="space-y-2">
                {topErrors.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700 flex-1">{error.message}</p>
                    <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {error.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No error logs found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LogAnalyzer;
