"""Configuration for RMM Agent Backend"""
import os
from typing import Optional

class Config:
    """Application configuration"""
    
    # AWS
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    
    # Bedrock
    BEDROCK_MODEL_ID: str = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-sonnet-4-20250514-v1:0")
    BEDROCK_TEMPERATURE: float = float(os.getenv("BEDROCK_TEMPERATURE", "0.3"))
    BEDROCK_GUARDRAIL_ID: Optional[str] = os.getenv("BEDROCK_GUARDRAIL_ID")
    BEDROCK_GUARDRAIL_VERSION: str = os.getenv("BEDROCK_GUARDRAIL_VERSION", "DRAFT")
    
    # AgentCore Memory
    AGENTCORE_MEMORY_ID: Optional[str] = os.getenv("AGENTCORE_MEMORY_ID")
    
    # Feature Flags
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "true").lower() == "true"
    ENABLE_STREAMING: bool = os.getenv("ENABLE_STREAMING", "true").lower() == "true"
    ENABLE_MEMORY: bool = os.getenv("ENABLE_MEMORY", "false").lower() == "true"
    
    # API
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8080"))
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:3000,http://localhost:3001,http://localhost:3002,https://deft-vacherin-809e6c.netlify.app"
    ).split(",")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

config = Config()

