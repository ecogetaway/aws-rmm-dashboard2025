/**
 * Agent API client for REST and WebSocket communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8080';

export interface InvokeAgentRequest {
  prompt: string;
  clientId?: string;
  context?: Record<string, any>;
}

export interface InvokeAgentResponse {
  sessionId: string;
  requestId: string;
  status: string;
  result?: any;
}

export interface ActionRequest {
  actionId: string;
  approve: boolean;
  comment?: string;
}

export interface ActionResponse {
  actionId: string;
  status: 'approved' | 'rejected';
  comment?: string;
  processed_at: string;
}

export interface StreamMessage {
  type: 'token' | 'tool' | 'event' | 'complete' | 'error';
  data: any;
  timestamp: string;
}

/**
 * Invoke the agent with a prompt (REST API)
 */
export const invokeAgent = async (
  request: InvokeAgentRequest
): Promise<InvokeAgentResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/agent/invoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to invoke agent');
  }

  return response.json();
};

/**
 * Approve or reject an agent action
 */
export const handleAgentAction = async (
  request: ActionRequest
): Promise<ActionResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/agent/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to handle action');
  }

  return response.json();
};

/**
 * Get session details
 */
export const getSession = async (sessionId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/agent/session/${sessionId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get session');
  }

  return response.json();
};

/**
 * Create WebSocket connection for streaming agent responses
 */
export const createAgentStream = (
  onMessage: (message: StreamMessage) => void,
  onError?: (error: Error) => void,
  onClose?: () => void
): WebSocket => {
  const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');
  
  try {
    const ws = new WebSocket(`${wsUrl}/ws/agent/stream`);

    ws.onmessage = (event) => {
      try {
        const message: StreamMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        // Silent parsing error - invalid message format
      }
    };

    ws.onerror = (event) => {
      // Suppress console error - backend unavailable is expected in demo mode
      const error = new Error('Backend unavailable');
      onError?.(error);
    };

    ws.onclose = () => {
      // Silent close - normal when backend is offline
      onClose?.();
    };

    return ws;
  } catch (error) {
    // If WebSocket creation fails, call error handler immediately
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to create WebSocket'));
    }
    // Return a dummy WebSocket object to prevent crashes
    return {
      readyState: WebSocket.CLOSED,
      close: () => {},
      send: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      url: '',
      protocol: '',
      extensions: '',
      bufferedAmount: 0,
      binaryType: 'blob' as BinaryType,
      onopen: null,
      onerror: null,
      onclose: null,
      onmessage: null,
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED,
    } as WebSocket;
  }
};

/**
 * Send a message through an existing WebSocket connection
 */
export const sendStreamMessage = (
  ws: WebSocket,
  request: InvokeAgentRequest
): void => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(request));
  } else {
    console.error('WebSocket is not open');
  }
};

