'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, Eye, Bot } from 'lucide-react'
import { IncidentData } from '@/lib/mockData'

interface IncidentTimelineProps {
  incidents: IncidentData[]
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'resolved':
    case 'closed':
      return CheckCircle
    case 'investigating':
      return Eye
    default:
      return AlertTriangle
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved':
    case 'closed':
      return 'text-green-600'
    case 'investigating':
      return 'text-blue-600'
    default:
      return 'text-red-600'
  }
}

export default function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  const sortedIncidents = incidents?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Incident Timeline</h3>
          <p className="text-sm text-gray-600">Recent incidents and AI-powered resolutions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-600">AI Managed</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedIncidents.map((incident, index) => {
          const StatusIcon = getStatusIcon(incident.status)
          const isResolved = incident.status === 'resolved' || incident.status === 'closed'
          const resolutionTime = incident.resolutionTime
          
          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`border-l-4 pl-4 pb-4 ${
                isResolved ? 'border-green-400' : 'border-red-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Incident Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(incident.status)}`} />
                    <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3">{incident.description}</p>

                  {/* Affected Systems */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-gray-500">Affected:</span>
                    {incident.affectedSystems.map((system, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                      >
                        {system}
                      </span>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Created: {new Date(incident.createdAt).toLocaleString()}</span>
                    </div>
                    {incident.resolvedAt && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* AI Resolution Info */}
                  {incident.assignedTo === 'ai_agent' && (
                    <div className="mt-2 flex items-center space-x-2 text-xs">
                      <div className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md flex items-center space-x-1">
                        <Bot className="w-3 h-3" />
                        <span>AI Agent Resolved</span>
                      </div>
                      {resolutionTime && (
                        <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md">
                          Resolution time: {Math.floor(resolutionTime / 60)}m {resolutionTime % 60}s
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isResolved 
                      ? 'bg-green-100 text-green-800' 
                      : incident.status === 'investigating'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {(!incidents || incidents.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent incidents</p>
            <p className="text-sm">Your infrastructure is running smoothly!</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {incidents && incidents.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {incidents.filter(i => i.status === 'open' || i.status === 'investigating').length}
              </div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length}
              </div>
              <div className="text-xs text-gray-500">Resolved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {incidents.filter(i => i.assignedTo === 'ai_agent').length}
              </div>
              <div className="text-xs text-gray-500">AI Handled</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
