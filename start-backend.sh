#!/bin/bash

# Start script for RMM Agent Backend
# Usage: ./start-backend.sh [--prod]

set -e

echo "🚀 Starting RMM Agent Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing dependencies..."
pip install -q -r deployment/requirements.txt

# Set default environment variables
export MOCK_MODE=${MOCK_MODE:-true}
export API_HOST=${API_HOST:-0.0.0.0}
export API_PORT=${API_PORT:-8080}
export LOG_LEVEL=${LOG_LEVEL:-INFO}
export CORS_ORIGINS=${CORS_ORIGINS:-"http://localhost:3000,https://deft-vacherin-809e6c.netlify.app"}

# Check for production mode
if [ "$1" == "--prod" ]; then
    echo "🔧 Running in PRODUCTION mode"
    export MOCK_MODE=false
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        echo "⚠️  Warning: AWS credentials not set. Ensure IAM role is configured or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    fi
else
    echo "🔧 Running in DEMO/MOCK mode (no AWS credentials required)"
fi

echo ""
echo "✅ Configuration:"
echo "   - MOCK_MODE: $MOCK_MODE"
echo "   - API_HOST: $API_HOST"
echo "   - API_PORT: $API_PORT"
echo "   - LOG_LEVEL: $LOG_LEVEL"
echo ""
echo "🌐 API will be available at: http://$API_HOST:$API_PORT"
echo "🏥 Health check: http://$API_HOST:$API_PORT/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run the application
cd backend
python3 app.py

