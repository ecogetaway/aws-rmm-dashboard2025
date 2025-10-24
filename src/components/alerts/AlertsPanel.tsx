'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Shield, Eye, Clock, CheckCircle, Wand2 } from 'lucide-react'
import { AlertData } from '@/lib/mockData'

interface AlertsPanelProps {
  alerts: AlertData[]
  onAcknowledge?: (id: string) => void
  onAutoRemediate?: (id: string) => void
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'anomaly':
      return Eye
    case 'threshold':
      return AlertTriangle
    case 'prediction':
      return TrendingUp
    case 'security':
      return Shield
    default:
      return AlertTriangle
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'anomaly':
      return 'text-purple-600'
    case 'threshold':
      return 'text-red-600'
    case 'prediction':
      return 'text-blue-600'
    case 'security':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

export default function AlertsPanel({ alerts, onAcknowledge, onAutoRemediate }: AlertsPanelProps) {
  const sortedAlerts = alerts?.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) || []

  const unacknowledgedAlerts = sortedAlerts.filter(alert => !alert.acknowledged)
  const criticalAlerts = sortedAlerts.filter(alert => alert.severity === 'critical')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          <p className="text-sm text-gray-600">Real-time alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          {unacknowledgedAlerts.length > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
          <span className="text-sm font-medium text-gray-600">
            {unacknowledgedAlerts.length} new
          </span>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-lg font-bold text-red-600">{criticalAlerts.length}</div>
          <div className="text-xs text-red-700">Critical Alerts</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-lg font-bold text-yellow-600">{unacknowledgedAlerts.length}</div>
          <div className="text-xs text-yellow-700">Unacknowledged</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedAlerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.type)
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${
                alert.acknowledged ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alert.acknowledged ? 'bg-gray-200' : 'bg-white'
                  }`}>
                    <Icon className={`w-4 h-4 ${getTypeColor(alert.type)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{alert.type}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{alert.message}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      <span>Source: {alert.source}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-3 flex items-center space-x-2">
                  {alert.acknowledged && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge && onAcknowledge(alert.id)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      aria-label={`Acknowledge alert ${alert.id}`}
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.severity !== 'low' && !alert.acknowledged && (
                    <button
                      onClick={() => onAutoRemediate && onAutoRemediate(alert.id)}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      aria-label={`Trigger auto-remediation for alert ${alert.id}`}
                    >
                      <Wand2 className="w-3 h-3" /> Fix
                    </button>
                  )}
                </div>
              </div>

              {/* Alert Actions */}
              {!alert.acknowledged && alert.severity === 'critical' && (
                <div className="mt-3 pt-2 border-t border-red-200">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Critical - Immediate action required</span>
                    </div>
                  </div>
                </div>
              )}

              {alert.type === 'prediction' && (
                <div className="mt-3 pt-2 border-t border-blue-200">
                  <div className="flex items-center space-x-2 text-xs text-blue-700">
                    <TrendingUp className="w-3 h-3" />
                    <span>Predictive alert - Plan maintenance accordingly</span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}

        {(!alerts || alerts.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50 text-green-500" />
            <p className="font-medium">No active alerts</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        )}
      </div>

      {/* Alert Type Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span className="text-gray-600">Threshold</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3 text-purple-600" />
            <span className="text-gray-600">Anomaly</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span className="text-gray-600">Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-3 h-3 text-orange-600" />
            <span className="text-gray-600">Security</span>
          </div>
        </div>
      </div>
    </div>
  )
}
