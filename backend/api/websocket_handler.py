"""WebSocket handler for streaming agent responses"""
from flask_sock import Sock
import json
import asyncio
from typing import Dict, Any
from datetime import datetime

class WebSocketHandler:
    """Handles WebSocket connections for streaming agent output"""
    
    def __init__(self, app, orchestrator):
        """
        Initialize WebSocket handler
        
        Args:
            app: Flask application instance
            orchestrator: OrchestratorAgent instance
        """
        self.sock = Sock(app)
        self.orchestrator = orchestrator
        self._register_routes()
    
    def _register_routes(self):
        """Register WebSocket routes"""
        @self.sock.route('/ws/agent/stream')
        def stream_agent(ws):
            """
            WebSocket endpoint for streaming agent responses
            
            Client sends:
            {
                "prompt": string,
                "clientId": string (optional),
                "context": object (optional)
            }
            
            Server streams:
            {
                "type": "token" | "tool" | "event" | "complete" | "error",
                "data": object,
                "timestamp": string
            }
            """
            try:
                # Receive initial message
                message = ws.receive()
                
                if not message:
                    self._send_error(ws, "No message received")
                    return
                
                data = json.loads(message)
                prompt = data.get('prompt')
                client_id = data.get('clientId')
                context = data.get('context', {})
                
                if not prompt:
                    self._send_error(ws, "Missing 'prompt' in message")
                    return
                
                # Send start event
                self._send_event(ws, "event", {
                    "message": "Agent processing started",
                    "prompt": prompt,
                    "client_id": client_id
                })
                
                # Stream from orchestrator (real Bedrock streaming)
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                # Use invoke_stream for real-time streaming
                stream = loop.run_until_complete(
                    self._process_stream(
                        ws=ws,
                        prompt=prompt,
                        client_id=client_id,
                        context=context
                    )
                )
                
                loop.close()
            
            except json.JSONDecodeError:
                self._send_error(ws, "Invalid JSON in message")
            except Exception as e:
                self._send_error(ws, str(e))
    
    def _send_event(self, ws, event_type: str, data: Dict[str, Any]):
        """Send a structured event to the WebSocket client"""
        message = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        ws.send(json.dumps(message))
    
    def _send_error(self, ws, error_message: str):
        """Send an error event to the WebSocket client"""
        self._send_event(ws, "error", {"message": error_message})
    
    async def _process_stream(self, ws, prompt: str, client_id: str, context: Dict[str, Any]):
        """
        Process streaming response from orchestrator
        """
        try:
            # Get streaming generator from orchestrator
            stream_generator = self.orchestrator.invoke_stream(
                prompt=prompt,
                client_id=client_id,
                context=context
            )
            
            # Process each event from the stream
            async for event in stream_generator:
                event_type = event.get('type')
                
                if event_type == 'token':
                    # Stream content tokens
                    self._send_event(ws, 'token', {
                        'content': event.get('content', '')
                    })
                
                elif event_type == 'tool' or event_type == 'tool_use_start':
                    # Notify about tool execution
                    self._send_event(ws, 'tool', {
                        'tool_name': event.get('tool_name') or event.get('data', {}).get('tool_name'),
                        'status': event.get('status') or event.get('data', {}).get('status', 'running')
                    })
                
                elif event_type == 'routing':
                    # Send routing information
                    self._send_event(ws, 'event', {
                        'message': f"Routed to {event.get('data', {}).get('routed_to')} agent",
                        'routed_to': event.get('data', {}).get('routed_to')
                    })
                
                elif event_type == 'metadata':
                    # Send metadata about the response
                    self._send_event(ws, 'metadata', event.get('data', {}))
                
                elif event_type == 'complete':
                    # Send completion event
                    self._send_event(ws, 'complete', {
                        'message': 'Agent processing completed',
                        'stop_reason': event.get('stop_reason', 'end_turn')
                    })
                
                elif event_type == 'error':
                    # Handle errors
                    self._send_error(ws, event.get('data', {}).get('message', 'Unknown error'))
        
        except Exception as e:
            self._send_error(ws, f"Streaming error: {str(e)}")

