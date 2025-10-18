#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Vercel Deploy with ngrok Sync ===${NC}"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}❌ Vercel CLI not found. Install: npm install -g vercel${NC}"
  exit 1
fi

# Check if ngrok is running
echo -e "${BLUE}Checking ngrok status...${NC}"
if ! pgrep -f "ngrok" > /dev/null; then
  echo -e "${YELLOW}⚠ ngrok is not running. Starting ngrok...${NC}"
  bash start-all.sh start xmtp > /dev/null 2>&1 || true
  sleep 5
fi

# Get current ngrok URL
echo -e "${BLUE}Fetching current ngrok URL...${NC}"
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>&1 | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$NGROK_URL" ]; then
  echo -e "${RED}❌ Failed to get ngrok URL${NC}"
  exit 1
fi

echo -e "${GREEN}✓ ngrok URL: $NGROK_URL${NC}"

# Check XMTP health via ngrok
echo -e "${BLUE}Checking XMTP Agent health...${NC}"
HEALTH_CHECK=$(curl -s -m 5 "$NGROK_URL/api/health" 2>&1)

if echo "$HEALTH_CHECK" | grep -q '"status":"healthy"'; then
  echo -e "${GREEN}✓ XMTP Agent is healthy${NC}"
elif echo "$HEALTH_CHECK" | grep -q '"status"'; then
  echo -e "${YELLOW}⚠ XMTP Agent responded but status unclear: $HEALTH_CHECK${NC}"
else
  echo -e "${RED}❌ XMTP Agent health check failed${NC}"
  echo -e "${YELLOW}Response: $HEALTH_CHECK${NC}"
  echo -e "${YELLOW}⚠ Proceeding with deployment anyway...${NC}"
fi

# Update Vercel environment variable
echo -e "${BLUE}Updating Vercel environment variables...${NC}"
cd "$PROJECT_ROOT/ai-roast-generator"

# Remove old value
vercel env rm VITE_REACT_APP_XMTP_API --yes 2>/dev/null || true
vercel env rm REACT_APP_XMTP_API --yes 2>/dev/null || true


# Add new value
echo "$NGROK_URL" | vercel env add VITE_REACT_APP_XMTP_API production 2>/dev/null || {
  echo -e "${RED}❌ Failed to set Vercel env var${NC}"
  exit 1
}

echo "$NGROK_URL" | vercel env add REACT_APP_XMTP_API production 2>/dev/null || {
  echo -e "${RED}❌ Failed to set Vercel env var${NC}"
  exit 1
}

echo -e "${GREEN}✓ Vercel env updated${NC}"

# Deploy to Vercel
echo -e "${BLUE}Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "${GREEN}✓ ngrok URL synced to Vercel${NC}"
echo -e "${GREEN}✓ Deployed to production${NC}"
echo -e "${YELLOW}Note: Share ngrok URL with team or update DNS records if needed${NC}"
echo ""
echo "XMTP Agent URL: $NGROK_URL"
