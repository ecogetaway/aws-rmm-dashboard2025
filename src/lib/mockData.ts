// Mock data generator for the RMM dashboard demo

export interface ServerData {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'critical'
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  lastCheck: string
  location: string
  os: string
}

export interface AgentData {
  id: string
  name: string
  type: 'monitor' | 'incident' | 'predictive' | 'supervisor'
  status: 'active' | 'idle' | 'processing'
  requestsProcessed: number
  successRate: number
  averageResponseTime: number
  lastAction: string
  confidence: number
}

export interface IncidentData {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  assignedTo: 'ai_agent' | 'human'
  createdAt: string
  resolvedAt?: string
  description: string
  affectedSystems: string[]
  resolutionTime?: number
}

export interface AlertData {
  id: string
  type: 'anomaly' | 'threshold' | 'prediction' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  source: string
  timestamp: string
  acknowledged: boolean
}

export function generateMockData() {
  const servers: ServerData[] = [
    {
      id: 'srv-001',
      name: 'demo-server-1',
      status: 'healthy',
      cpu: 45.2,
      memory: 67.8,
      disk: 72.1,
      network: 15.4,
      uptime: '15d 4h 23m',
      lastCheck: '30s ago',
      location: 'us-east-1a',
      os: 'Ubuntu 22.04'
    },
    {
      id: 'srv-002',
      name: 'demo-server-2',
      status: 'warning',
      cpu: 78.9,
      memory: 84.3,
      disk: 45.6,
      network: 32.1,
      uptime: '8d 12h 45m',
      lastCheck: '25s ago',
      location: 'us-east-1b',
      os: 'Ubuntu 22.04'
    },
    {
      id: 'srv-003',
      name: 'demo-server-3',
      status: 'healthy',
      cpu: 23.7,
      memory: 41.2,
      disk: 58.9,
      network: 8.7,
      uptime: '22d 8h 15m',
      lastCheck: '20s ago',
      location: 'us-east-1c',
      os: 'Ubuntu 22.04'
    },
    {
      id: 'srv-004',
      name: 'demo-server-4',
      status: 'critical',
      cpu: 95.4,
      memory: 92.1,
      disk: 89.3,
      network: 78.5,
      uptime: '2d 6h 33m',
      lastCheck: '15s ago',
      location: 'us-west-2a',
      os: 'CentOS 8'
    },
    {
      id: 'srv-005',
      name: 'demo-server-5',
      status: 'healthy',
      cpu: 34.8,
      memory: 56.2,
      disk: 38.4,
      network: 12.9,
      uptime: '45d 2h 18m',
      lastCheck: '35s ago',
      location: 'us-west-2b',
      os: 'Ubuntu 22.04'
    }
  ]

  const agents: AgentData[] = [
    {
      id: 'agent-001',
      name: 'RMM Monitor',
      type: 'monitor',
      status: 'active',
      requestsProcessed: 1247,
      successRate: 98.7,
      averageResponseTime: 1.2,
      lastAction: 'Health check completed',
      confidence: 0.94
    },
    {
      id: 'agent-002',
      name: 'Incident Response',
      type: 'incident',
      status: 'processing',
      requestsProcessed: 89,
      successRate: 94.3,
      averageResponseTime: 4.7,
      lastAction: 'Analyzing high CPU alert',
      confidence: 0.87
    },
    {
      id: 'agent-003',
      name: 'Predictive Maintenance',
      type: 'predictive',
      status: 'idle',
      requestsProcessed: 156,
      successRate: 91.2,
      averageResponseTime: 12.3,
      lastAction: 'Disk capacity forecast',
      confidence: 0.92
    },
    {
      id: 'agent-004',
      name: 'Supervisor',
      type: 'supervisor',
      status: 'active',
      requestsProcessed: 234,
      successRate: 99.1,
      averageResponseTime: 0.8,
      lastAction: 'Orchestrating agents',
      confidence: 0.96
    }
  ]

  const incidents: IncidentData[] = [
    {
      id: 'inc-001',
      title: 'High CPU Usage on demo-server-4',
      severity: 'high',
      status: 'investigating',
      assignedTo: 'ai_agent',
      createdAt: '2024-09-19T14:23:15Z',
      description: 'CPU usage exceeded 90% threshold for more than 5 minutes',
      affectedSystems: ['demo-server-4']
    },
    {
      id: 'inc-002',
      title: 'Memory leak detected',
      severity: 'medium',
      status: 'resolved',
      assignedTo: 'ai_agent',
      createdAt: '2024-09-19T13:45:22Z',
      resolvedAt: '2024-09-19T13:52:18Z',
      description: 'Gradual memory increase detected in application process',
      affectedSystems: ['demo-server-2'],
      resolutionTime: 416 // seconds
    },
    {
      id: 'inc-003',
      title: 'Disk space warning',
      severity: 'low',
      status: 'resolved',
      assignedTo: 'ai_agent',
      createdAt: '2024-09-19T12:15:33Z',
      resolvedAt: '2024-09-19T12:18:45Z',
      description: 'Disk usage reached 85% on /var partition',
      affectedSystems: ['demo-server-1'],
      resolutionTime: 192
    },
    {
      id: 'inc-004',
      title: 'Network latency spike',
      severity: 'medium',
      status: 'closed',
      assignedTo: 'ai_agent',
      createdAt: '2024-09-19T11:30:12Z',
      resolvedAt: '2024-09-19T11:35:28Z',
      description: 'Increased network latency detected between regions',
      affectedSystems: ['demo-server-1', 'demo-server-3'],
      resolutionTime: 316
    }
  ]

  const alerts: AlertData[] = [
    {
      id: 'alert-001',
      type: 'threshold',
      severity: 'high',
      message: 'CPU usage above 90% on demo-server-4',
      source: 'demo-server-4',
      timestamp: '2024-09-19T14:23:15Z',
      acknowledged: false
    },
    {
      id: 'alert-002',
      type: 'anomaly',
      severity: 'medium',
      message: 'Unusual memory pattern detected',
      source: 'demo-server-2',
      timestamp: '2024-09-19T14:18:42Z',
      acknowledged: true
    },
    {
      id: 'alert-003',
      type: 'prediction',
      severity: 'low',
      message: 'Disk capacity will reach 90% in 7 days',
      source: 'demo-server-1',
      timestamp: '2024-09-19T14:10:30Z',
      acknowledged: true
    },
    {
      id: 'alert-004',
      type: 'security',
      severity: 'medium',
      message: 'Multiple failed login attempts detected',
      source: 'demo-server-3',
      timestamp: '2024-09-19T13:55:18Z',
      acknowledged: false
    }
  ]

  // Generate health data for charts
  const healthData = {
    timeline: Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() - (23 - i))
      return {
        time: hour.toISOString(),
        overall: Math.floor(Math.random() * 20) + 80, // 80-100%
        cpu: Math.floor(Math.random() * 40) + 30,     // 30-70%
        memory: Math.floor(Math.random() * 30) + 40,  // 40-70%
        disk: Math.floor(Math.random() * 20) + 30,    // 30-50%
        network: Math.floor(Math.random() * 15) + 10  // 10-25%
      }
    })
  }

  const overview = {
    totalServers: servers.length,
    healthyServers: servers.filter(s => s.status === 'healthy').length,
    activeIncidents: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
    averageResponseTime: '18s',
    costSavings: '$12.4k',
    automationRate: 92,
    mttrReduction: 87,
    agentsActive: agents.filter(a => a.status === 'active').length
  }

  return {
    overview,
    servers,
    agents,
    incidents,
    alerts,
    healthData
  }
}

// Real-time data updates for demo
export function updateMockData(currentData: any) {
  // Simulate real-time updates
  const now = new Date().toISOString()
  
  // Update server metrics with small random changes
  const updatedServers = currentData.servers.map((server: ServerData) => ({
    ...server,
    cpu: Math.max(0, Math.min(100, server.cpu + (Math.random() - 0.5) * 10)),
    memory: Math.max(0, Math.min(100, server.memory + (Math.random() - 0.5) * 5)),
    disk: Math.max(0, Math.min(100, server.disk + (Math.random() - 0.5) * 2)),
    network: Math.max(0, Math.min(100, server.network + (Math.random() - 0.5) * 8)),
    lastCheck: 'Just now'
  }))

  // Update agent activity
  const updatedAgents = currentData.agents.map((agent: AgentData) => ({
    ...agent,
    requestsProcessed: agent.requestsProcessed + Math.floor(Math.random() * 3),
    averageResponseTime: Math.max(0.1, agent.averageResponseTime + (Math.random() - 0.5) * 0.5)
  }))

  return {
    ...currentData,
    servers: updatedServers,
    agents: updatedAgents,
    lastUpdate: now
  }
}
