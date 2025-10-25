/**
 * Alerts Panel Component
 * Displays active and historical alerts
 */
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AlertsPanel = ({ alerts, onResolve }) => {
  const getSeverityColor = (severity) => {
    return severity === 'CRITICAL' ? 'bg-red-100 border-red-500 text-red-800' : 'bg-yellow-100 border-yellow-500 text-yellow-800';
  };

  const getSeverityIcon = (severity) => {
    return severity === 'CRITICAL' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Alerts</h2>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`border-l-4 p-4 rounded ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <p className="font-semibold">{alert.message}</p>
                    <p className="text-sm mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => onResolve(alert._id)}
                    className="px-3 py-1 bg-white rounded hover:bg-gray-100 text-sm font-medium"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
