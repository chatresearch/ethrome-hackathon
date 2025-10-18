#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Port configuration
BUILDGUIDL_PORT=3000
ELIZAOS_PORT=3002
XMTP_PORT=3003
MINIAPP_PORT=5174
NGROK_CONFIG_FILE="$PROJECT_ROOT/.ngrok-url"

# Function to show usage
usage() {
  cat << USAGE
Protocol Council Stack Manager

Usage:
  ./start-all.sh [command] [service]

Commands:
  start [service]    Start services (all by default)
  stop [service]     Stop services (all by default)

Services:
  buildguidl         BuidlGuidl frontend (port 3000)
  elizaos            ElizaOS agents (port 3002)
  xmtp               XMTP Agent API (port 3003)
  miniapp            Protocol Council Miniapp (port 5174)
  all                All services (default)

Examples:
  ./start-all.sh start              # Start all services
  ./start-all.sh start miniapp      # Start only miniapp
  ./start-all.sh stop               # Stop all services
  ./start-all.sh stop elizaos       # Stop only ElizaOS

USAGE
}

# Function to start BuidlGuidl
start_buildguidl() {
  echo -e "${BLUE}[1/4] Starting BuidlGuidl on port $BUILDGUIDL_PORT${NC}"
  cd "$PROJECT_ROOT/eth-ai-asa"
  yarn start > /tmp/buildguidl.log 2>&1 &
  BUILDGUIDL_PID=$!
  sleep 6
  
  if ! ps -p $BUILDGUIDL_PID > /dev/null 2>&1; then
    echo -e "${RED}BuidlGuidl failed. Check /tmp/buildguidl.log${NC}"
    tail -5 /tmp/buildguidl.log
    return 1
  fi
  echo -e "${GREEN}OK BuidlGuidl (PID: $BUILDGUIDL_PID)${NC}"
}

# Function to start ElizaOS
start_elizaos() {
  echo -e "${BLUE}[2/4] Starting ElizaOS on port $ELIZAOS_PORT${NC}"
  cd "$PROJECT_ROOT/agent-marketplace"
  elizaos start --port $ELIZAOS_PORT > /tmp/elizaos.log 2>&1 &
  ELIZAOS_PID=$!
  sleep 8
  
  if ! ps -p $ELIZAOS_PID > /dev/null 2>&1; then
    echo -e "${RED}ElizaOS failed. Check /tmp/elizaos.log${NC}"
    tail -5 /tmp/elizaos.log
    return 1
  fi
  echo -e "${GREEN}OK ElizaOS (PID: $ELIZAOS_PID)${NC}"
}

# Function to start XMTP Agent
start_xmtp() {
  echo -e "${BLUE}[3/4] Starting XMTP Agent on port $XMTP_PORT${NC}"
  cd "$PROJECT_ROOT/xmtp-agent"
  HTTP_PORT=$XMTP_PORT ELIZAOS_PORT=$ELIZAOS_PORT npm run dev > /tmp/xmtp.log 2>&1 &
  XMTP_PID=$!
  sleep 4
  
  if ! ps -p $XMTP_PID > /dev/null 2>&1; then
    echo -e "${RED}XMTP Agent failed. Check /tmp/xmtp.log${NC}"
    tail -5 /tmp/xmtp.log
    return 1
  fi
  echo -e "${GREEN}OK XMTP Agent (PID: $XMTP_PID)${NC}"
}

# Function to start Miniapp
start_miniapp() {
  echo -e "${BLUE}[4/4] Starting Miniapp on port $MINIAPP_PORT${NC}"
  cd "$PROJECT_ROOT/protocol-council-miniapp"
  npm run dev > /tmp/miniapp.log 2>&1 &
  MINIAPP_PID=$!
  sleep 3
  
  if ! ps -p $MINIAPP_PID > /dev/null 2>&1; then
    echo -e "${RED}Miniapp failed. Check /tmp/miniapp.log${NC}"
    tail -5 /tmp/miniapp.log
    return 1
  fi
  echo -e "${GREEN}OK Miniapp (PID: $MINIAPP_PID)${NC}"
}

# Function to start ngrok tunnel for XMTP
start_ngrok() {
  echo -e "${BLUE}[5/5] Starting ngrok tunnel${NC}"
  
  if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}ngrok not found. Install: npm install -g ngrok${NC}"
    return 1
  fi
  
  pkill -f "ngrok" 2>/dev/null || true
  sleep 1
  
  ngrok http $XMTP_PORT --log=stderr > /tmp/ngrok.log 2>&1 &
  NGROK_PID=$!
  sleep 3
  
  NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1)
  
  if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}Failed to get ngrok URL${NC}"
    tail -5 /tmp/ngrok.log
    return 1
  fi
  
  echo "$NGROK_URL" > "$NGROK_CONFIG_FILE"
  
  echo -e "${GREEN}OK ngrok (PID: $NGROK_PID)${NC}"
  echo "URL: $NGROK_URL"
  
  # Auto-sync to Vercel if vercel CLI is available
  if command -v vercel &> /dev/null; then
    echo "Syncing ngrok URL to Vercel..."
    cd "$PROJECT_ROOT/protocol-council-miniapp"
    vercel env rm REACT_APP_XMTP_API --yes 2>/dev/null || true
    echo "$NGROK_URL" | vercel env add REACT_APP_XMTP_API production 2>/dev/null
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Vercel env updated. Redeploy with: vercel --prod${NC}"
    fi
  fi
}

# Function to stop BuidlGuidl
stop_buildguidl() {
  pkill -f "yarn start.*eth-ai-asa" 2>/dev/null || true
  echo -e "${GREEN}Stopped BuidlGuidl${NC}"
}

# Function to stop ElizaOS
stop_elizaos() {
  pkill -f "bun run elizaos start.*agent-marketplace" 2>/dev/null || true
  echo -e "${GREEN}Stopped ElizaOS${NC}"
}

# Function to stop XMTP Agent
stop_xmtp() {
  pkill -f "HTTP_PORT=$XMTP_PORT" 2>/dev/null || true
  pkill -f "tsx src/index.ts.*xmtp-agent" 2>/dev/null || true
  echo -e "${GREEN}Stopped XMTP${NC}"
}

# Function to stop Miniapp
stop_miniapp() {
  pkill -f "npm run dev.*protocol-council-miniapp" 2>/dev/null || true
  echo -e "${GREEN}Stopped Miniapp${NC}"
}

# Function to stop ngrok
stop_ngrok() {
  pkill -f "ngrok" 2>/dev/null || true
  rm -f "$NGROK_CONFIG_FILE"
  echo -e "${GREEN}Stopped ngrok${NC}"
}

# Parse arguments
COMMAND=${1:-start}
SERVICE=${2:-all}

if [ "$COMMAND" = "-h" ] || [ "$COMMAND" = "--help" ]; then
  usage
  exit 0
fi

if [ "$COMMAND" != "start" ] && [ "$COMMAND" != "stop" ]; then
  echo -e "${RED}Invalid command: $COMMAND${NC}"
  usage
  exit 1
fi

if [ "$SERVICE" != "buildguidl" ] && [ "$SERVICE" != "elizaos" ] && [ "$SERVICE" != "xmtp" ] && [ "$SERVICE" != "miniapp" ] && [ "$SERVICE" != "all" ]; then
  echo -e "${RED}Invalid service: $SERVICE${NC}"
  usage
  exit 1
fi

echo ""
echo -e "${BLUE}=== Protocol Council Stack Manager ===${NC}"
echo -e "${BLUE}Command: $COMMAND${NC}"
echo -e "${BLUE}Service: $SERVICE${NC}"
echo ""

# Handle start command
if [ "$COMMAND" = "start" ]; then
  # Kill any existing processes first
  echo -e "${BLUE}Cleaning up old processes...${NC}"
  pkill -f "npm run dev|npm run start|bun run start|yarn start" 2>/dev/null || true
  sleep 2
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "buildguidl" ]; then
    start_buildguidl || exit 1
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    start_elizaos || exit 1
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    start_xmtp || exit 1
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    start_miniapp || exit 1
  fi
  
  echo ""
  echo -e "${GREEN}=== All Requested Services Running ===${NC}"
  echo ""
  echo "URLs:"
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "buildguidl" ]; then
    echo "  BuidlGuidl: http://localhost:$BUILDGUIDL_PORT"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    echo "  Miniapp: http://localhost:$MINIAPP_PORT"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    echo "  XMTP API: http://localhost:$XMTP_PORT/api/message"
    echo "  Starting ngrok tunnel for production deployment..."
    start_ngrok
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    echo "  ElizaOS: http://localhost:$ELIZAOS_PORT"
  fi
  echo ""
  echo "Logs:"
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "buildguidl" ]; then
    echo "  tail -f /tmp/buildguidl.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    echo "  tail -f /tmp/elizaos.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    echo "  tail -f /tmp/xmtp.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    echo "  tail -f /tmp/miniapp.log"
  fi
  echo ""
  echo "To stop services: ./start-all.sh stop [service]"
  echo ""
  
  # Keep running if starting all
  if [ "$SERVICE" = "all" ]; then
    wait
  fi

# Handle stop command
elif [ "$COMMAND" = "stop" ]; then
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "buildguidl" ]; then
    stop_buildguidl
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    stop_elizaos
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    stop_xmtp
    stop_ngrok
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    stop_miniapp
  fi
  
  echo ""
  echo -e "${GREEN}=== Services Stopped ===${NC}"
  echo ""
fi
