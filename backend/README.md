# AWS RMM Agent Backend

Multi-agent system powered by Amazon Bedrock and Strands Agents SDK for autonomous IT infrastructure management.

## Architecture

### Phase 1 (Current - Must Have)
- **Orchestrator Agent**: Routes requests to specialist agents
- **Monitoring Agent**: Health checks and CloudWatch metric analysis
- **Tools**: CloudWatch, inventory, remediation (with mock modes)
- **API**: REST endpoints and WebSocket streaming
- **Demo Mode**: Fully functional without AWS credentials

### Phase 2 (Agent Sophistication)
- Incident, compliance, predictive, reporting agents
- AgentCore Memory integration
- MCP servers (AWS MCP + custom RMM MCP)
- Multi-agent coordination graph

### Phase 3 (Production Features)
- Bedrock guardrails
- AgentCore runtime deployment
- Security Hub/Config integration

## Quick Start

### Prerequisites
- Python 3.11+
- pip

### Local Development (Mock Mode)

```bash
# Install dependencies
pip install -r deployment/requirements.txt

# Run in mock mode (no AWS credentials needed)
cd backend
python app.py
```

The API will be available at `http://localhost:8080`

### With AWS Credentials

```bash
# Set environment variables
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export MOCK_MODE=false

# Run
python backend/app.py
```

## API Endpoints

### REST API

#### Health Check
```bash
curl http://localhost:8080/health
```

#### Invoke Agent
```bash
curl -X POST http://localhost:8080/api/agent/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Check health status",
    "clientId": "demo-client-001"
  }'
```

#### Approve/Reject Action
```bash
curl -X POST http://localhost:8080/api/agent/action \
  -H "Content-Type: application/json" \
  -d '{
    "actionId": "action-001",
    "approve": true
  }'
```

### WebSocket API

Connect to `ws://localhost:8080/ws/agent/stream` and send:

```json
{
  "prompt": "Check health status",
  "clientId": "demo-client-001"
}
```

Server will stream messages:
```json
{
  "type": "token",
  "data": { "content": "Analyzing request..." },
  "timestamp": "2025-10-24T12:00:00Z"
}
```

## Tools

### CloudWatch Tool
Analyzes metrics for clients:
- `analyze_cloudwatch_metrics(client_id, metric_name, time_range)`
- Supports: CPUUtilization, MemoryUtilization, NetworkIn, DiskReadOps
- Mock mode generates realistic synthetic data

### Inventory Tool
Queries EC2 inventory:
- `query_client_inventory(client_id, filter_by)`
- Returns instance details, counts, statuses
- Mock mode generates 3-8 instances

### Remediation Tool
Executes fixes via SSM:
- `execute_remediation_action(client_id, instance_id, action_type, parameters)`
- Actions: restart_service, clear_cache, increase_memory, update_package
- Mock mode simulates execution with realistic delays

## Configuration

Environment variables (see `backend/config.py`):

```bash
# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Bedrock (Phase 2)
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-20250514-v1:0
BEDROCK_TEMPERATURE=0.3
BEDROCK_GUARDRAIL_ID=
BEDROCK_GUARDRAIL_VERSION=DRAFT

# Features
MOCK_MODE=true
ENABLE_STREAMING=true
ENABLE_MEMORY=false

# API
API_HOST=0.0.0.0
API_PORT=8080
CORS_ORIGINS=http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

## Docker Deployment

```bash
# Build
docker build -f deployment/Dockerfile -t rmm-agent-backend .

# Run
docker run -p 8080:8080 \
  -e MOCK_MODE=true \
  -e LOG_LEVEL=INFO \
  rmm-agent-backend
```

## Testing Scenarios

### Scenario 1: Health Check with Remediation
```bash
# 1. Invoke agent
curl -X POST http://localhost:8080/api/agent/invoke \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Check health and fix issues", "clientId": "demo-client-001"}'

# 2. Observe tool traces (CloudWatch, inventory)
# 3. Frontend will show proposed remediation action
# 4. Approve action via frontend or API
```

### Scenario 2: Predictive Analysis (Phase 2)
```bash
curl -X POST http://localhost:8080/api/agent/invoke \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Any clients at risk in 7 days?", "clientId": "all"}'
```

## Project Structure

```
backend/
├── agents/
│   ├── orchestrator.py       # Routes to specialists
│   ├── monitoring_agent.py   # Health & metrics
│   └── __init__.py
├── tools/
│   ├── cloudwatch_tools.py   # Metric analysis
│   ├── inventory_tools.py    # EC2 inventory
│   ├── remediation_tools.py  # SSM execution
│   └── __init__.py
├── api/
│   ├── agent_endpoints.py    # REST routes
│   ├── websocket_handler.py  # WS streaming
│   └── __init__.py
├── app.py                     # Main entry point
└── config.py                  # Configuration

deployment/
├── Dockerfile                 # Container image
└── requirements.txt           # Python deps
```

## Development Roadmap

- [x] Phase 1: Core agents, tools, API
- [x] **Phase 2: Bedrock integration, Incident Agent, Real streaming** ✅ **COMPLETE**
- [ ] Phase 3: Additional specialist agents, MCP servers, production deployment

---

## 🎉 Phase 2 Complete!

**New in Phase 2:**
- ✅ Real Amazon Bedrock integration (Claude Sonnet 4)
- ✅ Incident Agent with root cause analysis
- ✅ Intelligent orchestrator with request routing
- ✅ Real-time streaming from Bedrock
- ✅ Tool execution and tracing
- ✅ Comprehensive test suite

**See `PHASE2_IMPLEMENTATION.md` for complete details!**

## License

MIT

