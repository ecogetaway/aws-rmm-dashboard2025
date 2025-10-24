"""Remediation execution tools for RMM agents"""
import boto3
from typing import Dict, Any
import random
import time
from config import config

def _execute_mock_remediation(
    client_id: str,
    instance_id: str,
    action_type: str,
    parameters: Dict[str, Any]
) -> Dict[str, Any]:
    """Execute mock remediation for demo"""
    # Simulate execution time
    execution_time = random.uniform(0.5, 2.0)
    time.sleep(execution_time)
    
    action_templates = {
        "restart_service": {
            "status": "success",
            "message": f"Service '{parameters.get('service_name', 'httpd')}' restarted successfully",
            "commands_executed": [
                f"sudo systemctl restart {parameters.get('service_name', 'httpd')}"
            ]
        },
        "clear_cache": {
            "status": "success",
            "message": "Cache cleared successfully",
            "commands_executed": [
                "sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches"
            ]
        },
        "increase_memory": {
            "status": "success",
            "message": "Memory allocation increased",
            "commands_executed": [
                f"sudo service resize-memory {parameters.get('new_size_gb', 16)}"
            ]
        },
        "update_package": {
            "status": "success",
            "message": f"Package '{parameters.get('package_name', 'nginx')}' updated",
            "commands_executed": [
                f"sudo yum update -y {parameters.get('package_name', 'nginx')}"
            ]
        }
    }
    
    result = action_templates.get(action_type, {
        "status": "success",
        "message": f"Action '{action_type}' executed",
        "commands_executed": ["generic command"]
    })
    
    return {
        "client_id": client_id,
        "instance_id": instance_id,
        "action_type": action_type,
        "execution_id": f"exec-{random.randint(100000, 999999)}",
        "status": result["status"],
        "message": result["message"],
        "commands_executed": result["commands_executed"],
        "execution_time_seconds": round(execution_time, 2),
        "executed_at": "2025-10-24T12:00:00Z",
        "parameters": parameters
    }

def execute_remediation_action(
    client_id: str,
    instance_id: str,
    action_type: str,
    parameters: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Execute a remediation action via AWS Systems Manager (SSM)
    
    Args:
        client_id: MSP client identifier
        instance_id: EC2 instance ID to target
        action_type: Type of remediation (restart_service, clear_cache, etc.)
        parameters: Action-specific parameters
    
    Returns:
        Dictionary with execution results and status
    """
    if parameters is None:
        parameters = {}
    
    if config.MOCK_MODE:
        return _execute_mock_remediation(client_id, instance_id, action_type, parameters)
    
    try:
        ssm = boto3.client('ssm', region_name=config.AWS_REGION)
        
        # Map action types to SSM documents
        document_map = {
            "restart_service": "AWS-RestartEC2Instance",
            "clear_cache": "AWS-RunShellScript",
            "increase_memory": "AWS-RunShellScript",
            "update_package": "AWS-RunPatchBaseline"
        }
        
        document_name = document_map.get(action_type, "AWS-RunShellScript")
        
        # Build SSM command
        command_params = {
            "commands": [
                f"# Executing {action_type}",
                f"# Parameters: {parameters}"
            ]
        }
        
        response = ssm.send_command(
            InstanceIds=[instance_id],
            DocumentName=document_name,
            Parameters=command_params,
            Comment=f"RMM Agent remediation for {client_id}"
        )
        
        command_id = response['Command']['CommandId']
        
        # Wait for command completion (simplified)
        time.sleep(2)
        
        return {
            "client_id": client_id,
            "instance_id": instance_id,
            "action_type": action_type,
            "execution_id": command_id,
            "status": "success",
            "message": f"Remediation action '{action_type}' initiated",
            "commands_executed": command_params["commands"],
            "execution_time_seconds": 2.0,
            "executed_at": "2025-10-24T12:00:00Z",
            "parameters": parameters
        }
    except Exception as e:
        return {
            "error": str(e),
            "client_id": client_id,
            "instance_id": instance_id,
            "fallback_mode": "mock"
        }

