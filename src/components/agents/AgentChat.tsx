'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { invokeAgent, createAgentStream, sendStreamMessage, StreamMessage } from '@/lib/agentApi';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  metadata?: {
    sessionId?: string;
    toolsUsed?: string[];
    status?: string;
  };
}

interface AgentChatProps {
  clientId?: string;
  onToolTrace?: (trace: any) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ clientId, onToolTrace }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStreamMessage = (streamMessage: StreamMessage) => {
    switch (streamMessage.type) {
      case 'token':
        streamingMessageRef.current += ` ${streamMessage.data.content}`;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'agent') {
            lastMessage.content = streamingMessageRef.current;
          }
          return newMessages;
        });
        break;

      case 'tool':
        onToolTrace?.(streamMessage.data);
        break;

      case 'complete':
        setIsStreaming(false);
        setIsLoading(false);
        // Update final message with complete result
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'agent') {
            lastMessage.content = JSON.stringify(streamMessage.data.result, null, 2);
            lastMessage.metadata = {
              ...lastMessage.metadata,
              status: 'completed',
            };
          }
          return newMessages;
        });
        break;

      case 'error':
        setIsStreaming(false);
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'agent',
            content: `Error: ${streamMessage.data.message}`,
            timestamp: new Date(),
            metadata: { status: 'error' },
          },
        ]);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userPrompt = input;
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    // Create placeholder agent message
    const agentMessageId = `agent-${Date.now()}`;
    streamingMessageRef.current = '';
    setMessages((prev) => [
      ...prev,
      {
        id: agentMessageId,
        role: 'agent',
        content: '',
        timestamp: new Date(),
        metadata: { status: 'streaming' },
      },
    ]);

    try {
      // Create WebSocket connection
      const ws = createAgentStream(
        handleStreamMessage,
        (error) => {
          // Silently fall back to demo mode - backend unavailable is expected
          console.info('Backend unavailable, using demo mode');
          setIsStreaming(false);
          setIsLoading(false);
          
          // Fallback to demo mode if backend unavailable
          handleDemoResponse(userPrompt);
        },
        () => {
          setIsStreaming(false);
        }
      );

      wsRef.current = ws;

      // Connection timeout fallback
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket connection timeout, using demo mode');
          ws.close();
          handleDemoResponse(userPrompt);
        }
      }, 2000);

      // Wait for connection to open
      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        sendStreamMessage(ws, {
          prompt: userPrompt,
          clientId,
        });
      };

      // Handle connection errors - silently fall back to demo mode
      ws.onerror = () => {
        clearTimeout(connectionTimeout);
        // Suppress error display - demo mode is expected when backend is offline
        console.info('Backend unavailable, using demo mode');
        handleDemoResponse(userPrompt);
      };
    } catch (error) {
      // Suppress error display - demo mode is expected when backend is offline
      console.info('Backend unavailable, using demo mode');
      handleDemoResponse(userPrompt);
    }
  };

  const handleDemoResponse = (prompt: string) => {
    setIsLoading(false);
    setIsStreaming(false);

    // Generate demo response based on prompt
    const demoResponse = generateDemoResponse(prompt);
    
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === 'agent') {
        lastMessage.content = demoResponse;
        lastMessage.metadata = { status: 'completed' };
      }
      return newMessages;
    });

    // Simulate tool traces
    if (onToolTrace) {
      setTimeout(() => {
        onToolTrace({ tool_name: 'query_client_inventory', status: 'completed', duration_ms: 245 });
      }, 300);
      setTimeout(() => {
        onToolTrace({ tool_name: 'analyze_cloudwatch_metrics', status: 'completed', duration_ms: 312 });
      }, 600);
    }
  };

  const generateDemoResponse = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('health') || promptLower.includes('check') || promptLower.includes('status')) {
      return `🔍 Health Check Results (Demo Mode - Backend Offline)

✅ **Monitoring Agent Analysis Complete**

**Inventory Summary:**
• Total instances: 5
• Running: 5
• Stopped: 0

**CloudWatch Metrics (Last 1 hour):**
• CPUUtilization: 87.3% (Warning - approaching threshold)
• MemoryUtilization: 76.2% (Normal)
• NetworkIn: 15.2 MB/s (Normal)

**Anomalies Detected:** 1
⚠️ High CPU utilization on i-0a1b2c3d4e5f (server-web-01)

**Recommendation:**
Proactive remediation recommended. Consider service restart or resource scaling.

**Tools Used:**
✓ query_client_inventory
✓ analyze_cloudwatch_metrics

**Note:** This is a demo response. Connect backend API for live agent interactions.`;
    }
    
    if (promptLower.includes('incident') || promptLower.includes('issue') || promptLower.includes('problem')) {
      return `📋 Recent Incidents (Demo Mode)

**Active Incidents:** 2
**Resolved Today:** 8

**Priority Incidents:**
1. 🔴 Critical - Database connection timeout (server-db-01)
2. 🟡 Warning - Disk space at 85% (server-app-03)

**Recommendation:** Incident Response Agent would analyze root causes and propose automated fixes.

**Note:** This is a demo response. Connect backend API for live agent interactions.`;
    }
    
    if (promptLower.includes('security') || promptLower.includes('audit') || promptLower.includes('compliance')) {
      return `🔒 Security Audit Summary (Demo Mode)

**Compliance Status:** 94% compliant

**Findings:**
✅ 12 security groups reviewed
⚠️ 2 instances with public IP exposure
✅ All systems patched within 30 days
⚠️ 1 S3 bucket with open permissions

**Recommendation:** Compliance Agent would generate detailed remediation plan.

**Note:** This is a demo response. Connect backend API for live agent interactions.`;
    }
    
    // Default response
    return `🤖 AI Agent Response (Demo Mode - Backend Offline)

I received your request: "${prompt}"

**Orchestrator Routing:** This query would be routed to the appropriate specialist agent.

**Phase 1 Capabilities:**
• Health monitoring and CloudWatch analysis
• EC2 inventory management
• Automated remediation via SSM
• Multi-agent orchestration

**To See Live Agent Responses:**
Start the backend with: \`./start-backend.sh\`

**Note:** This is a demo response showing UI functionality. Connect the backend API at http://localhost:8080 for real agent interactions with tool execution, streaming tokens, and autonomous actions.`;
  };

  const suggestedPrompts = [
    'Check health status',
    'Show recent incidents',
    'Analyze CPU usage',
    'List active servers',
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <Bot className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Agent Chat</h2>
          <p className="text-sm text-gray-500">Ask questions about your infrastructure</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Start a conversation with the AI agent</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label={`Use suggested prompt: ${prompt}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
              {message.metadata?.status === 'streaming' && (
                <Loader2 className="w-4 h-4 animate-spin mt-2" />
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI agent..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="Agent chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

