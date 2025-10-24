#!/bin/bash

# Test script for RMM Agent Backend
# Tests all API endpoints with sample data

set -e

BASE_URL="http://localhost:8080"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing RMM Agent Backend"
echo "=============================="
echo ""

# Check if backend is running
echo -n "1. Testing health check... "
HEALTH=$(curl -s $BASE_URL/health || echo "FAILED")
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   Response: $(echo $HEALTH | jq -r '.status')"
else
    echo -e "${RED}✗ FAIL - Backend not running?${NC}"
    echo "   Please start the backend with: ./start-backend.sh"
    exit 1
fi
echo ""

# Test agent invocation
echo -n "2. Testing agent invocation... "
INVOKE_RESPONSE=$(curl -s -X POST $BASE_URL/api/agent/invoke \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Check health status", "clientId": "demo-client-001"}' \
  || echo "FAILED")

if echo "$INVOKE_RESPONSE" | grep -q "sessionId"; then
    echo -e "${GREEN}✓ PASS${NC}"
    SESSION_ID=$(echo $INVOKE_RESPONSE | jq -r '.sessionId')
    echo "   Session ID: $SESSION_ID"
    echo "   Status: $(echo $INVOKE_RESPONSE | jq -r '.status')"
    echo "   Routed to: $(echo $INVOKE_RESPONSE | jq -r '.result.routed_to')"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $INVOKE_RESPONSE"
    exit 1
fi
echo ""

# Test session retrieval
echo -n "3. Testing session retrieval... "
SESSION_RESPONSE=$(curl -s $BASE_URL/api/agent/session/$SESSION_ID || echo "FAILED")
if echo "$SESSION_RESPONSE" | grep -q "session_id"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   Retrieved session: $SESSION_ID"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $SESSION_RESPONSE"
fi
echo ""

# Test action approval
echo -n "4. Testing action approval... "
ACTION_RESPONSE=$(curl -s -X POST $BASE_URL/api/agent/action \
  -H "Content-Type: application/json" \
  -d '{"actionId": "test-action-001", "approve": true, "comment": "Automated test"}' \
  || echo "FAILED")

if echo "$ACTION_RESPONSE" | grep -q "approved"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   Action ID: $(echo $ACTION_RESPONSE | jq -r '.actionId')"
    echo "   Status: $(echo $ACTION_RESPONSE | jq -r '.status')"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $ACTION_RESPONSE"
fi
echo ""

# Test action rejection
echo -n "5. Testing action rejection... "
REJECT_RESPONSE=$(curl -s -X POST $BASE_URL/api/agent/action \
  -H "Content-Type: application/json" \
  -d '{"actionId": "test-action-002", "approve": false, "comment": "Automated test rejection"}' \
  || echo "FAILED")

if echo "$REJECT_RESPONSE" | grep -q "rejected"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   Action ID: $(echo $REJECT_RESPONSE | jq -r '.actionId')"
    echo "   Status: $(echo $REJECT_RESPONSE | jq -r '.status')"
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Response: $REJECT_RESPONSE"
fi
echo ""

# Test different prompts
echo "6. Testing different agent prompts..."
echo ""

PROMPTS=(
  "Check health for demo-client-001"
  "Show recent incidents"
  "Run security audit"
  "Predict capacity issues"
  "Generate weekly report"
)

for prompt in "${PROMPTS[@]}"; do
    echo -n "   Testing: \"$prompt\"... "
    RESPONSE=$(curl -s -X POST $BASE_URL/api/agent/invoke \
      -H "Content-Type: application/json" \
      -d "{\"prompt\": \"$prompt\", \"clientId\": \"demo-client-001\"}" \
      || echo "FAILED")
    
    if echo "$RESPONSE" | grep -q "routed_to"; then
        ROUTED=$(echo $RESPONSE | jq -r '.result.routed_to')
        echo -e "${GREEN}✓ PASS${NC} (routed to: $ROUTED)"
    else
        echo -e "${RED}✗ FAIL${NC}"
    fi
done
echo ""

# Summary
echo "=============================="
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Backend is ready for demo. Key endpoints:"
echo "  - Health: $BASE_URL/health"
echo "  - Invoke: $BASE_URL/api/agent/invoke"
echo "  - Actions: $BASE_URL/api/agent/action"
echo "  - WebSocket: ws://localhost:8080/ws/agent/stream"
echo ""
echo "Frontend integration:"
echo "  - Set NEXT_PUBLIC_AGENT_API_URL=$BASE_URL"
echo "  - Navigate to /agents/chat"
echo "  - Start chatting with the agent!"
echo ""

