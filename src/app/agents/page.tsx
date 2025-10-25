import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bot, Brain, Shield, TrendingUp, Activity, Clock, Zap, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

const AgentsPage = () => {
  const agents = [
    {
      id: 'supervisor',
      name: 'Supervisor Agent',
      type: 'Orchestration',
      status: 'active',
      description: 'Coordinates and manages all RMM AI agents for optimal system performance',
      capabilities: ['Multi-agent coordination', 'Priority management', 'Escalation handling'],
      metrics: {
        tasksCompleted: 1247,
        avgResponseTime: '2.3s',
        successRate: '98.5%',
        currentTasks: 3
      },
      lastActivity: '30 seconds ago',
      model: 'Claude 3.5 Sonnet',
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: 'monitor',
      name: 'RMM Monitor Agent',
      type: 'Monitoring',
      status: 'active',
      description: 'Real-time system monitoring with predictive analytics and anomaly detection',
      capabilities: ['Real-time monitoring', 'Anomaly detection', 'Predictive analytics'],
      metrics: {
        tasksCompleted: 2843,
        avgResponseTime: '1.1s',
        successRate: '99.2%',
        currentTasks: 8
      },
      lastActivity: '15 seconds ago',
      model: 'Claude 3.5 Haiku',
      icon: <Activity className="w-6 h-6" />
    },
    {
      id: 'incident',
      name: 'Incident Response Agent',
      type: 'Response',
      status: 'processing',
      description: 'Autonomous incident detection, analysis, and resolution with minimal human intervention',
      capabilities: ['Incident detection', 'Root cause analysis', 'Auto-remediation'],
      metrics: {
        tasksCompleted: 892,
        avgResponseTime: '4.7s',
        successRate: '96.8%',
        currentTasks: 2
      },
      lastActivity: '1 minute ago',
      model: 'Claude 3.5 Sonnet',
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'predictive',
      name: 'Predictive Maintenance Agent',
      type: 'Prediction',
      status: 'active',
      description: 'Proactive maintenance scheduling and failure prediction using machine learning',
      capabilities: ['Failure prediction', 'Maintenance scheduling', 'Resource optimization'],
      metrics: {
        tasksCompleted: 456,
        avgResponseTime: '8.2s',
        successRate: '94.7%',
        currentTasks: 1
      },
      lastActivity: '3 minutes ago',
      model: 'Claude 3.5 Sonnet',
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'idle': return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const agentNetwork = [
    { from: 'supervisor', to: 'monitor', label: 'Monitor Tasks' },
    { from: 'supervisor', to: 'incident', label: 'Incident Alerts' },
    { from: 'supervisor', to: 'predictive', label: 'Predictions' },
    { from: 'monitor', to: 'incident', label: 'Anomalies' },
    { from: 'incident', to: 'predictive', label: 'Patterns' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agent Network</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your autonomous AI agents powered by Amazon Bedrock</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/agents/chat"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat with Agents</span>
            </Link>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Active Agents</span>
              <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Total Tasks</span>
              <p className="text-2xl font-bold text-blue-600">{agents.reduce((acc, a) => acc + a.metrics.currentTasks, 0)}</p>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
              {/* Agent Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      {agent.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.type} • {agent.model}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    {agent.status}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{agent.description}</p>
              </div>

              {/* Agent Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{agent.metrics.tasksCompleted.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Tasks Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{agent.metrics.avgResponseTime}</p>
                    <p className="text-sm text-gray-500">Avg Response</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{agent.metrics.successRate}</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{agent.metrics.currentTasks}</p>
                    <p className="text-sm text-gray-500">Current Tasks</p>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex justify-between items-center">
                  <span>Last activity: {agent.lastActivity}</span>
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Network Visualization */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Agent Communication Network</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                {/* Supervisor Agent - Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-600 text-white p-4 rounded-full">
                    <Brain className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">Supervisor</p>
                </div>

                {/* Monitor Agent - Top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-600 text-white p-3 rounded-full">
                    <Activity className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">Monitor</p>
                </div>

                {/* Incident Agent - Right */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                  <div className="bg-red-600 text-white p-3 rounded-full">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">Incident</p>
                </div>

                {/* Predictive Agent - Bottom */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white p-3 rounded-full">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">Predictive</p>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                     refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                    </marker>
                  </defs>
                  
                  {/* Supervisor to Monitor */}
                  <line x1="200" y1="150" x2="200" y2="80" stroke="#6B7280" strokeWidth="2" 
                        markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
                  
                  {/* Supervisor to Incident */}
                  <line x1="200" y1="150" x2="320" y2="150" stroke="#6B7280" strokeWidth="2" 
                        markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
                  
                  {/* Supervisor to Predictive */}
                  <line x1="200" y1="150" x2="200" y2="220" stroke="#6B7280" strokeWidth="2" 
                        markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
                  
                  {/* Monitor to Incident */}
                  <line x1="220" y1="80" x2="300" y2="130" stroke="#6B7280" strokeWidth="1" 
                        markerEnd="url(#arrowhead)" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Multi-Agent Coordination</h4>
              <p className="text-sm text-blue-700">Agents collaborate seamlessly to handle complex scenarios</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Real-time Communication</h4>
              <p className="text-sm text-green-700">Instant data sharing and task delegation between agents</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Autonomous Operation</h4>
              <p className="text-sm text-purple-700">Minimal human intervention with intelligent escalation</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Agent Performance Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">97.8%</p>
              <p className="text-sm text-gray-600">Overall Success Rate</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">3.1s</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">5,438</p>
              <p className="text-sm text-gray-600">Tasks Today</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">$12.4k</p>
              <p className="text-sm text-gray-600">Cost Savings</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
