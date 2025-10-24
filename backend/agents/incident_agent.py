"""Incident Response Agent - Analyzes and resolves incidents"""
from typing import Dict, Any, Optional
from tools import analyze_cloudwatch_metrics, query_client_inventory, execute_remediation_action

class IncidentAgent:
    """
    Specialist agent for incident response and resolution.
    Analyzes root causes, proposes fixes, and executes approved remediations.
    """
    
    def __init__(self, model, tools: Optional[Dict] = None):
        """
        Initialize the incident agent
        
        Args:
            model: Bedrock model instance
            tools: Optional tool registry
        """
        self.model = model
        self.tools = tools or {}
        self._register_tools()
    
    def _register_tools(self):
        """Register available tools for incident response"""
        self.tools = {
            "analyze_cloudwatch_metrics": analyze_cloudwatch_metrics,
            "query_client_inventory": query_client_inventory,
            "execute_remediation_action": execute_remediation_action,
        }
    
    async def invoke(
        self,
        prompt: str,
        incident_id: Optional[str] = None,
        client_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process an incident response request
        
        Args:
            prompt: User's request or incident description
            incident_id: Optional incident ID for context
            client_id: MSP client identifier
            context: Additional context
        
        Returns:
            Incident analysis with root cause and recommended actions
        """
        if not client_id:
            client_id = "demo-client-001"
        
        # Step 1: Gather incident context
        incident_context = await self._gather_incident_context(
            incident_id=incident_id,
            client_id=client_id,
            prompt=prompt
        )
        
        # Step 2: Analyze root cause using model
        root_cause_analysis = await self._analyze_root_cause(
            incident_context=incident_context,
            prompt=prompt
        )
        
        # Step 3: Propose remediation actions
        remediation_plan = self._propose_remediation(
            root_cause=root_cause_analysis,
            incident_context=incident_context
        )
        
        # Step 4: Return comprehensive response
        return {
            "status": "analyzed",
            "incident_id": incident_id or f"INC-{self._generate_id()}",
            "client_id": client_id,
            "root_cause": root_cause_analysis,
            "remediation_plan": remediation_plan,
            "incident_context": incident_context,
            "requires_approval": remediation_plan.get("risk") in ["medium", "high"],
            "tools_used": list(incident_context.get("tools_invoked", [])),
            "confidence": root_cause_analysis.get("confidence", 0.85),
            "estimated_resolution_time": remediation_plan.get("estimated_time", "15 minutes")
        }
    
    async def _gather_incident_context(
        self,
        incident_id: Optional[str],
        client_id: str,
        prompt: str
    ) -> Dict[str, Any]:
        """Gather context about the incident from various sources"""
        context = {
            "incident_id": incident_id,
            "client_id": client_id,
            "tools_invoked": []
        }
        
        # Check if prompt mentions specific metrics or systems
        prompt_lower = prompt.lower()
        
        # Query inventory
        inventory = query_client_inventory(client_id)
        context["inventory"] = inventory
        context["tools_invoked"].append("query_client_inventory")
        
        # Analyze relevant metrics
        metrics_to_check = []
        if any(word in prompt_lower for word in ["cpu", "processor", "high load"]):
            metrics_to_check.append("CPUUtilization")
        if any(word in prompt_lower for word in ["memory", "ram", "oom"]):
            metrics_to_check.append("MemoryUtilization")
        if any(word in prompt_lower for word in ["network", "bandwidth", "latency"]):
            metrics_to_check.append("NetworkIn")
        if any(word in prompt_lower for word in ["disk", "storage", "io"]):
            metrics_to_check.append("DiskReadOps")
        
        # Default to checking all critical metrics if none specified
        if not metrics_to_check:
            metrics_to_check = ["CPUUtilization", "MemoryUtilization"]
        
        metrics_data = []
        for metric_name in metrics_to_check:
            metric_result = analyze_cloudwatch_metrics(
                client_id=client_id,
                metric_name=metric_name,
                time_range="1h"
            )
            metrics_data.append(metric_result)
            context["tools_invoked"].append("analyze_cloudwatch_metrics")
        
        context["metrics"] = metrics_data
        
        return context
    
    async def _analyze_root_cause(
        self,
        incident_context: Dict[str, Any],
        prompt: str
    ) -> Dict[str, Any]:
        """Use Bedrock model to analyze root cause"""
        
        # Build context for model
        metrics_summary = []
        for metric in incident_context.get("metrics", []):
            if metric.get("anomaly_detected"):
                metrics_summary.append(
                    f"- {metric['metric_name']}: {metric['current_value']} "
                    f"(avg: {metric['average']}, severity: {metric['severity']})"
                )
        
        inventory_summary = incident_context.get("inventory", {})
        
        system_prompt = """You are an expert incident response agent for IT infrastructure.
Analyze the provided metrics and context to determine the root cause of issues.
Be concise, specific, and provide actionable insights."""
        
        analysis_prompt = f"""Incident Analysis Request:
{prompt}

System Context:
- Total instances: {inventory_summary.get('total_instances', 'unknown')}
- Running instances: {inventory_summary.get('running_instances', 'unknown')}

Metrics Anomalies Detected:
{chr(10).join(metrics_summary) if metrics_summary else 'No critical anomalies'}

Based on this data, provide:
1. Most likely root cause
2. Confidence level (0-1)
3. Supporting evidence
4. Potential impact if not resolved"""
        
        # Invoke model
        response = self.model.invoke(
            prompt=analysis_prompt,
            system=system_prompt
        )
        
        # Parse response
        return {
            "analysis": response.get("content", "Unable to analyze"),
            "confidence": 0.85,  # Could be extracted from model response
            "evidence": metrics_summary,
            "model_used": response.get("model")
        }
    
    def _propose_remediation(
        self,
        root_cause: Dict[str, Any],
        incident_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Propose remediation actions based on root cause"""
        
        # Analyze metrics to determine appropriate remediation
        metrics = incident_context.get("metrics", [])
        high_cpu = any(m.get("metric_name") == "CPUUtilization" and m.get("anomaly_detected") for m in metrics)
        high_memory = any(m.get("metric_name") == "MemoryUtilization" and m.get("anomaly_detected") for m in metrics)
        
        remediation_plan = {
            "actions": [],
            "risk": "low",
            "estimated_time": "10 minutes",
            "rollback_available": True
        }
        
        if high_cpu:
            remediation_plan["actions"].append({
                "type": "restart_service",
                "target": "application_server",
                "parameters": {"service_name": "httpd"},
                "rationale": "High CPU detected, service restart may clear memory leak"
            })
            remediation_plan["risk"] = "low"
        
        if high_memory:
            remediation_plan["actions"].append({
                "type": "clear_cache",
                "target": "system",
                "parameters": {},
                "rationale": "High memory usage, clearing cache may free resources"
            })
            remediation_plan["risk"] = "low"
        
        if not remediation_plan["actions"]:
            remediation_plan["actions"].append({
                "type": "investigate",
                "target": "system_logs",
                "parameters": {},
                "rationale": "No clear automated fix, manual investigation recommended"
            })
            remediation_plan["risk"] = "none"
        
        return remediation_plan
    
    def _generate_id(self) -> str:
        """Generate incident ID"""
        import random
        import string
        return ''.join(random.choices(string.digits, k=8))

