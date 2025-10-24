"""CloudWatch integration tools for RMM agents"""
import boto3
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import random
from config import config

def _get_mock_metrics(client_id: str, metric_name: str, time_range: str) -> Dict[str, Any]:
    """Generate mock CloudWatch metrics for demo"""
    base_values = {
        "CPUUtilization": (40, 95),
        "NetworkIn": (1000000, 50000000),
        "DiskReadOps": (10, 500),
        "MemoryUtilization": (50, 85),
    }
    
    min_val, max_val = base_values.get(metric_name, (10, 100))
    current_value = random.uniform(min_val, max_val)
    avg_value = (min_val + max_val) / 2
    
    # Simulate anomaly for demo
    is_anomaly = current_value > (max_val * 0.9)
    
    return {
        "metric_name": metric_name,
        "client_id": client_id,
        "time_range": time_range,
        "current_value": round(current_value, 2),
        "average": round(avg_value, 2),
        "maximum": round(max_val, 2),
        "minimum": round(min_val, 2),
        "anomaly_detected": is_anomaly,
        "severity": "critical" if is_anomaly else "normal",
        "recommendation": f"High {metric_name} detected" if is_anomaly else "Operating normally",
        "data_points": 24,
        "unit": "Percent" if "Utilization" in metric_name else "Bytes"
    }

def analyze_cloudwatch_metrics(
    client_id: str,
    metric_name: str,
    time_range: str = "1h"
) -> Dict[str, Any]:
    """
    Retrieve and analyze CloudWatch metrics for a specific client
    
    Args:
        client_id: MSP client identifier
        metric_name: CloudWatch metric to analyze (CPUUtilization, NetworkIn, etc.)
        time_range: Time range for analysis (1h, 24h, 7d, 30d)
    
    Returns:
        Dictionary with metric statistics and anomaly flags
    """
    if config.MOCK_MODE:
        return _get_mock_metrics(client_id, metric_name, time_range)
    
    try:
        cloudwatch = boto3.client('cloudwatch', region_name=config.AWS_REGION)
        
        # Parse time range
        hours_map = {"1h": 1, "24h": 24, "7d": 168, "30d": 720}
        hours = hours_map.get(time_range, 1)
        
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)
        
        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName=metric_name,
            Dimensions=[
                {'Name': 'ClientId', 'Value': client_id}
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=3600,
            Statistics=['Average', 'Maximum', 'Minimum']
        )
        
        datapoints = response.get('Datapoints', [])
        if not datapoints:
            return {"error": "No data available", "client_id": client_id}
        
        latest = sorted(datapoints, key=lambda x: x['Timestamp'], reverse=True)[0]
        avg_value = sum(d['Average'] for d in datapoints) / len(datapoints)
        max_value = max(d['Maximum'] for d in datapoints)
        
        is_anomaly = latest['Average'] > (max_value * 0.9)
        
        return {
            "metric_name": metric_name,
            "client_id": client_id,
            "time_range": time_range,
            "current_value": round(latest['Average'], 2),
            "average": round(avg_value, 2),
            "maximum": round(max_value, 2),
            "minimum": min(d['Minimum'] for d in datapoints),
            "anomaly_detected": is_anomaly,
            "severity": "critical" if is_anomaly else "normal",
            "recommendation": f"High {metric_name} detected" if is_anomaly else "Operating normally",
            "data_points": len(datapoints),
            "unit": latest.get('Unit', 'None')
        }
    except Exception as e:
        return {"error": str(e), "client_id": client_id, "fallback_mode": "mock"}

