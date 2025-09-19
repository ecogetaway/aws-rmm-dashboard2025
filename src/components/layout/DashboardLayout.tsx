'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Shield,
  Bot,
  AlertTriangle,
  Server,
  Activity,
  Settings,
  Menu,
  X,
  Brain,
  Zap
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Overview', href: '/', icon: BarChart3, current: true },
  { name: 'Servers', href: '/servers', icon: Server, current: false },
  { name: 'AI Agents', href: '/agents', icon: Bot, current: false },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle, current: false },
  { name: 'Analytics', href: '/analytics', icon: Activity, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-gray-600 opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -300 }}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0 lg:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            {/* Logo and title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">AWS RMM</h1>
                  <p className="text-xs text-gray-500">AI-Powered</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                )
              })}
            </nav>

            {/* Agent Status Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-success-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-success-800">AI Agents Active</span>
                  </div>
                  <Zap className="w-4 h-4 text-success-600" />
                </div>
                <div className="mt-2 text-xs text-success-700">
                  5 agents monitoring • 247 metrics
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">AWS RMM Dashboard</h1>
            <div className="w-9" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
