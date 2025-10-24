"""Inventory management tools for RMM agents"""
import boto3
from typing import Dict, Any, List, Optional
import random
from config import config

def _get_mock_inventory(client_id: str, filter_by: Optional[str] = None) -> Dict[str, Any]:
    """Generate mock inventory data for demo"""
    instance_types = ["t3.medium", "t3.large", "m5.xlarge", "c5.2xlarge"]
    statuses = ["running", "stopped", "running", "running", "running"]
    
    instances = []
    for i in range(random.randint(3, 8)):
        instance_id = f"i-{random.randint(10000000, 99999999):08x}"
        status = random.choice(statuses)
        
        if filter_by and filter_by.lower() not in status:
            continue
        
        instances.append({
            "instance_id": instance_id,
            "name": f"server-{i+1}",
            "type": random.choice(instance_types),
            "status": status,
            "availability_zone": f"{config.AWS_REGION}a",
            "cpu_count": random.choice([2, 4, 8]),
            "memory_gb": random.choice([8, 16, 32]),
            "uptime_hours": random.randint(1, 720),
            "tags": {
                "Environment": random.choice(["Production", "Staging", "Development"]),
                "Application": random.choice(["WebServer", "Database", "AppServer"]),
                "ClientId": client_id
            }
        })
    
    return {
        "client_id": client_id,
        "total_instances": len(instances),
        "running_instances": sum(1 for i in instances if i["status"] == "running"),
        "stopped_instances": sum(1 for i in instances if i["status"] == "stopped"),
        "instances": instances,
        "filter_applied": filter_by or "none",
        "retrieved_at": "2025-10-24T12:00:00Z"
    }

def query_client_inventory(
    client_id: str,
    filter_by: Optional[str] = None
) -> Dict[str, Any]:
    """
    Query EC2 inventory for a specific MSP client
    
    Args:
        client_id: MSP client identifier
        filter_by: Optional filter (e.g., 'running', 'stopped')
    
    Returns:
        Dictionary with instance inventory data
    """
    if config.MOCK_MODE:
        return _get_mock_inventory(client_id, filter_by)
    
    try:
        ec2 = boto3.client('ec2', region_name=config.AWS_REGION)
        
        filters = [{'Name': 'tag:ClientId', 'Values': [client_id]}]
        if filter_by:
            filters.append({'Name': 'instance-state-name', 'Values': [filter_by]})
        
        response = ec2.describe_instances(Filters=filters)
        
        instances = []
        for reservation in response.get('Reservations', []):
            for instance in reservation.get('Instances', []):
                tags = {tag['Key']: tag['Value'] for tag in instance.get('Tags', [])}
                
                instances.append({
                    "instance_id": instance['InstanceId'],
                    "name": tags.get('Name', 'unnamed'),
                    "type": instance['InstanceType'],
                    "status": instance['State']['Name'],
                    "availability_zone": instance['Placement']['AvailabilityZone'],
                    "cpu_count": instance.get('CpuOptions', {}).get('CoreCount', 0),
                    "memory_gb": 0,  # Not directly available in API
                    "launch_time": instance['LaunchTime'].isoformat(),
                    "tags": tags
                })
        
        return {
            "client_id": client_id,
            "total_instances": len(instances),
            "running_instances": sum(1 for i in instances if i["status"] == "running"),
            "stopped_instances": sum(1 for i in instances if i["status"] == "stopped"),
            "instances": instances,
            "filter_applied": filter_by or "none",
            "retrieved_at": "2025-10-24T12:00:00Z"
        }
    except Exception as e:
        return {"error": str(e), "client_id": client_id, "fallback_mode": "mock"}

