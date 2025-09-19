'use client'

import { motion } from 'framer-motion'
import { Server, Cpu, HardDrive, Wifi, Clock, MapPin } from 'lucide-react'
import { ServerData } from '@/lib/mockData'

interface ServerStatusProps {
  servers: ServerData[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusDot = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'critical':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getUsageColor = (usage: number) => {
  if (usage >= 90) return 'bg-red-500'
  if (usage >= 75) return 'bg-yellow-500'
  if (usage >= 50) return 'bg-blue-500'
  return 'bg-green-500'
}

export default function ServerStatus({ servers }: ServerStatusProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Server Infrastructure</h3>
          <p className="text-sm text-gray-600">Real-time server monitoring and health status</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {servers?.map((server, index) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Server Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{server.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{server.location}</span>
                    <span>•</span>
                    <span>{server.os}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusDot(server.status)} animate-pulse`}></div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="space-y-3">
              {/* CPU */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">CPU</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(server.cpu)} transition-all duration-500`}
                      style={{ width: `${server.cpu}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {server.cpu.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Memory</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(server.memory)} transition-all duration-500`}
                      style={{ width: `${server.memory}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {server.memory.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Disk */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Disk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(server.disk)} transition-all duration-500`}
                      style={{ width: `${server.disk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {server.disk.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(server.network)} transition-all duration-500`}
                      style={{ width: `${server.network}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {server.network.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Server Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Uptime: {server.uptime}</span>
              </div>
              <span>Last check: {server.lastCheck}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            {
              label: 'Total Servers',
              value: servers?.length || 0,
              color: 'text-blue-600'
            },
            {
              label: 'Healthy',
              value: servers?.filter(s => s.status === 'healthy').length || 0,
              color: 'text-green-600'
            },
            {
              label: 'Warning',
              value: servers?.filter(s => s.status === 'warning').length || 0,
              color: 'text-yellow-600'
            },
            {
              label: 'Critical',
              value: servers?.filter(s => s.status === 'critical').length || 0,
              color: 'text-red-600'
            }
          ].map((stat, index) => (
            <div key={index}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
