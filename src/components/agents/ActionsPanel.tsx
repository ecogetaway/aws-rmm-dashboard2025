'use client';

import React, { useState } from 'react';
import { PlayCircle, XCircle, CheckCircle, AlertTriangle, Wand2 } from 'lucide-react';
import { handleAgentAction } from '@/lib/agentApi';

export interface ActionProposal {
  actionId: string;
  type: 'remediation' | 'config_change' | 'restart' | 'update';
  target: string;
  rationale: string;
  risk: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed';
  proposedAt: string;
}

interface ActionsPanelProps {
  actions?: ActionProposal[];
  onActionUpdate?: (actionId: string, newStatus: string) => void;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({ 
  actions: initialActions = [], 
  onActionUpdate 
}) => {
  const [actions, setActions] = useState<ActionProposal[]>(initialActions);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const handleApprove = async (actionId: string) => {
    setProcessingAction(actionId);
    
    try {
      const result = await handleAgentAction({
        actionId,
        approve: true,
      });

      // Update action status
      setActions((prev) =>
        prev.map((action) =>
          action.actionId === actionId
            ? { ...action, status: 'approved' as const }
            : action
        )
      );

      onActionUpdate?.(actionId, 'approved');
    } catch (error) {
      console.error('Failed to approve action:', error);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (actionId: string) => {
    setProcessingAction(actionId);
    
    try {
      const result = await handleAgentAction({
        actionId,
        approve: false,
      });

      // Update action status
      setActions((prev) =>
        prev.map((action) =>
          action.actionId === actionId
            ? { ...action, status: 'rejected' as const }
            : action
        )
      );

      onActionUpdate?.(actionId, 'rejected');
    } catch (error) {
      console.error('Failed to reject action:', error);
    } finally {
      setProcessingAction(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Pending Review</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Approved
        </span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </span>;
      case 'executing':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
          <PlayCircle className="w-3 h-3 animate-pulse" /> Executing
        </span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const pendingActions = actions.filter((a) => a.status === 'pending');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Autonomous Actions</h2>
          <p className="text-sm text-gray-500">
            {pendingActions.length} action{pendingActions.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>
      </div>

      {/* Actions List */}
      {actions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p>No proposed actions yet</p>
          <p className="text-xs mt-1">AI agent will suggest remediation actions here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {actions.map((action) => (
            <div
              key={action.actionId}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{action.type.replace('_', ' ').toUpperCase()}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskColor(action.risk)}`}>
                      {action.risk} risk
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{action.target}</p>
                </div>
                {getStatusBadge(action.status)}
              </div>

              {/* Rationale */}
              <div className="mb-3">
                <p className="text-sm text-gray-700">{action.rationale}</p>
              </div>

              {/* Actions */}
              {action.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(action.actionId)}
                    disabled={processingAction === action.actionId}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label={`Approve action ${action.actionId}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(action.actionId)}
                    disabled={processingAction === action.actionId}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label={`Reject action ${action.actionId}`}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-3 text-xs text-gray-500">
                Proposed: {new Date(action.proposedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

