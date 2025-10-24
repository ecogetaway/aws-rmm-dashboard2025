#!/usr/bin/env python3
"""Test script for Bedrock integration"""
import asyncio
from bedrock import BedrockModel
from agents import OrchestratorAgent
from config import config

async def test_bedrock_model():
    """Test basic Bedrock model invocation"""
    print("=" * 60)
    print("Testing Bedrock Model Integration")
    print("=" * 60)
    
    # Initialize model
    print(f"\n1. Initializing BedrockModel...")
    print(f"   Model ID: {config.BEDROCK_MODEL_ID}")
    print(f"   Region: {config.AWS_REGION}")
    print(f"   Mock Mode: {config.MOCK_MODE}")
    
    model = BedrockModel()
    
    # Test basic invocation
    print(f"\n2. Testing basic invocation...")
    response = model.invoke(
        prompt="What is Amazon Bedrock?",
        system="You are a helpful AI assistant."
    )
    print(f"   Response: {response['content'][:200]}...")
    print(f"   Model: {response['model']}")
    print(f"   Usage: {response.get('usage', {})}")
    
    # Test streaming
    print(f"\n3. Testing streaming invocation...")
    print("   Stream output: ", end='', flush=True)
    
    stream = model.invoke_stream(
        prompt="Explain cloud monitoring in one sentence.",
        system="Be concise and technical."
    )
    
    full_response = []
    for event in stream:
        if event.get('type') == 'token':
            content = event.get('content', '')
            print(content, end='', flush=True)
            full_response.append(content)
        elif event.get('type') == 'complete':
            print(f"\n   Stop reason: {event.get('stop_reason')}")
    
    print(f"\n   Full response: {''.join(full_response)}")
    
    print("\n✅ Bedrock model tests completed successfully!")

async def test_orchestrator():
    """Test orchestrator agent with Bedrock"""
    print("\n" + "=" * 60)
    print("Testing Orchestrator Agent")
    print("=" * 60)
    
    # Initialize
    print(f"\n1. Initializing Orchestrator with Bedrock...")
    model = BedrockModel()
    orchestrator = OrchestratorAgent(bedrock_model=model)
    
    # Test general query
    print(f"\n2. Testing general query routing...")
    response = await orchestrator.invoke(
        prompt="What are the benefits of using AWS Bedrock for AI workloads?",
        client_id="test-client-001"
    )
    print(f"   Routed to: {response.get('routed_to')}")
    print(f"   Status: {response.get('status')}")
    print(f"   Response preview: {response.get('response', '')[:150]}...")
    
    # Test incident query
    print(f"\n3. Testing incident routing...")
    response = await orchestrator.invoke(
        prompt="High CPU alert on server prod-web-01, please diagnose and fix",
        client_id="test-client-001"
    )
    print(f"   Routed to: {response.get('routed_to')}")
    print(f"   Incident ID: {response.get('incident_id')}")
    print(f"   Root cause confidence: {response.get('confidence', 0) * 100}%")
    print(f"   Tools used: {', '.join(response.get('tools_used', []))}")
    print(f"   Remediation actions: {len(response.get('remediation_plan', {}).get('actions', []))}")
    
    # Test streaming
    print(f"\n4. Testing streaming response...")
    print("   Stream output:")
    print("   " + "-" * 56)
    
    token_count = 0
    async for event in orchestrator.invoke_stream(
        prompt="Analyze memory usage spike on database server",
        client_id="test-client-001"
    ):
        if event.get('type') == 'token':
            print(event.get('content', ''), end='', flush=True)
            token_count += 1
        elif event.get('type') == 'routing':
            print(f"\n   [Routed to: {event.get('data', {}).get('routed_to')}]")
        elif event.get('type') == 'metadata':
            print(f"\n   [Metadata: {event.get('data', {})}]")
    
    print(f"\n   " + "-" * 56)
    print(f"   Total tokens streamed: {token_count}")
    
    print("\n✅ Orchestrator tests completed successfully!")

async def main():
    """Main test runner"""
    try:
        await test_bedrock_model()
        await test_orchestrator()
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start the backend: ./start-backend.sh")
        print("2. Test WebSocket: python test_websocket.py")
        print("3. Start the frontend: npm run dev")
        print(f"4. Visit: http://localhost:3002/agents/chat")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())

