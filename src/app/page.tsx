'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import OverviewCards from '@/components/dashboard/OverviewCards'
import SystemHealthChart from '@/components/charts/SystemHealthChart'
import IncidentTimeline from '@/components/incidents/IncidentTimeline'
import ServerStatus from '@/components/servers/ServerStatus'
import AIAgentStatus from '@/components/agents/AIAgentStatus'
import AlertsPanel from '@/components/alerts/AlertsPanel'
import { generateMockData, updateMockData } from '@/lib/mockData'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // Simulate loading and fetch mock data
    const timer = setTimeout(() => {
      setDashboardData(generateMockData())
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Live demo: periodically update mock data
  useEffect(() => {
    if (!dashboardData) return
    const interval = setInterval(() => {
      setDashboardData((prev: any) => (prev ? updateMockData(prev) : prev))
    }, 3000)
    return () => clearInterval(interval)
  }, [dashboardData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Initializing RMM Dashboard</h2>
          <p className="text-gray-500">Loading AI agents and system data...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              RMM Command Center
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered infrastructure monitoring and management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">System Operational</span>
            </div>
            <div className="text-sm text-gray-500">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <OverviewCards data={dashboardData?.overview} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Health Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SystemHealthChart data={dashboardData?.healthData} />
            </motion.div>

            {/* Server Status Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ServerStatus servers={dashboardData?.servers} />
            </motion.div>

            {/* Incident Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <IncidentTimeline incidents={dashboardData?.incidents} />
            </motion.div>
          </div>

          {/* Right Column - Agents and Alerts */}
          <div className="space-y-6">
            {/* AI Agent Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AIAgentStatus agents={dashboardData?.agents} />
            </motion.div>

            {/* Active Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AlertsPanel 
                alerts={dashboardData?.alerts}
                onAcknowledge={(id) => {
                  setDashboardData((prev: any) => {
                    if (!prev) return prev
                    return {
                      ...prev,
                      alerts: prev.alerts.map((a: any) => a.id === id ? { ...a, acknowledged: true } : a)
                    }
                  })
                }}
                onAutoRemediate={(id) => {
                  setDashboardData((prev: any) => {
                    if (!prev) return prev
                    const updatedAlerts = prev.alerts.map((a: any) => a.id === id ? { ...a, acknowledged: true, message: a.message + ' • Auto-remediation triggered' } : a)
                    const newIncident = {
                      id: `inc-${Math.random().toString(36).slice(2,8)}`,
                      title: `Auto-remediation initiated for ${id}`,
                      severity: 'medium',
                      status: 'resolved',
                      assignedTo: 'ai_agent',
                      createdAt: new Date().toISOString(),
                      resolvedAt: new Date().toISOString(),
                      description: 'AI agent applied safe remediation for the alert',
                      affectedSystems: [updatedAlerts.find((a: any) => a.id === id)?.source || 'unknown'],
                      resolutionTime: 30
                    }
                    return {
                      ...prev,
                      alerts: updatedAlerts,
                      incidents: [newIncident, ...prev.incidents]
                    }
                  })
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Demo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                🚀 AWS RMM Hackathon Demo
              </h3>
              <p className="text-primary-100">
                This dashboard demonstrates AI-powered remote monitoring with AWS Bedrock agents, 
                Netdata integration, and autonomous incident response capabilities.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">90%</div>
              <div className="text-sm text-primary-200">MTTR Reduction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
