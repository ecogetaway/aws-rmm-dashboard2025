import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AlertTriangle, Clock, CheckCircle, Zap, Bot, TrendingDown, User, Calendar } from 'lucide-react';

const IncidentsPage = () => {
  const incidents = [
    {
      id: 'INC-2024-001',
      title: 'High CPU Usage on Production Server',
      description: 'Server srv-003 experiencing sustained high CPU usage above 90%',
      severity: 'high',
      status: 'resolved',
      createdAt: '2024-01-15T10:30:00Z',
      resolvedAt: '2024-01-15T10:47:00Z',
      assignee: 'AI Agent',
      affectedSystems: ['Production Web Server', 'Load Balancer'],
      resolution: 'Auto-scaled instances and optimized database queries',
      category: 'Performance',
      aiResolved: true,
      mttr: '17 minutes'
    },
    {
      id: 'INC-2024-002', 
      title: 'Database Connection Pool Exhaustion',
      description: 'Primary database experiencing connection pool exhaustion during peak hours',
      severity: 'critical',
      status: 'in_progress',
      createdAt: '2024-01-15T09:15:00Z',
      resolvedAt: null,
      assignee: 'Incident Response Agent',
      affectedSystems: ['Database Primary', 'API Gateway'],
      resolution: 'Increasing connection pool size and implementing connection recycling',
      category: 'Database',
      aiResolved: false,
      mttr: 'In progress'
    },
    {
      id: 'INC-2024-003',
      title: 'Backup Server Offline',
      description: 'Backup server srv-005 has been offline for 2 hours, failover activated',
      severity: 'medium',
      status: 'resolved',
      createdAt: '2024-01-15T08:00:00Z',
      resolvedAt: '2024-01-15T08:12:00Z',
      assignee: 'AI Agent',
      affectedSystems: ['Backup Server'],
      resolution: 'Hardware replacement scheduled, secondary backup activated',
      category: 'Infrastructure',
      aiResolved: true,
      mttr: '12 minutes'
    },
    {
      id: 'INC-2024-004',
      title: 'SSL Certificate Expiring Soon',
      description: 'SSL certificate for api.company.com expires in 7 days',
      severity: 'low',
      status: 'open',
      createdAt: '2024-01-15T07:30:00Z',
      resolvedAt: null,
      assignee: 'Predictive Maintenance Agent',
      affectedSystems: ['API Gateway'],
      resolution: 'Certificate renewal in progress via automated process',
      category: 'Security',
      aiResolved: false,
      mttr: 'Scheduled'
    },
    {
      id: 'INC-2024-005',
      title: 'Unusual Network Traffic Pattern',
      description: 'Anomalous traffic pattern detected from IP range 192.168.1.0/24',
      severity: 'medium',
      status: 'investigating',
      createdAt: '2024-01-15T06:45:00Z',
      resolvedAt: null,
      assignee: 'Security Agent',
      affectedSystems: ['Firewall', 'Network Monitoring'],
      resolution: 'Analyzing traffic patterns and implementing temporary rate limiting',
      category: 'Security',
      aiResolved: false,
      mttr: 'Investigating'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'investigating': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'open': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'investigating': return <Zap className="w-4 h-4" />;
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return 'Ongoing';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minutes`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incident Management</h1>
            <p className="text-gray-600 mt-2">AI-powered incident detection, analysis, and resolution</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Total Incidents</span>
              <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">AI Resolved</span>
              <p className="text-2xl font-bold text-green-600">{incidents.filter(i => i.aiResolved).length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow border">
              <span className="text-sm text-gray-500">Open</span>
              <p className="text-2xl font-bold text-orange-600">{incidents.filter(i => i.status !== 'resolved').length}</p>
            </div>
          </div>
        </div>

        {/* AI Performance Banner */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 AI-Powered Resolution Success</h3>
              <p className="text-green-100">60% of incidents automatically resolved by AI agents</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">87%</p>
              <p className="text-green-100">MTTR Reduction</p>
            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Incident Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">{incident.id}</span>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(incident.severity)}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {incident.severity}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(incident.status)}`}>
                        {getStatusIcon(incident.status)}
                        {incident.status.replace('_', ' ')}
                      </div>
                      {incident.aiResolved && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200">
                          <Bot className="w-3 h-3" />
                          AI Resolved
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{incident.title}</h3>
                    <p className="text-gray-600 text-sm">{incident.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>MTTR: {incident.mttr}</p>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Assigned To</span>
                    </div>
                    <p className="text-sm text-gray-600">{incident.assignee}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Created</span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(incident.createdAt)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <p className="text-sm text-gray-600">{calculateDuration(incident.createdAt, incident.resolvedAt)}</p>
                  </div>
                </div>

                {/* Affected Systems */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Affected Systems</h4>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedSystems.map((system, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {system}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Resolution</h4>
                  <p className="text-sm text-gray-600">{incident.resolution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analytics Panel */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Incident Analytics & Trends</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-green-600">87%</p>
                <p className="text-sm text-gray-600">MTTR Reduction</p>
                <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-blue-600">14.3m</p>
                <p className="text-sm text-gray-600">Avg Resolution Time</p>
                <p className="text-xs text-gray-500 mt-1">AI-assisted incidents</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-purple-600">60%</p>
                <p className="text-sm text-gray-600">Auto-Resolution Rate</p>
                <p className="text-xs text-gray-500 mt-1">No human intervention</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-orange-600">$12.4k</p>
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Top Incident Categories</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Infrastructure</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Security</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">AI Agent Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monitor Agent</span>
                  <span className="text-sm font-medium text-green-600">99.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Incident Response</span>
                  <span className="text-sm font-medium text-green-600">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Predictive Agent</span>
                  <span className="text-sm font-medium text-green-600">94.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supervisor Agent</span>
                  <span className="text-sm font-medium text-green-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidentsPage;
