import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { TrendingUp, DollarSign, Clock, Zap, Shield, Activity, Users, Server, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

const AnalyticsPage = () => {
  // Mock data for charts
  const performanceData = [
    { month: 'Jan', incidents: 45, resolved: 42, mttr: 28 },
    { month: 'Feb', incidents: 38, resolved: 36, mttr: 25 },
    { month: 'Mar', incidents: 32, resolved: 31, mttr: 22 },
    { month: 'Apr', incidents: 28, resolved: 27, mttr: 18 },
    { month: 'May', incidents: 22, resolved: 22, mttr: 15 },
    { month: 'Jun', incidents: 18, resolved: 18, mttr: 12 }
  ];

  const costSavingsData = [
    { month: 'Jan', manual: 8500, ai: 11200, savings: 2700 },
    { month: 'Feb', manual: 7200, ai: 10800, savings: 3600 },
    { month: 'Mar', manual: 6800, ai: 12100, savings: 5300 },
    { month: 'Apr', manual: 5900, ai: 11900, savings: 6000 },
    { month: 'May', manual: 4800, ai: 13200, savings: 8400 },
    { month: 'Jun', manual: 3200, ai: 15600, savings: 12400 }
  ];

  const incidentCategoryData = [
    { name: 'Performance', value: 40, color: '#3B82F6' },
    { name: 'Infrastructure', value: 25, color: '#10B981' },
    { name: 'Security', value: 20, color: '#F59E0B' },
    { name: 'Database', value: 15, color: '#EF4444' }
  ];

  const agentPerformanceData = [
    { agent: 'Monitor', tasks: 2843, success: 99.2, response: 1.1 },
    { agent: 'Incident', tasks: 892, success: 96.8, response: 4.7 },
    { agent: 'Predictive', tasks: 456, success: 94.7, response: 8.2 },
    { agent: 'Supervisor', tasks: 1247, success: 98.5, response: 2.3 }
  ];

  const systemHealthData = [
    { time: '00:00', cpu: 45, memory: 62, network: 78 },
    { time: '04:00', cpu: 52, memory: 58, network: 82 },
    { time: '08:00', cpu: 68, memory: 71, network: 85 },
    { time: '12:00', cpu: 84, memory: 79, network: 88 },
    { time: '16:00', cpu: 92, memory: 85, network: 91 },
    { time: '20:00', cpu: 76, memory: 73, network: 86 }
  ];

  const kpis = [
    {
      title: 'MTTR Reduction',
      value: '87%',
      change: '+23%',
      trend: 'up',
      icon: <Clock className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Cost Savings',
      value: '$12.4k',
      change: '+$3.8k',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Auto Resolution',
      value: '60%',
      change: '+15%',
      trend: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Security Score',
      value: '94.8',
      change: '+2.1',
      trend: 'up',
      icon: <Shield className="w-6 h-6" />,
      color: 'orange'
    }
  ];

  const getKpiColor = (color: string) => {
    const colors = {
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-2">Advanced analytics powered by AI to optimize your RMM operations</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
              Schedule Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getKpiColor(kpi.color)}`}>
                  {kpi.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-green-600">{kpi.change} vs last month</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
            </div>
          ))}
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trends */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Incident Resolution Trends</h3>
            </div>
            <div className="h-[300px] flex items-end justify-between gap-4 border-b border-l pl-8 pb-4">
              {performanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1">
                    <div 
                      className="bg-red-500 w-6 rounded-t"
                      style={{ height: `${data.incidents * 4}px` }}
                    ></div>
                    <div 
                      className="bg-green-500 w-6 rounded-t"
                      style={{ height: `${data.resolved * 4}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Total Incidents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Resolved</span>
              </div>
            </div>
          </div>

          {/* MTTR Improvement */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <LineChartIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">MTTR Improvement</h3>
            </div>
            <div className="h-[300px] relative border-b border-l">
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  points="50,250 100,200 150,180 200,140 250,120 300,95"
                />
                {performanceData.map((data, index) => (
                  <circle
                    key={index}
                    cx={50 + index * 50}
                    cy={300 - (data.mttr * 8)}
                    r="4"
                    fill="#10B981"
                  />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
                {performanceData.map((data, index) => (
                  <span key={index} className="text-xs text-gray-600">{data.month}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>MTTR (minutes)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cost Savings Analysis</h3>
          </div>
          <div className="h-[300px] flex items-end justify-between gap-4 border-b border-l pl-8 pb-4">
            {costSavingsData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center w-8">
                  <div 
                    className="bg-green-500 w-full"
                    style={{ height: `${data.savings / 100}px` }}
                  ></div>
                  <div 
                    className="bg-red-500 w-full"
                    style={{ height: `${data.manual / 100}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Manual Costs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>AI Savings</span>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Categories */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChartIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Incident Categories</h3>
            </div>
            <div className="h-[250px] flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="20"
                    strokeDasharray="175.92 263.88"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="20"
                    strokeDasharray="109.95 329.85"
                    strokeDashoffset="-175.92"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="20"
                    strokeDasharray="87.96 351.84"
                    strokeDashoffset="-285.87"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="20"
                    strokeDasharray="65.97 373.83"
                    strokeDashoffset="-373.83"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {incidentCategoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: category.color }}></div>
                  <span>{category.name} ({category.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Agent Performance</h3>
            </div>
            <div className="space-y-4">
              {agentPerformanceData.map((agent, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{agent.agent} Agent</span>
                    <span className="text-sm text-gray-500">{agent.tasks} tasks</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="ml-2 font-medium text-green-600">{agent.success}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Response:</span>
                      <span className="ml-2 font-medium text-blue-600">{agent.response}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Trends */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">24-Hour System Health Trends</h3>
          </div>
          <div className="h-[300px] relative border-b border-l">
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points="50,200 100,180 150,120 200,80 250,60 300,90"
              />
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points="50,170 100,160 150,100 200,70 250,50 300,80"
              />
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                points="50,140 100,130 150,110 200,90 250,70 300,100"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
              {systemHealthData.map((data, index) => (
                <span key={index} className="text-xs text-gray-600">{data.time}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>CPU %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Memory %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Network %</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Performance Prediction</h4>
              <p className="text-sm text-gray-600">Based on current trends, expect 35% fewer incidents next month with continued AI optimization.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💰 Cost Optimization</h4>
              <p className="text-sm text-gray-600">Potential to save additional $4.2k by implementing predictive maintenance for backup systems.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🚀 Efficiency Gains</h4>
              <p className="text-sm text-gray-600">Monitor Agent achieving 99.2% success rate suggests expansion to additional system monitoring.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
