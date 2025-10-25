/**
 * Main Dashboard Component
 * Orchestrates all dashboard panels and data fetching
 */
import React, { useState, useEffect } from 'react';
import { LogOut, RefreshCw, TrendingUp, Database } from 'lucide-react';
import MetricsChart from './MetricsChart';
import AlertsPanel from './AlertsPanel';
import LogAnalyzer from './LogAnalyzer';
import ThresholdConfig from './ThresholdConfig';
import { metricsAPI, alertsAPI, logsAPI, summaryAPI, authAPI } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logStats, setLogStats] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
  try {
    const [metricsRes, alertsRes, logsRes, summaryRes] = await Promise.all([
      metricsAPI.getMetrics(null, 50),  // Get 50 data points
      alertsAPI.getAlerts({ resolved: false, limit: 10 }),
      logsAPI.getStatistics(),
      summaryAPI.getSummary(10)
    ]);

    setMetrics(metricsRes.data);
    setAlerts(alertsRes.data);
    setLogStats(logsRes.data);
    setSummary(summaryRes.data);
    setLoading(false);
  } catch (error) {
    console.error('Failed to load data:', error);
    setLoading(false);
  }
};


  const handleResolveAlert = async (alertId) => {
    try {
      await alertsAPI.resolveAlert(alertId);
      loadData();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">System Observability</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}</span>
              <button
                onClick={loadData}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm opacity-90">Total Alerts</p>
              <p className="text-4xl font-bold mt-2">{summary.alerts.total}</p>
              <p className="text-sm mt-2 opacity-75">
                {summary.alerts.breakdown.CPU?.unresolved || 0} CPU, {summary.alerts.breakdown.MEMORY?.unresolved || 0} Memory
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm opacity-90">Avg CPU Usage</p>
              <p className="text-4xl font-bold mt-2">{summary.metrics.averages.CPU}%</p>
              <p className="text-sm mt-2 opacity-75">Last 10 readings</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm opacity-90">Avg Memory Usage</p>
              <p className="text-4xl font-bold mt-2">{summary.metrics.averages.MEMORY}%</p>
              <p className="text-sm mt-2 opacity-75">Last 10 readings</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm opacity-90">System Health</p>
              <p className="text-4xl font-bold mt-2">{summary.systemHealth.status}</p>
              <p className="text-sm mt-2 opacity-75">
                CPU: {summary.systemHealth.cpuStatus}
              </p>
            </div>
          </div>
        )}

        {/* Charts and Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MetricsChart data={metrics} />
          <AlertsPanel alerts={alerts} onResolve={handleResolveAlert} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LogAnalyzer statistics={logStats} onRefresh={loadData} />

          <ThresholdConfig />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
