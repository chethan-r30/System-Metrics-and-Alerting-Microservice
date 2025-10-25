/**
 * Metrics Chart Component
 * Visualizes CPU and Memory metrics over time
 */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const MetricsChart = ({ data }) => {
  // Group metrics by timestamp
  const timeMap = new Map();
  
  data.forEach(item => {
    const time = new Date(item.timestamp).toLocaleTimeString();
    
    if (!timeMap.has(time)) {
      timeMap.set(time, { time, CPU: null, Memory: null });
    }
    
    const entry = timeMap.get(time);
    if (item.type === 'CPU') {
      entry.CPU = item.value;
    } else if (item.type === 'MEMORY') {
      entry.Memory = item.value;
    }
  });
  
  // Convert to array and reverse to show chronological order
  const chartData = Array.from(timeMap.values()).reverse();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Activity className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">System Metrics</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis domain={[0, 100]} label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="CPU" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 3 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="Memory" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
