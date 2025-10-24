"""Orchestrator Agent - Routes requests to specialist agents"""
from typing import Dict, Any, Optional, Iterator
from bedrock import BedrockModel
from agents.incident_agent import IncidentAgent

class OrchestratorAgent:
    """
    Main orchestrator that analyzes user requests and routes to appropriate specialist agents.
    Coordinates multi-agent workflows and aggregates responses.
    """
    
    def __init__(self, bedrock_model: BedrockModel):
        """
        Initialize orchestrator with Bedrock model
        
        Args:
            bedrock_model: Initialized Bedrock model instance
        """
        self.model = bedrock_model
        
        # Initialize specialist agents
        self.incident_agent = IncidentAgent(model=bedrock_model)
        
        # Agent routing rules
        self.routing_keywords = {
            "incident_agent": [
                "incident", "issue", "problem", "error", "alert", "down", "outage",
                "critical", "failure", "not working", "broken", "crash", "remediate",
                "fix", "resolve", "troubleshoot", "diagnose"
            ],
        }
    
    def route_request(self, prompt: str) -> str:
        """
        Determine which specialist agent should handle the request
        
        Args:
            prompt: User's request
        
        Returns:
            Agent identifier or 'general' for orchestrator handling
        """
        prompt_lower = prompt.lower()
        
        # Check for incident-related keywords
        if any(keyword in prompt_lower for keyword in self.routing_keywords["incident_agent"]):
            return "incident_agent"
        
        # Default to general orchestrator handling
        return "general"
    
    async def invoke(
        self,
        prompt: str,
        client_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process a user request, route to appropriate agent, and return response
        
        Args:
            prompt: User's request
            client_id: MSP client identifier
            context: Additional context from previous interactions
        
        Returns:
            Agent response with routing metadata
        """
        # Determine routing
        target_agent = self.route_request(prompt)
        
        response = {
            "orchestrator": "main",
            "routed_to": target_agent,
            "prompt": prompt,
            "client_id": client_id or "demo-client-001"
        }
        
        # Route to specialist agent
        if target_agent == "incident_agent":
            agent_response = await self.incident_agent.invoke(
                prompt=prompt,
                client_id=response["client_id"],
                context=context
            )
            response.update(agent_response)
        
        else:
            # Handle general queries with orchestrator
            general_response = await self._handle_general_query(prompt, response["client_id"])
            response.update(general_response)
        
        return response
    
    async def invoke_stream(
        self,
        prompt: str,
        client_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Iterator[Dict[str, Any]]:
        """
        Process request with streaming response
        
        Args:
            prompt: User's request
            client_id: MSP client identifier
            context: Additional context
        
        Yields:
            Streaming events (tokens, tool calls, completion)
        """
        import time
        
        # Determine routing
        target_agent = self.route_request(prompt)
        
        # Send routing information
        yield {
            "type": "routing",
            "data": {
                "routed_to": target_agent,
                "orchestrator": "main",
                "timestamp": time.time()
            }
        }
        
        # For incident agent, provide structured analysis
        if target_agent == "incident_agent":
            # Simulate progressive analysis
            steps = [
                "🔍 Analyzing incident context...",
                "📊 Gathering system metrics...",
                "🧠 Determining root cause...",
                "💡 Proposing remediation plan...",
            ]
            
            for step in steps:
                yield {"type": "token", "content": step + "\n\n"}
                time.sleep(0.3)
            
            # Get full analysis from incident agent
            agent_response = await self.incident_agent.invoke(
                prompt=prompt,
                client_id=client_id or "demo-client-001",
                context=context
            )
            
            # Stream the formatted response
            formatted_response = self._format_incident_response(agent_response)
            
            # Stream the response token by token
            words = formatted_response.split(' ')
            for i, word in enumerate(words):
                yield {"type": "token", "content": word + (' ' if i < len(words) - 1 else '')}
                time.sleep(0.02)
            
            # Send metadata
            yield {
                "type": "metadata",
                "data": {
                    "tools_used": agent_response.get("tools_used", []),
                    "confidence": agent_response.get("confidence", 0.85),
                    "incident_id": agent_response.get("incident_id"),
                    "requires_approval": agent_response.get("requires_approval", False)
                }
            }
        
        else:
            # Stream general response using Bedrock
            stream = self.model.invoke_stream(
                prompt=prompt,
                system="You are an AI assistant for IT infrastructure management. Provide helpful, concise responses."
            )
            
            for event in stream:
                yield event
        
        # Send completion
        yield {"type": "complete", "stop_reason": "end_turn"}
    
    def _format_incident_response(self, agent_response: Dict[str, Any]) -> str:
        """Format incident agent response for streaming"""
        
        incident_id = agent_response.get("incident_id", "Unknown")
        root_cause = agent_response.get("root_cause", {})
        remediation = agent_response.get("remediation_plan", {})
        
        formatted = f"""**Incident Analysis Complete** (ID: {incident_id})

**Root Cause Analysis:**
{root_cause.get('analysis', 'Analysis unavailable')}

**Confidence Level:** {int(root_cause.get('confidence', 0.85) * 100)}%

**Recommended Actions:**
"""
        
        actions = remediation.get("actions", [])
        for i, action in enumerate(actions, 1):
            formatted += f"\n{i}. **{action.get('type', 'Action').replace('_', ' ').title()}**"
            formatted += f"\n   - Target: {action.get('target', 'Unknown')}"
            formatted += f"\n   - Rationale: {action.get('rationale', 'Not specified')}"
        
        formatted += f"\n\n**Risk Level:** {remediation.get('risk', 'unknown').upper()}"
        formatted += f"\n**Estimated Resolution Time:** {remediation.get('estimated_time', 'Unknown')}"
        
        if agent_response.get("requires_approval"):
            formatted += "\n\n⚠️ **Manual approval required before executing remediation.**"
        
        return formatted
    
    async def _handle_general_query(self, prompt: str, client_id: str) -> Dict[str, Any]:
        """Handle general queries that don't require specialist agents"""
        
        # Use Bedrock for general responses
        response = self.model.invoke(
            prompt=prompt,
            system="""You are an AI assistant for IT infrastructure management.
Provide helpful, accurate responses about AWS services, RMM best practices,
and IT operations. Be concise and actionable."""
        )
        
        return {
            "status": "completed",
            "response": response.get("content", ""),
            "model": response.get("model"),
            "usage": response.get("usage", {}),
            "tools_used": []
        }
