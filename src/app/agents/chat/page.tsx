'use client';

import React, { useState } from 'react';
import { AgentChat } from '@/components/agents/AgentChat';
import { AgentActivity } from '@/components/agents/AgentActivity';
import { ActionsPanel, ActionProposal } from '@/components/agents/ActionsPanel';

interface ToolTrace {
  tool_name: string;
  status: 'running' | 'completed' | 'failed';
  duration_ms?: number;
  startedAt?: string;
  finishedAt?: string;
  resultSummary?: string;
}

export default function AgentChatPage() {
  const [toolTraces, setToolTraces] = useState<ToolTrace[]>([]);
  const [actions, setActions] = useState<ActionProposal[]>([
    // Demo action for Phase 1
    {
      actionId: 'action-001',
      type: 'remediation',
      target: 'i-0123456789abcdef0 (server-web-01)',
      rationale: 'High CPU utilization detected (92%). Recommending service restart to clear memory leak.',
      risk: 'low',
      status: 'pending',
      proposedAt: new Date().toISOString(),
    },
  ]);

  const handleToolTrace = (trace: any) => {
    const newTrace: ToolTrace = {
      tool_name: trace.tool_name || 'unknown',
      status: trace.status || 'completed',
      duration_ms: trace.duration_ms || 0,
      startedAt: trace.startedAt,
      finishedAt: trace.finishedAt,
      resultSummary: trace.resultSummary,
    };

    setToolTraces((prev) => [newTrace, ...prev]);
  };

  const handleActionUpdate = (actionId: string, newStatus: string) => {
    console.log(`Action ${actionId} updated to ${newStatus}`);
    
    // Simulate execution after approval
    if (newStatus === 'approved') {
      setTimeout(() => {
        setActions((prev) =>
          prev.map((action) =>
            action.actionId === actionId
              ? { ...action, status: 'executing' as const }
              : action
          )
        );

        setTimeout(() => {
          setActions((prev) =>
            prev.map((action) =>
              action.actionId === actionId
                ? { ...action, status: 'completed' as const }
                : action
            )
          );
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Demo Mode Banner */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">ℹ️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Frontend Demo Mode - Backend Optional
              </h3>
              <p className="text-sm text-blue-800">
                This console works standalone with intelligent demo responses. For live agent interactions with real tool execution, 
                start the backend: <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">./start-backend.sh</code>
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Console</h1>
          <p className="text-gray-600">
            Interact with the AI agent, monitor tool executions, and approve autonomous actions
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat - Left Column (2/3 width) */}
          <div className="lg:col-span-2 h-[600px]">
            <AgentChat 
              clientId="demo-client-001" 
              onToolTrace={handleToolTrace}
            />
          </div>

          {/* Right Column - Activity & Actions */}
          <div className="space-y-6">
            <AgentActivity toolTraces={toolTraces} />
            <ActionsPanel actions={actions} onActionUpdate={handleActionUpdate} />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">🚀 Multi-Agent Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Orchestrator with intelligent routing</li>
              <li>✓ Monitoring agent (health checks, metrics)</li>
              <li>✓ Real-time tool execution traces</li>
            </ul>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Autonomous action proposals</li>
              <li>✓ Human-in-the-loop approval workflow</li>
              <li>✓ CloudWatch, EC2, SSM integration ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

