# Frontend Integration Plan: Existing Dashboard + Phase 1 Agent Console

## Question: How does Phase 1 integrate with the existing frontend?

**Short Answer:** They work together as **one unified application**. The existing dashboard (home, servers, analytics, etc.) remains unchanged. Phase 1 adds a **new Agent Console page** alongside the existing pages.

---

## Current Architecture

### Existing Frontend (Already Deployed on Netlify)
```
https://deft-vacherin-809e6c.netlify.app/

Pages:
├── / (Overview Dashboard)           ← Existing, unchanged
├── /servers                          ← Existing, unchanged  
├── /agents                           ← Existing, unchanged (Agent Status page)
├── /incidents                        ← Existing, unchanged
├── /analytics                        ← Existing, unchanged
└── /settings                         ← Existing, unchanged
```

**What's on these pages:**
- Real-time metrics and KPIs
- Server health monitoring with filters
- Incident timeline with auto-remediation
- Alert panels with acknowledge/fix buttons
- System health charts with live updates

### Phase 1 Addition: Agent Console
```
NEW Page:
└── /agents/chat                      ← NEW Phase 1 feature
```

**What's on this new page:**
- Interactive chat with AI orchestrator
- Real-time tool execution monitoring
- Autonomous action approval workflow
- Agent activity metrics

---

## Integration Model: **Additive, Not Replacement**

### Navigation Structure
```
Sidebar Navigation:
├── Overview (/)                      [Existing]
├── Agent Console (/agents/chat)      [NEW - Phase 1] ← Added to menu
├── Servers (/servers)                [Existing]
├── AI Agents (/agents)               [Existing]
├── Incidents (/incidents)            [Existing]
├── Analytics (/analytics)            [Existing]
└── Settings (/settings)              [Existing]
```

The Agent Console is added as a **new menu item** in `DashboardLayout.tsx` with a "New" badge.

---

## Phase 2: Enhanced Integration

### Phase 2 Will ADD More Features to Existing Pages

#### 1. **Home Dashboard (/)** - Enhanced with Real Agent Data
**Current (Existing):**
- Mock data for metrics
- Simulated agent status
- Static health indicators

**Phase 2 Enhancement:**
- Live agent status from backend
- Real-time tool execution metrics
- Actual CloudWatch/EC2 data via backend tools
- Agent-generated insights in "AI Agent Status" widget

**Implementation:**
```typescript
// Existing component stays, but data source changes
<AIAgentStatus 
  agents={mockAgents}  // Current
  // ↓ Phase 2
  agents={fetchAgentStatus()}  // From backend API
/>
```

#### 2. **Servers Page (/servers)** - AI-Powered Recommendations
**Current (Existing):**
- Manual server list
- Static health indicators
- User-initiated actions

**Phase 2 Enhancement:**
- Agent-generated recommendations
- Auto-remediation suggestions
- Predictive alerts from Predictive Agent
- Link to Agent Console for detailed analysis

**New Feature:**
```typescript
<ServerRecommendations 
  serverId="i-abc123"
  recommendations={agentApi.getRecommendations(serverId)}
/>
```

#### 3. **Incidents Page (/incidents)** - AI-Driven Insights
**Current (Existing):**
- Incident timeline
- Manual resolution tracking

**Phase 2 Enhancement:**
- Incident Agent analysis
- Root cause from backend
- Auto-resolution via Agent Console
- Link incidents to agent actions

#### 4. **Analytics Page (/analytics)** - Agent Performance Metrics
**Current (Existing):**
- Static analytics
- Mock data trends

**Phase 2 Enhancement:**
- Agent performance dashboard
- Tool execution statistics
- ROI calculations from actual data
- Reporting Agent integration

---

## How They Work Together

### User Journey Example: Health Check with Remediation

#### **Step 1: User sees alert on Home Dashboard**
```
Page: / (Overview)
User sees: "High CPU on server-web-01" in AlertsPanel
Action: Clicks "Fix" button
```

#### **Step 2: Navigate to Agent Console**
```
Page: /agents/chat (NEW Phase 1)
Auto-populated prompt: "Check health and fix server-web-01"
Agent orchestrates: Monitoring Agent → CloudWatch + Inventory tools
```

#### **Step 3: Agent proposes action**
```
Page: /agents/chat
Autonomous Actions Panel shows: "Restart httpd service"
User: Clicks "Approve"
Backend: Executes via SSM remediation tool
```

#### **Step 4: Confirmation on Home Dashboard**
```
Page: / (Overview)
Updated: Alert cleared, new incident created (auto-resolved)
IncidentTimeline shows: "Auto-remediation successful"
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Existing Pages          New Page (Phase 1)                  │
│  ┌────────────┐         ┌──────────────────┐                │
│  │ Overview   │◄────────┤ Agent Console    │                │
│  │ (/page)    │  Link   │ (/agents/chat)   │                │
│  │            │         │                  │                │
│  │ - Alerts   │         │ - Chat           │                │
│  │ - Metrics  │         │ - Tool Traces    │                │
│  │ - Agents   │         │ - Actions        │                │
│  └────────────┘         └──────────────────┘                │
│       │                          │                           │
│       └──────────┬───────────────┘                          │
│                  ▼                                           │
│         ┌─────────────────┐                                 │
│         │  agentApi.ts    │  (Shared API Client)           │
│         └─────────────────┘                                 │
│                  │                                           │
└──────────────────┼───────────────────────────────────────────┘
                   ▼
    ┌─────────────────────────────┐
    │   Backend (Flask)            │
    │   - Orchestrator             │
    │   - Monitoring Agent         │
    │   - Tools (CW, EC2, SSM)     │
    └─────────────────────────────┘
```

---

## Deployment Strategy

### Current Deployment (Netlify)
```
Build: npm run build
Output: out/
Deploy: Netlify static hosting

URL: https://deft-vacherin-809e6c.netlify.app/
```

**All pages work:**
- Existing pages: Use mock data (current behavior)
- Agent Console: Demo mode with fallback responses

### Phase 2 Deployment Options

#### **Option A: Frontend + Backend Separate** (Recommended)
```
Frontend (Netlify):
- URL: https://deft-vacherin-809e6c.netlify.app/
- Pages: All existing + /agents/chat
- Mode: Demo mode by default, connects to backend if available

Backend (AWS):
- Deploy: Docker container to AWS (ECS/Fargate/EC2)
- OR: Bedrock AgentCore runtime (Phase 3)
- API: https://api-rmm.your-domain.com
- CORS: Configured for Netlify frontend

Frontend Config:
NEXT_PUBLIC_AGENT_API_URL=https://api-rmm.your-domain.com
```

#### **Option B: Full Stack on AWS** (Future)
```
Both frontend + backend on AWS:
- Frontend: S3 + CloudFront
- Backend: ECS/Fargate
- Same domain: https://rmm.your-domain.com
```

---

## Phase 2 Enhancement Plan

### What Changes in Existing Pages

#### 1. **Overview Dashboard (/)**
```typescript
// BEFORE (Phase 1)
const dashboardData = generateMockData()
useEffect(() => { updateMockData() }, [])

// AFTER (Phase 2)
const dashboardData = useMemo(async () => {
  // Try backend first
  try {
    const response = await agentApi.invokeAgent({
      prompt: "Get system overview",
      clientId: selectedClient
    })
    return response.result
  } catch {
    // Fallback to mock
    return generateMockData()
  }
}, [selectedClient])
```

#### 2. **Alerts Panel Integration**
```typescript
// BEFORE (Phase 1)
<AlertsPanel 
  alerts={mockAlerts}
  onAutoRemediate={(id) => {
    // Simulate remediation
    markAsFixed(id)
  }}
/>

// AFTER (Phase 2)
<AlertsPanel 
  alerts={mockAlerts}
  onAutoRemediate={(id) => {
    // Navigate to Agent Console with context
    router.push(`/agents/chat?action=remediate&alertId=${id}`)
  }}
/>
```

#### 3. **AI Agent Status Widget**
```typescript
// BEFORE (Phase 1)
<AIAgentStatus agents={[
  { name: 'Monitor', status: 'active', accuracy: 95 }
]} />

// AFTER (Phase 2)
<AIAgentStatus 
  agents={await agentApi.getAgentStatus()}
  onViewAgent={(agentId) => {
    router.push(`/agents/chat?agent=${agentId}`)
  }}
/>
```

---

## File Structure (How They Coexist)

```
src/
├── app/
│   ├── page.tsx                      [Existing] - Overview Dashboard
│   ├── servers/page.tsx              [Existing] - Servers
│   ├── agents/
│   │   ├── page.tsx                  [Existing] - Agent Status
│   │   └── chat/
│   │       ├── page.tsx              [NEW Phase 1] - Agent Console
│   │       └── error.tsx             [NEW Phase 1] - Error boundary
│   ├── incidents/page.tsx            [Existing] - Incidents
│   ├── analytics/page.tsx            [Existing] - Analytics
│   └── settings/page.tsx             [Existing] - Settings
│
├── components/
│   ├── alerts/
│   │   └── AlertsPanel.tsx           [Existing] - Alerts widget
│   ├── agents/
│   │   ├── AIAgentStatus.tsx         [Existing] - Agent status widget
│   │   ├── AgentChat.tsx             [NEW Phase 1] - Chat interface
│   │   ├── AgentActivity.tsx         [NEW Phase 1] - Activity monitor
│   │   └── ActionsPanel.tsx          [NEW Phase 1] - Actions panel
│   ├── servers/
│   │   └── ServerStatus.tsx          [Existing] - Server list
│   └── layout/
│       └── DashboardLayout.tsx       [Modified] - Added Agent Console link
│
└── lib/
    ├── mockData.ts                   [Existing] - Mock data generator
    └── agentApi.ts                   [NEW Phase 1] - Backend API client
```

---

## Summary: Integration Approach

### ✅ What Phase 1 Does
- **Adds** `/agents/chat` page (Agent Console)
- **Adds** new components (AgentChat, AgentActivity, ActionsPanel)
- **Adds** backend API client (`agentApi.ts`)
- **Modifies** navigation (added "Agent Console" menu item)
- **Keeps** all existing pages unchanged
- **Works** standalone with demo mode (no backend required)

### 🔄 What Phase 2 Will Do
- **Enhances** existing pages with live backend data
- **Connects** existing widgets to agent backend
- **Adds** cross-page integration (link alerts → agent console)
- **Enables** real-time updates from agents
- **Maintains** demo mode fallback for all pages

### 🎯 Result
**One unified application** where:
- Judges see existing dashboard + new Agent Console
- All pages work together seamlessly
- Backend is optional (demo mode always works)
- Phase 2 enhances without breaking Phase 1

---

## For Your Hackathon Submission

**When judges visit:** `https://deft-vacherin-809e6c.netlify.app/`

They will see:
1. **Existing pages** (Overview, Servers, etc.) - Working with mock data
2. **NEW "Agent Console"** menu item with "New" badge
3. Click Agent Console → See Phase 1 demo mode
4. All features functional, no backend needed

**Competitive advantage:**
- ✅ Full demo without infrastructure
- ✅ Shows multi-agent architecture
- ✅ Professional UI across all pages
- ✅ Clear roadmap (Phase 1 → 2 → 3)

---

**Bottom line:** Phase 1 is **additive**. The existing frontend stays as-is, and we've added a powerful new Agent Console that works standalone. Phase 2 will make everything even better by connecting the dots! 🚀

