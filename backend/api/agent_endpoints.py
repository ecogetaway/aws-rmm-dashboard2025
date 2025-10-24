"""REST API endpoints for agent interactions"""
from flask import Flask, request, jsonify
from typing import Dict, Any
import uuid
import asyncio
from datetime import datetime

class AgentAPI:
    """REST API handler for agent invocations"""
    
    def __init__(self, app: Flask, orchestrator):
        """
        Initialize API routes
        
        Args:
            app: Flask application instance
            orchestrator: OrchestratorAgent instance
        """
        self.app = app
        self.orchestrator = orchestrator
        self.sessions = {}  # In-memory session store (Phase 1)
        self._register_routes()
    
    def _register_routes(self):
        """Register all API routes"""
        self.app.route('/api/agent/invoke', methods=['POST'])(self.invoke_agent)
        self.app.route('/api/agent/action', methods=['POST'])(self.handle_action)
        self.app.route('/api/agent/session/<session_id>', methods=['GET'])(self.get_session)
        self.app.route('/health', methods=['GET'])(self.health_check)
    
    def invoke_agent(self):
        """
        POST /api/agent/invoke
        Invoke the orchestrator with a user prompt
        
        Request body:
        {
            "prompt": string,
            "clientId": string (optional),
            "context": object (optional)
        }
        
        Returns:
        {
            "sessionId": string,
            "requestId": string,
            "status": string
        }
        """
        try:
            data = request.get_json()
            
            if not data or 'prompt' not in data:
                return jsonify({"error": "Missing 'prompt' in request body"}), 400
            
            prompt = data['prompt']
            client_id = data.get('clientId')
            context = data.get('context', {})
            
            # Generate IDs
            session_id = str(uuid.uuid4())
            request_id = str(uuid.uuid4())
            
            # Invoke orchestrator (synchronous wrapper for async)
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                self.orchestrator.invoke(
                    prompt=prompt,
                    client_id=client_id,
                    context=context
                )
            )
            loop.close()
            
            # Store session
            self.sessions[session_id] = {
                "session_id": session_id,
                "request_id": request_id,
                "prompt": prompt,
                "client_id": client_id,
                "result": result,
                "created_at": datetime.utcnow().isoformat(),
                "status": "completed"
            }
            
            return jsonify({
                "sessionId": session_id,
                "requestId": request_id,
                "status": "completed",
                "result": result
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def handle_action(self):
        """
        POST /api/agent/action
        Approve or reject an agent-proposed action
        
        Request body:
        {
            "actionId": string,
            "approve": boolean,
            "comment": string (optional)
        }
        
        Returns:
        {
            "actionId": string,
            "status": "approved" | "rejected"
        }
        """
        try:
            data = request.get_json()
            
            if not data or 'actionId' not in data or 'approve' not in data:
                return jsonify({"error": "Missing 'actionId' or 'approve' in request body"}), 400
            
            action_id = data['actionId']
            approve = data['approve']
            comment = data.get('comment', '')
            
            # Phase 1 stub: just acknowledge
            status = "approved" if approve else "rejected"
            
            return jsonify({
                "actionId": action_id,
                "status": status,
                "comment": comment,
                "processed_at": datetime.utcnow().isoformat()
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_session(self, session_id: str):
        """
        GET /api/agent/session/<session_id>
        Retrieve session details
        
        Returns:
        {
            "sessionId": string,
            "prompt": string,
            "result": object,
            "status": string
        }
        """
        session = self.sessions.get(session_id)
        
        if not session:
            return jsonify({"error": "Session not found"}), 404
        
        return jsonify(session), 200
    
    def health_check(self):
        """
        GET /health
        Health check endpoint
        """
        return jsonify({
            "status": "healthy",
            "service": "rmm-agent-backend",
            "version": "1.0.0-phase1",
            "timestamp": datetime.utcnow().isoformat()
        }), 200

