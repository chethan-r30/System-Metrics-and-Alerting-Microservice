/**
 * Threshold Configuration Component
 * Allows users to configure alert thresholds
 */
import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { alertsAPI } from '../services/api';

const ThresholdConfig = () => {
  const [thresholds, setThresholds] = useState({
    CPU: { warning: 70, critical: 85 },
    MEMORY: { warning: 75, critical: 90 }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    try {
      const response = await alertsAPI.getThresholds();
      setThresholds(response.data);
    } catch (error) {
      console.error('Failed to load thresholds:', error);
    }
  };

  const handleUpdate = async (type) => {
    setLoading(true);
    setMessage('');

    try {
      await alertsAPI.updateThresholds({
        type,
        warning: thresholds[type].warning,
        critical: thresholds[type].critical
      });
      setMessage(`${type} thresholds updated successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to update ${type} thresholds`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (type, level, value) => {
    setThresholds({
      ...thresholds,
      [type]: {
        ...thresholds[type],
        [level]: parseInt(value)
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Settings className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Threshold Configuration</h2>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {['CPU', 'MEMORY'].map((type) => (
          <div key={type} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{type} Thresholds</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warning Threshold (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={thresholds[type].warning}
                  onChange={(e) => handleChange(type, 'warning', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Critical Threshold (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={thresholds[type].critical}
                  onChange={(e) => handleChange(type, 'critical', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => handleUpdate(type)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              <Save className="w-4 h-4 mr-2" />
              Save {type} Thresholds
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThresholdConfig;
