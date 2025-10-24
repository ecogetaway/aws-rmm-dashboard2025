# Demo Mode - Frontend Standalone Operation

## Overview

The AWS RMM Agent Console frontend works **fully standalone** without requiring the backend to be running. This makes it perfect for:
- Hackathon judging/review on Netlify
- Quick demos without infrastructure setup
- UI/UX evaluation
- Frontend development and testing

## How It Works

### Automatic Backend Detection
1. When you send a prompt, the frontend attempts to connect to the backend API via WebSocket
2. If the connection fails or times out (2 seconds), it automatically switches to **Demo Mode**
3. Demo Mode provides intelligent, context-aware responses based on your prompt
4. All errors are suppressed - no red error boxes or console errors

### Demo Mode Features

✅ **Intelligent Responses**
- Detects query intent (health checks, incidents, security, etc.)
- Provides realistic, formatted responses
- Includes metrics, findings, and recommendations

✅ **Simulated Tool Execution**
- Shows tool traces in Activity Monitor
- Displays: `query_client_inventory`, `analyze_cloudwatch_metrics`
- Updates metrics: Total Requests, Avg Time, Tool Calls, Success Rate

✅ **Complete UI Experience**
- No broken states or endless loading
- Professional appearance for judges
- All UI components functional

✅ **Action Proposals**
- Pre-populated demo action in Autonomous Actions panel
- Approve/Reject workflow fully functional
- Status transitions work correctly

## Example Prompts (Demo Mode)

### Health Check
**Prompt:** "Check health and fix issues for demo-client-001"

**Response includes:**
- Inventory summary (5 running instances)
- CloudWatch metrics (CPU, Memory, Network)
- Anomaly detection (High CPU on server-web-01)
- Remediation recommendation
- Tool execution traces

### Incident Review
**Prompt:** "Show recent incidents"

**Response includes:**
- Active incident count
- Priority incidents with severity
- Affected systems
- Recommendations

### Security Audit
**Prompt:** "Run security audit"

**Response includes:**
- Compliance status percentage
- Security findings
- Remediation priorities
- Affected resources

### Generic Queries
**Prompt:** Any other question

**Response includes:**
- Acknowledgment of query
- Orchestrator routing explanation
- Phase 1 capabilities summary
- Instructions for live mode

## Switching to Live Mode

To enable **real backend integration** with actual agent orchestration:

### 1. Start Backend
```bash
./start-backend.sh
```

### 2. Verify Backend
```bash
curl http://localhost:8080/health
```

### 3. Refresh Frontend
The frontend automatically detects the backend and switches to live mode:
- Real WebSocket streaming
- Actual tool execution
- Live orchestrator routing
- Backend-generated responses

## Demo Mode Banner

The console displays a blue info banner when in demo mode:
```
ℹ️ Frontend Demo Mode - Backend Optional

This console works standalone with intelligent demo responses. 
For live agent interactions with real tool execution, 
start the backend: ./start-backend.sh
```

## For Netlify Deployment

When deployed to Netlify for judges:
1. Build: `npm run build`
2. Deploy: Upload `out/` folder
3. Share: `https://your-app.netlify.app/agents/chat`

**Judges can immediately interact** - no backend setup required!

## Technical Details

### Connection Timeout
- **WebSocket connection timeout:** 2 seconds
- **Fallback trigger:** Connection error or timeout
- **Error suppression:** All connection errors silently handled

### Demo Response Generation
Located in: `src/components/agents/AgentChat.tsx`

```typescript
const generateDemoResponse = (prompt: string): string => {
  const promptLower = prompt.toLowerCase();
  
  // Intent detection
  if (promptLower.includes('health') || promptLower.includes('check')) {
    return healthCheckResponse;
  }
  
  if (promptLower.includes('incident') || promptLower.includes('issue')) {
    return incidentResponse;
  }
  
  // ... more intent handlers
}
```

### Tool Trace Simulation
```typescript
if (onToolTrace) {
  setTimeout(() => {
    onToolTrace({ 
      tool_name: 'query_client_inventory', 
      status: 'completed', 
      duration_ms: 245 
    });
  }, 300);
  
  setTimeout(() => {
    onToolTrace({ 
      tool_name: 'analyze_cloudwatch_metrics', 
      status: 'completed', 
      duration_ms: 312 
    });
  }, 600);
}
```

## Benefits for Hackathon

### For Judges
✅ Instant access - no setup required
✅ Full UI/UX experience
✅ Realistic demo data
✅ No technical barriers

### For Demo
✅ Always works (no backend dependencies)
✅ Fast responses (no network latency)
✅ Consistent behavior (deterministic)
✅ Professional appearance

### For Development
✅ Frontend development without backend
✅ UI testing without infrastructure
✅ Faster iteration cycles
✅ No AWS credentials needed

## Comparison: Demo Mode vs Live Mode

| Feature | Demo Mode | Live Mode (Backend Connected) |
|---------|-----------|-------------------------------|
| Response Speed | Instant (<100ms) | Real (500ms-2s) |
| Tool Execution | Simulated | Real AWS API calls |
| Streaming Tokens | No streaming | Real Bedrock streaming |
| Agent Orchestration | Simulated | Real routing logic |
| Tool Results | Static demo data | Live CloudWatch/EC2 data |
| Action Execution | Status simulation | Real SSM execution |
| Setup Required | None | Backend + dependencies |
| AWS Credentials | Not needed | Optional (mock mode) |

## Future Enhancements (Phase 2)

When Phase 2 is implemented, live mode will add:
- Real Bedrock model streaming (Claude Sonnet 4)
- AgentCore Memory (conversation context)
- Multiple specialist agents (Incident, Compliance, etc.)
- MCP server integration
- Real-time guardrails
- Production-ready deployment

---

**Current Status:** Phase 1 Complete - Demo Mode Fully Functional ✅

The frontend is ready for Netlify deployment and judge review!

