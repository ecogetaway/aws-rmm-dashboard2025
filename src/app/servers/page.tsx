import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Server, Activity, Cpu, HardDrive, MemoryStick, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

const ServersPage = () => {
  const servers = [
    {
      id: 'srv-001',
      name: 'Production Web Server',
      ip: '10.0.1.100',
      status: 'healthy',
      uptime: '99.8%',
      cpu: 45,
      memory: 62,
      disk: 78,
      network: 'Good',
      location: 'US-East-1',
      alerts: 0,
      lastSeen: '2 minutes ago'
    },
    {
      id: 'srv-002', 
      name: 'Database Primary',
      ip: '10.0.1.101',
      status: 'healthy',
      uptime: '99.9%',
      cpu: 72,
      memory: 84,
      disk: 45,
      network: 'Excellent',
      location: 'US-East-1',
      alerts: 0,
      lastSeen: '1 minute ago'
    },
    {
      id: 'srv-003',
      name: 'API Gateway',
      ip: '10.0.1.102', 
      status: 'warning',
      uptime: '98.5%',
      cpu: 89,
      memory: 91,
      disk: 65,
      network: 'Good',
      location: 'US-West-2',
      alerts: 2,
      lastSeen: '30 seconds ago'
    },
    {
      id: 'srv-004',
      name: 'Cache Server',
      ip: '10.0.1.103',
      status: 'healthy',
      uptime: '99.7%',
      cpu: 34,
      memory: 56,
      disk: 23,
      network: 'Excellent',
      location: 'EU-West-1',
      alerts: 0,
      lastSeen: '45 seconds ago'
    },
    {
      id: 'srv-005',
      name: 'Backup Server',
      ip: '10.0.1.104',
      status: 'offline',
      uptime: '95.2%',
      cpu: 0,
      memory: 0,
      disk: 92,
      network: 'Offline',
      location: 'US-Central',
      alerts: 3,
      lastSeen: '2 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      case 'offline': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'offline': return <Server className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getResourceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Server Infrastructure</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your server fleet with AI-powered insights</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Total Servers</span>
              <p className="text-2xl font-bold text-gray-900">{servers.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Healthy</span>
              <p className="text-2xl font-bold text-green-600">{servers.filter(s => s.status === 'healthy').length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Alerts</span>
              <p className="text-2xl font-bold text-red-600">{servers.reduce((acc, s) => acc + s.alerts, 0)}</p>
            </div>
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server) => (
            <div key={server.id} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300">
              {/* Server Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                    <p className="text-sm text-gray-500">{server.ip}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                    {server.status}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uptime: {server.uptime}</span>
                  <span className="text-gray-500">{server.location}</span>
                </div>
              </div>

              {/* Resource Metrics */}
              <div className="p-6 space-y-4">
                {/* CPU Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <span className="text-sm text-gray-600">{server.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getResourceColor(server.cpu)}`}
                      style={{ width: `${server.cpu}%` }}
                    ></div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <span className="text-sm text-gray-600">{server.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getResourceColor(server.memory)}`}
                      style={{ width: `${server.memory}%` }}
                    ></div>
                  </div>
                </div>

                {/* Disk Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Disk</span>
                    </div>
                    <span className="text-sm text-gray-600">{server.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getResourceColor(server.disk)}`}
                      style={{ width: `${server.disk}%` }}
                    ></div>
                  </div>
                </div>

                {/* Network & Alerts */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-600">{server.network}</span>
                  </div>
                  {server.alerts > 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">{server.alerts} alerts</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 pt-2">
                  Last seen: {server.lastSeen}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Server Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Performance Prediction</h4>
              <p className="text-sm text-gray-600">API Gateway will reach 95% CPU in ~2 hours. Auto-scaling recommended.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Anomaly Detection</h4>
              <p className="text-sm text-gray-600">Backup Server offline detected. Failover system activated automatically.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Optimization Suggestion</h4>
              <p className="text-sm text-gray-600">Memory usage pattern suggests cache optimization could reduce load by 23%.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServersPage;
