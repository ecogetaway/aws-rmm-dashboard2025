'use client'

import { motion } from 'framer-motion'
import { Brain, Bot, Eye, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { AgentData } from '@/lib/mockData'

interface AIAgentStatusProps {
  agents: AgentData[]
}

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'monitor':
      return Eye
    case 'incident':
      return AlertTriangle
    case 'predictive':
      return TrendingUp
    case 'supervisor':
      return Brain
    default:
      return Bot
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'idle':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusDot = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 animate-pulse'
    case 'processing':
      return 'bg-blue-500 animate-pulse'
    case 'idle':
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
  }
}

export default function AIAgentStatus({ agents }: AIAgentStatusProps) {
  const totalRequests = agents?.reduce((sum, agent) => sum + agent.requestsProcessed, 0) || 0
  const avgSuccessRate = agents?.length ? 
    agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Agent Network</h3>
          <p className="text-sm text-gray-600">Autonomous agents monitoring and managing infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-600">AI Powered</span>
        </div>
      </div>

      <div className="space-y-4">
        {agents?.map((agent, index) => {
          const Icon = getAgentIcon(agent.type)
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{agent.type} agent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(agent.status)}`}></div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Agent Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-lg font-bold text-gray-900">{agent.requestsProcessed}</div>
                  <div className="text-xs text-gray-500">Requests Processed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{agent.successRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{agent.averageResponseTime.toFixed(1)}s</div>
                  <div className="text-xs text-gray-500">Avg Response</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{(agent.confidence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              {/* Last Action */}
              <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Last action:</span>
                </div>
                <span className="font-medium">{agent.lastAction}</span>
              </div>

              {/* Agent Specific Indicators */}
              {agent.status === 'processing' && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing active incident...</span>
                </div>
              )}

              {agent.type === 'supervisor' && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-purple-600">
                  <Brain className="w-4 h-4" />
                  <span>Orchestrating {agents.length - 1} agents</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Network Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{totalRequests.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Requests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{avgSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Network Success Rate</div>
          </div>
        </div>

        {/* AI Learning Indicator */}
        <div className="mt-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI Learning Active</span>
            </div>
            <div className="text-xs text-gray-600">
              Continuously improving from {totalRequests.toLocaleString()}+ interactions
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
