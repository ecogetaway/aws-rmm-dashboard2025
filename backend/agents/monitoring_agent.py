"""Monitoring Agent - Handles health checks and metric analysis"""
from typing import Dict, Any, Optional
from tools import analyze_cloudwatch_metrics, query_client_inventory

class MonitoringAgent:
    """
    Specialist agent for infrastructure monitoring and health checks.
    Uses CloudWatch and inventory tools to assess system health.
    """
    
    def __init__(self, model, tools: Optional[Dict] = None):
        """
        Initialize the monitoring agent
        
        Args:
            model: Bedrock model instance
            tools: Optional tool registry
        """
        self.model = model
        self.tools = tools or {}
        self._register_tools()
    
    def _register_tools(self):
        """Register available tools for this agent"""
        self.tools = {
            "analyze_cloudwatch_metrics": analyze_cloudwatch_metrics,
            "query_client_inventory": query_client_inventory,
        }
    
    async def invoke(
        self,
        prompt: str,
        client_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process a monitoring request
        
        Args:
            prompt: User's request (e.g., "Check health of client ABC")
            client_id: MSP client identifier
            context: Additional context
        
        Returns:
            Monitoring results with recommendations
        """
        if not client_id:
            client_id = "demo-client-001"
        
        # Step 1: Query inventory
        inventory = query_client_inventory(client_id, filter_by="running")
        
        if "error" in inventory:
            return {
                "status": "error",
                "message": inventory["error"],
                "client_id": client_id
            }
        
        # Step 2: Analyze key metrics for each instance
        metrics_to_check = ["CPUUtilization", "MemoryUtilization"]
        
        anomalies = []
        all_metrics = []
        
        for metric_name in metrics_to_check:
            metric_result = analyze_cloudwatch_metrics(
                client_id=client_id,
                metric_name=metric_name,
                time_range="1h"
            )
            
            all_metrics.append(metric_result)
            
            if metric_result.get("anomaly_detected"):
                anomalies.append({
                    "metric": metric_name,
                    "severity": metric_result.get("severity"),
                    "value": metric_result.get("current_value"),
                    "recommendation": metric_result.get("recommendation")
                })
        
        # Step 3: Synthesize response
        health_status = "healthy" if len(anomalies) == 0 else "warning" if len(anomalies) < 2 else "critical"
        
        response = {
            "status": health_status,
            "client_id": client_id,
            "inventory_summary": {
                "total_instances": inventory.get("total_instances"),
                "running_instances": inventory.get("running_instances"),
                "stopped_instances": inventory.get("stopped_instances")
            },
            "metrics_analyzed": len(all_metrics),
            "anomalies_detected": len(anomalies),
            "anomalies": anomalies,
            "recommendation": self._generate_recommendation(health_status, anomalies),
            "tools_used": ["query_client_inventory", "analyze_cloudwatch_metrics"],
            "raw_metrics": all_metrics
        }
        
        return response
    
    def _generate_recommendation(
        self,
        health_status: str,
        anomalies: list[Dict[str, Any]]
    ) -> str:
        """Generate actionable recommendation based on health status"""
        if health_status == "healthy":
            return "All systems operating normally. No action required."
        
        if health_status == "warning":
            return f"Minor issues detected: {anomalies[0]['recommendation']}. Consider proactive remediation."
        
        # Critical
        recommendations = [a["recommendation"] for a in anomalies]
        return f"Multiple critical issues detected: {', '.join(recommendations)}. Immediate remediation recommended."

