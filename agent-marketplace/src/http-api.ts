import http from 'http';
import { URL } from 'url';
import { logger } from '@elizaos/core';

const PORT = process.env.HTTP_API_PORT || 3001;

interface MessageRequest {
  message: string;
  userId?: string;
}

interface MessageResponse {
  success: boolean;
  response?: string;
  error?: {
    message: string;
    code: number;
  };
}

// Store agent runtimes that we can query
const agentRuntimes: Map<string, any> = new Map();

// Register an agent runtime so it can be queried via HTTP
export function registerAgentRuntime(agentName: string, runtime: any) {
  agentRuntimes.set(agentName, runtime);
  logger.info(`[HTTP API] Registered agent: ${agentName}`);
}

// Start the HTTP API server
export function startHttpApiServer() {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // GET /api/agents - list available agents
    if (pathname === '/api/agents' && req.method === 'GET') {
      const agents = Array.from(agentRuntimes.keys()).map((name) => ({
        name,
        available: true,
      }));
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: agents }));
      return;
    }

    // POST /api/agents/{agentName}/message - send message to agent
    const agentMessageMatch = pathname.match(/^\/api\/agents\/([^\/]+)\/message$/);
    if (agentMessageMatch && req.method === 'POST') {
      const agentName = decodeURIComponent(agentMessageMatch[1]);

      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const data: MessageRequest = JSON.parse(body);
          const runtime = agentRuntimes.get(agentName);

          if (!runtime) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                success: false,
                error: { message: `Agent ${agentName} not found`, code: 404 },
              } as MessageResponse)
            );
            return;
          }

          // Generate response using the agent's composeCoreAndGenerateState
          const userId = data.userId || `user-${Date.now()}`;
          const response = await runtime.generateText({
            context: data.message,
            conversationId: `http-api-${Date.now()}`,
            userId,
            formatters: [],
          });

          res.writeHead(200);
          res.end(
            JSON.stringify({
              success: true,
              response: response || 'No response from agent',
            } as MessageResponse)
          );
        } catch (error) {
          logger.error('[HTTP API] Error processing message:', error);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              success: false,
              error: {
                message: error instanceof Error ? error.message : 'Internal server error',
                code: 500,
              },
            } as MessageResponse)
          );
        }
      });
      return;
    }

    // 404 for unknown routes
    res.writeHead(404);
    res.end(
      JSON.stringify({
        success: false,
        error: { message: 'API endpoint not found', code: 404 },
      } as MessageResponse)
    );
  });

  server.listen(PORT, () => {
    logger.info(`[HTTP API] Server listening on http://localhost:${PORT}`);
  });

  return server;
}
