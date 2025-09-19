'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, Bell, Shield, Database, Bot, Cloud, Users, Key, Monitor, Zap } from 'lucide-react';

const SettingsPage = () => {
  // Static settings for demo purposes
  const notifications = {
    incidentAlerts: true,
    systemHealth: true,
    agentStatus: false,
    weeklyReports: true,
    securityAlerts: true
  };

  const agentSettings = {
    autoResolution: true,
    escalationTimeout: 30,
    learningMode: true,
    trustLevel: 'high'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure your RMM platform and AI agent behavior</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {key === 'incidentAlerts' && 'Get notified when new incidents are detected'}
                      {key === 'systemHealth' && 'Receive system health status updates'}
                      {key === 'agentStatus' && 'Monitor AI agent performance and status'}
                      {key === 'weeklyReports' && 'Weekly summary reports via email'}
                      {key === 'securityAlerts' && 'Security-related incident notifications'}
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Configuration */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Agent Configuration</h3>
            </div>
            <div className="space-y-6">
              {/* Auto Resolution */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto Resolution</p>
                  <p className="text-sm text-gray-500">Allow agents to automatically resolve incidents</p>
                </div>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    agentSettings.autoResolution ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      agentSettings.autoResolution ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>

              {/* Escalation Timeout */}
              <div>
                <label className="block font-medium text-gray-900 mb-2">Escalation Timeout (minutes)</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {agentSettings.escalationTimeout}
                </div>
                <p className="text-sm text-gray-500 mt-1">Time before escalating to human intervention</p>
              </div>

              {/* Learning Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Learning Mode</p>
                  <p className="text-sm text-gray-500">Continuously improve agent performance</p>
                </div>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    agentSettings.learningMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      agentSettings.learningMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>

              {/* Trust Level */}
              <div>
                <label className="block font-medium text-gray-900 mb-2">Trust Level</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {agentSettings.trustLevel === 'high' ? 'High - Full automation' : 
                   agentSettings.trustLevel === 'medium' ? 'Medium - Limited actions' : 
                   'Low - Read-only access'}
                </div>
                <p className="text-sm text-gray-500 mt-1">Level of autonomous actions allowed</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">API Authentication</span>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Secure API access with token-based authentication</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Regenerate API Key
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Encryption</span>
                  <span className="text-sm text-green-600">AES-256</span>
                </div>
                <p className="text-sm text-gray-500">Data encryption at rest and in transit</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Access Logs</span>
                  <span className="text-sm text-blue-600">Enabled</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Track all system access and changes</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Audit Logs
                </button>
              </div>
            </div>
          </div>

          {/* System Integration */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Cloud className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">System Integration</h3>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">AWS Bedrock</span>
                  </div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <p className="text-sm text-gray-500">AI agent foundation models</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Netdata Agents</span>
                  </div>
                  <span className="text-sm text-green-600">5 Active</span>
                </div>
                <p className="text-sm text-gray-500">Real-time monitoring agents</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Amazon Kinesis</span>
                  </div>
                  <span className="text-sm text-green-600">Streaming</span>
                </div>
                <p className="text-sm text-gray-500">Real-time data ingestion</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">TimeStream DB</span>
                  </div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                <p className="text-sm text-gray-500">Time-series data storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">Admin User</p>
                      <p className="text-sm text-gray-500">admin@company.com</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Administrator</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full">Active</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">2 minutes ago</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">IT Manager</p>
                      <p className="text-sm text-gray-500">manager@company.com</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">Manager</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full">Active</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">1 hour ago</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">Tech Support</p>
                      <p className="text-sm text-gray-500">support@company.com</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-sm rounded-full">Technician</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">Away</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">3 hours ago</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New User
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-green-600 text-2xl font-bold mb-1">Operational</div>
              <div className="text-sm text-gray-600">All systems running normally</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-blue-600 text-2xl font-bold mb-1">99.8%</div>
              <div className="text-sm text-gray-600">System uptime this month</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-purple-600 text-2xl font-bold mb-1">4 Agents</div>
              <div className="text-sm text-gray-600">AI agents active and monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
