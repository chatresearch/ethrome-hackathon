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
  echo -e "${BLUE}[1/4] Starting BuidlGuidl frontend on port $BUILDGUIDL_PORT...${NC}"
  cd "$PROJECT_ROOT/eth-ai-asa"
  yarn start > /tmp/buildguidl.log 2>&1 &
  BUILDGUIDL_PID=$!
  sleep 6cd 
  
  if ! ps -p $BUILDGUIDL_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ BuidlGuidl failed to start. Check /tmp/buildguidl.log:${NC}"
    tail -20 /tmp/buildguidl.log
    return 1
  fi
  echo -e "${GREEN}✓ BuidlGuidl started (PID: $BUILDGUIDL_PID)${NC}"
}

# Function to start ElizaOS
start_elizaos() {
  echo -e "${BLUE}[2/4] Starting ElizaOS agents on port $ELIZAOS_PORT...${NC}"
  cd "$PROJECT_ROOT/agent-marketplace"
  bun run elizaos start --port $ELIZAOS_PORT > /tmp/elizaos.log 2>&1 &
  ELIZAOS_PID=$!
  sleep 8
  
  if ! ps -p $ELIZAOS_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ ElizaOS failed to start. Check /tmp/elizaos.log:${NC}"
    tail -20 /tmp/elizaos.log
    return 1
  fi
  echo -e "${GREEN}✓ ElizaOS started (PID: $ELIZAOS_PID)${NC}"
}

# Function to start XMTP Agent
start_xmtp() {
  echo -e "${BLUE}[3/4] Starting XMTP Agent on port $XMTP_PORT...${NC}"
  cd "$PROJECT_ROOT/xmtp-agent"
  HTTP_PORT=$XMTP_PORT ELIZAOS_PORT=$ELIZAOS_PORT npm run dev > /tmp/xmtp.log 2>&1 &
  XMTP_PID=$!
  sleep 4
  
  if ! ps -p $XMTP_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ XMTP Agent failed to start. Check /tmp/xmtp.log:${NC}"
    tail -20 /tmp/xmtp.log
    return 1
  fi
  echo -e "${GREEN}✓ XMTP Agent started (PID: $XMTP_PID)${NC}"
}

# Function to start Miniapp
start_miniapp() {
  echo -e "${BLUE}[4/4] Starting Protocol Council Miniapp on port $MINIAPP_PORT...${NC}"
  cd "$PROJECT_ROOT/protocol-council-miniapp"
  npm run dev > /tmp/miniapp.log 2>&1 &
  MINIAPP_PID=$!
  sleep 3
  
  if ! ps -p $MINIAPP_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Miniapp failed to start. Check /tmp/miniapp.log:${NC}"
    tail -20 /tmp/miniapp.log
    return 1
  fi
  echo -e "${GREEN}✓ Miniapp started (PID: $MINIAPP_PID)${NC}"
}

# Function to stop BuidlGuidl
stop_buildguidl() {
  echo -e "${BLUE}Stopping BuidlGuidl frontend...${NC}"
  pkill -f "yarn start.*eth-ai-asa" 2>/dev/null || true
  echo -e "${GREEN}✓ BuidlGuidl stopped${NC}"
}

# Function to stop ElizaOS
stop_elizaos() {
  echo -e "${BLUE}Stopping ElizaOS agents...${NC}"
  pkill -f "bun run elizaos start.*agent-marketplace" 2>/dev/null || true
  echo -e "${GREEN}✓ ElizaOS stopped${NC}"
}

# Function to stop XMTP Agent
stop_xmtp() {
  echo -e "${BLUE}Stopping XMTP Agent...${NC}"
  pkill -f "HTTP_PORT=$XMTP_PORT" 2>/dev/null || true
  pkill -f "tsx src/index.ts.*xmtp-agent" 2>/dev/null || true
  echo -e "${GREEN}✓ XMTP Agent stopped${NC}"
}

# Function to stop Miniapp
stop_miniapp() {
  echo -e "${BLUE}Stopping Protocol Council Miniapp...${NC}"
  pkill -f "npm run dev.*protocol-council-miniapp" 2>/dev/null || true
  echo -e "${GREEN}✓ Miniapp stopped${NC}"
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
    echo "  - BuidlGuidl: http://localhost:$BUILDGUIDL_PORT"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    echo "  - Miniapp: http://localhost:$MINIAPP_PORT"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    echo "  - XMTP API: http://localhost:$XMTP_PORT/api/message"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    echo "  - ElizaOS: http://localhost:$ELIZAOS_PORT"
  fi
  echo ""
  echo "Logs:"
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "buildguidl" ]; then
    echo "  - BuidlGuidl: tail -f /tmp/buildguidl.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "elizaos" ]; then
    echo "  - ElizaOS: tail -f /tmp/elizaos.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "xmtp" ]; then
    echo "  - XMTP: tail -f /tmp/xmtp.log"
  fi
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    echo "  - Miniapp: tail -f /tmp/miniapp.log"
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
  fi
  
  if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "miniapp" ]; then
    stop_miniapp
  fi
  
  echo ""
  echo -e "${GREEN}=== Services Stopped ===${NC}"
  echo ""
fi
