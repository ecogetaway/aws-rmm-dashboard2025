'use client'

import { motion } from 'framer-motion'
import {
  Server,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain
} from 'lucide-react'

interface OverviewCardData {
  totalServers: number
  healthyServers: number
  activeIncidents: number
  averageResponseTime: string
  costSavings: string
  automationRate: number
  mttrReduction: number
  agentsActive: number
}

interface OverviewCardsProps {
  data: OverviewCardData
}

export default function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Servers Monitored',
      value: data?.totalServers || 0,
      subtitle: `${data?.healthyServers || 0} healthy`,
      icon: Server,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Incidents',
      value: data?.activeIncidents || 0,
      subtitle: 'Auto-resolved: 24',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      trend: '-45%',
      trendUp: false,
    },
    {
      title: 'Response Time',
      value: data?.averageResponseTime || '0s',
      subtitle: 'Target: <30s',
      icon: Clock,
      color: 'bg-green-500',
      trend: '-67%',
      trendUp: false,
    },
    {
      title: 'Cost Savings',
      value: data?.costSavings || '$0',
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+156%',
      trendUp: true,
    },
    {
      title: 'Automation Rate',
      value: `${data?.automationRate || 0}%`,
      subtitle: 'Incidents resolved',
      icon: Zap,
      color: 'bg-yellow-500',
      trend: '+23%',
      trendUp: true,
    },
    {
      title: 'MTTR Reduction',
      value: `${data?.mttrReduction || 0}%`,
      subtitle: 'vs. manual process',
      icon: Shield,
      color: 'bg-indigo-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'AI Agents',
      value: data?.agentsActive || 0,
      subtitle: 'Active and learning',
      icon: Brain,
      color: 'bg-pink-500',
      trend: 'Online',
      trendUp: true,
    },
    {
      title: 'System Health',
      value: '98.7%',
      subtitle: 'Overall score',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      trend: '+2.1%',
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    card.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{card.trend}</span>
                    {card.trendUp ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4 rotate-180" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live indicator for active metrics */}
            {(card.title.includes('Agents') || card.title.includes('System')) && (
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">Live</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
