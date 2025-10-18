/**
 * Direct client for calling ElizaOS agents without HTTP
 * This imports the agents directly and calls them programmatically
 */

// For now, we'll use HTTP to ElizaOS WebSocket endpoint
// But we can also import and run agents directly if needed

interface ElizaOSResponse {
  text: string;
  data?: any;
}

export async function callElizaOSAgent(
  agentName: string,
  message: string
): Promise<string> {
  // Since HTTP endpoints aren't exposed, we use WebSocket via XMTP's connection
  // or we run a local instance of the agent
  
  console.log(`[ElizaOS] Would call ${agentName} with: "${message}"`);
  
  // TODO: Implement one of:
  // 1. WebSocket connection to ElizaOS server
  // 2. Direct agent runtime call (import and run locally)
  // 3. Setup ElizaOS HTTP server properly
  
  throw new Error("ElizaOS integration not yet available via this method");
}
