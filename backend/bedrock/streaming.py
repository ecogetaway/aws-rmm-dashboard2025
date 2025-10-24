"""Streaming handler for Bedrock responses"""
from typing import Iterator, Dict, Any, Callable
import asyncio

class StreamingHandler:
    """
    Handles streaming responses from Bedrock and broadcasts to WebSocket clients
    """
    
    def __init__(self, on_token: Callable = None, on_tool: Callable = None):
        """
        Initialize streaming handler
        
        Args:
            on_token: Callback for token events
            on_tool: Callback for tool use events
        """
        self.on_token = on_token
        self.on_tool = on_tool
        self.buffer = []
    
    async def process_stream(
        self,
        stream: Iterator[Dict[str, Any]],
        send_message: Callable
    ):
        """
        Process streaming events and send to WebSocket
        
        Args:
            stream: Iterator from BedrockModel.invoke_stream()
            send_message: Function to send WebSocket messages
        """
        try:
            for event in stream:
                event_type = event.get('type')
                
                if event_type == 'token':
                    # Send token to client
                    content = event.get('content', '')
                    self.buffer.append(content)
                    
                    await send_message({
                        "type": "token",
                        "data": {"content": content},
                        "timestamp": self._get_timestamp()
                    })
                    
                    if self.on_token:
                        self.on_token(content)
                
                elif event_type == 'tool_use_start':
                    # Notify about tool execution
                    tool_name = event.get('tool_name')
                    await send_message({
                        "type": "tool",
                        "data": {
                            "tool_name": tool_name,
                            "status": "running"
                        },
                        "timestamp": self._get_timestamp()
                    })
                    
                    if self.on_tool:
                        self.on_tool(tool_name, "running")
                
                elif event_type == 'complete':
                    # Send completion message
                    await send_message({
                        "type": "complete",
                        "data": {
                            "message": "Stream completed",
                            "full_response": ''.join(self.buffer),
                            "stop_reason": event.get('stop_reason')
                        },
                        "timestamp": self._get_timestamp()
                    })
                    
                    # Clear buffer
                    self.buffer = []
        
        except Exception as e:
            await send_message({
                "type": "error",
                "data": {"message": f"Streaming error: {str(e)}"},
                "timestamp": self._get_timestamp()
            })
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.utcnow().isoformat() + 'Z'
    
    def get_full_response(self) -> str:
        """Get accumulated response"""
        return ''.join(self.buffer)

