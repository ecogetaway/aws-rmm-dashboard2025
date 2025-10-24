"""Bedrock Model Integration using Anthropic SDK"""
import boto3
import json
from typing import Dict, Any, Iterator, Optional
from config import config

class BedrockModel:
    """
    Wrapper for Amazon Bedrock with Claude Sonnet 4 support.
    Supports both direct invocation and streaming.
    """
    
    def __init__(
        self,
        model_id: str = None,
        temperature: float = None,
        max_tokens: int = 2048
    ):
        """
        Initialize Bedrock model
        
        Args:
            model_id: Bedrock model identifier (defaults to config)
            temperature: Sampling temperature (defaults to config)
            max_tokens: Maximum tokens to generate
        """
        self.model_id = model_id or config.BEDROCK_MODEL_ID
        self.temperature = temperature if temperature is not None else config.BEDROCK_TEMPERATURE
        self.max_tokens = max_tokens
        
        # Initialize Bedrock runtime client
        if not config.MOCK_MODE:
            self.client = boto3.client(
                'bedrock-runtime',
                region_name=config.AWS_REGION
            )
        else:
            self.client = None
    
    def invoke(
        self,
        prompt: str,
        system: Optional[str] = None,
        tools: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Invoke Bedrock model with a prompt (non-streaming)
        
        Args:
            prompt: User prompt
            system: System prompt/instructions
            tools: Tool definitions for function calling
        
        Returns:
            Model response with content and metadata
        """
        if config.MOCK_MODE or not self.client:
            return self._mock_invoke(prompt, system)
        
        # Build request body for Claude models
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        if system:
            body["system"] = system
        
        if tools:
            body["tools"] = tools
        
        # Add guardrails if configured
        if config.BEDROCK_GUARDRAIL_ID:
            body["guardrailIdentifier"] = config.BEDROCK_GUARDRAIL_ID
            body["guardrailVersion"] = config.BEDROCK_GUARDRAIL_VERSION
        
        try:
            response = self.client.invoke_model(
                modelId=self.model_id,
                body=json.dumps(body),
                contentType='application/json',
                accept='application/json'
            )
            
            response_body = json.loads(response['body'].read())
            
            return {
                "content": response_body.get('content', [{}])[0].get('text', ''),
                "stop_reason": response_body.get('stop_reason'),
                "usage": response_body.get('usage', {}),
                "model": self.model_id
            }
        
        except Exception as e:
            print(f"Bedrock invocation error: {e}")
            return self._mock_invoke(prompt, system)
    
    def invoke_stream(
        self,
        prompt: str,
        system: Optional[str] = None,
        tools: Optional[list] = None
    ) -> Iterator[Dict[str, Any]]:
        """
        Stream tokens from Bedrock model
        
        Args:
            prompt: User prompt
            system: System prompt/instructions
            tools: Tool definitions for function calling
        
        Yields:
            Dict with token data: {"type": "token", "content": str}
            Dict with tool calls: {"type": "tool_use", "tool": dict}
            Dict with completion: {"type": "complete", "stop_reason": str}
        """
        if config.MOCK_MODE or not self.client:
            yield from self._mock_stream(prompt, system)
            return
        
        # Build request body
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        if system:
            body["system"] = system
        
        if tools:
            body["tools"] = tools
        
        # Add guardrails if configured
        if config.BEDROCK_GUARDRAIL_ID:
            body["guardrailIdentifier"] = config.BEDROCK_GUARDRAIL_ID
            body["guardrailVersion"] = config.BEDROCK_GUARDRAIL_VERSION
        
        try:
            response = self.client.invoke_model_with_response_stream(
                modelId=self.model_id,
                body=json.dumps(body),
                contentType='application/json',
                accept='application/json'
            )
            
            # Process streaming response
            for event in response['body']:
                chunk = json.loads(event['chunk']['bytes'].decode())
                
                event_type = chunk.get('type')
                
                if event_type == 'content_block_delta':
                    delta = chunk.get('delta', {})
                    if delta.get('type') == 'text_delta':
                        yield {
                            "type": "token",
                            "content": delta.get('text', '')
                        }
                
                elif event_type == 'content_block_start':
                    content_block = chunk.get('content_block', {})
                    if content_block.get('type') == 'tool_use':
                        yield {
                            "type": "tool_use_start",
                            "tool_id": content_block.get('id'),
                            "tool_name": content_block.get('name')
                        }
                
                elif event_type == 'message_stop':
                    yield {
                        "type": "complete",
                        "stop_reason": chunk.get('stop_reason', 'end_turn')
                    }
        
        except Exception as e:
            print(f"Bedrock streaming error: {e}")
            yield from self._mock_stream(prompt, system)
    
    def _mock_invoke(self, prompt: str, system: Optional[str] = None) -> Dict[str, Any]:
        """Mock invocation for development/testing"""
        return {
            "content": f"[Mock Mode] Processed prompt: {prompt[:100]}...",
            "stop_reason": "end_turn",
            "usage": {"input_tokens": 50, "output_tokens": 100},
            "model": self.model_id
        }
    
    def _mock_stream(self, prompt: str, system: Optional[str] = None) -> Iterator[Dict[str, Any]]:
        """Mock streaming for development/testing"""
        import time
        
        tokens = [
            "Analyzing", " your", " request", "...\n\n",
            "Based", " on", " the", " prompt", ",",
            " I", " will", " route", " this", " to",
            " the", " appropriate", " agent", ".\n"
        ]
        
        for token in tokens:
            yield {"type": "token", "content": token}
            time.sleep(0.05)  # Simulate streaming delay
        
        yield {"type": "complete", "stop_reason": "end_turn"}

