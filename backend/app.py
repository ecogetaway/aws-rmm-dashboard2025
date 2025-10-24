"""Main application entry point for RMM Agent Backend"""
from flask import Flask
from flask_cors import CORS
import logging
from config import config
from agents import OrchestratorAgent, IncidentAgent
from bedrock import BedrockModel
from api import AgentAPI, WebSocketHandler

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {"origins": config.CORS_ORIGINS},
        r"/ws/*": {"origins": config.CORS_ORIGINS}
    })
    
    # Initialize Bedrock Model (Phase 2)
    logger.info("Initializing Bedrock model...")
    bedrock_model = BedrockModel(
        model_id=config.BEDROCK_MODEL_ID,
        temperature=config.BEDROCK_TEMPERATURE
    )
    logger.info(f"Bedrock Model: {config.BEDROCK_MODEL_ID}")
    logger.info(f"AWS Region: {config.AWS_REGION}")
    
    # Initialize Orchestrator with Bedrock model
    orchestrator = OrchestratorAgent(bedrock_model=bedrock_model)
    
    # Initialize API endpoints and WebSocket handler
    agent_api = AgentAPI(app, orchestrator)
    websocket_handler = WebSocketHandler(app, orchestrator)
    
    logger.info("✅ RMM Agent Backend initialized")
    logger.info(f"🔧 MOCK_MODE: {config.MOCK_MODE}")
    logger.info(f"🌐 API Host: {config.API_HOST}:{config.API_PORT}")
    logger.info(f"🔒 CORS Origins: {config.CORS_ORIGINS}")
    logger.info(f"🛡️ Guardrails: {config.BEDROCK_GUARDRAIL_ID or 'Not configured'}")
    
    return app

def main():
    """Main entry point"""
    app = create_app()
    
    logger.info("Starting RMM Agent Backend...")
    logger.info(f"Access at: http://{config.API_HOST}:{config.API_PORT}")
    logger.info(f"Health check: http://{config.API_HOST}:{config.API_PORT}/health")
    
    app.run(
        host=config.API_HOST,
        port=config.API_PORT,
        debug=(config.LOG_LEVEL == "DEBUG")
    )

if __name__ == '__main__':
    main()

