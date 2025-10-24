'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface ToolTrace {
  tool_name: string;
  status: 'running' | 'completed' | 'failed';
  duration_ms?: number;
  startedAt?: string;
  finishedAt?: string;
  resultSummary?: string;
}

interface ActivityMetrics {
  totalRequests: number;
  avgResponseTime: number;
  toolInvocations: number;
  successRate: number;
}

interface AgentActivityProps {
  toolTraces?: ToolTrace[];
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ toolTraces = [] }) => {
  const [traces, setTraces] = useState<ToolTrace[]>(toolTraces);
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    totalRequests: 0,
    avgResponseTime: 0,
    toolInvocations: 0,
    successRate: 100,
  });

  useEffect(() => {
    setTraces(toolTraces);
    
    // Calculate metrics
    const completed = traces.filter((t) => t.status === 'completed');
    const totalDuration = completed.reduce((sum, t) => sum + (t.duration_ms || 0), 0);
    const avgTime = completed.length > 0 ? totalDuration / completed.length : 0;
    const successRate = traces.length > 0 
      ? (completed.length / traces.length) * 100 
      : 100;

    setMetrics({
      totalRequests: traces.length,
      avgResponseTime: Math.round(avgTime),
      toolInvocations: traces.length,
      successRate: Math.round(successRate),
    });
  }, [toolTraces, traces.length]);

  const addToolTrace = (trace: ToolTrace) => {
    setTraces((prev) => [trace, ...prev]);
  };

  // Expose method for parent components
  useEffect(() => {
    (window as any).__addToolTrace = addToolTrace;
    return () => {
      delete (window as any).__addToolTrace;
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Agent Activity</h2>
          <p className="text-sm text-gray-500">Real-time tool execution and metrics</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalRequests}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Avg Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.avgResponseTime}ms</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Tool Calls</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.toolInvocations}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
        </div>
      </div>

      {/* Tool Traces */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Tool Executions</h3>
        
        {traces.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>No tool executions yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {traces.map((trace, index) => (
              <div
                key={`${trace.tool_name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(trace.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{trace.tool_name}</p>
                    {trace.resultSummary && (
                      <p className="text-xs text-gray-600">{trace.resultSummary}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {trace.duration_ms !== undefined && (
                    <span className="text-xs text-gray-600">{trace.duration_ms}ms</span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(trace.status)}`}>
                    {trace.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

