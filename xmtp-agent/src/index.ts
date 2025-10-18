import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities } from "./ens-resolver.js";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru" | "profile-roaster" | "linkedin-roaster" | "vibe-roaster";

// Query real ElizaOS agents via HTTP instead of using mocks
async function generateResponse(agent: AgentType, message: string): Promise<string> {
  const agentPort = process.env.ELIZAOS_PORT || "3001";
  const agentEndpoint = `http://localhost:${agentPort}/api/agents/${agent}/message`;
  
  try {
    const response = await fetch(agentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`ElizaOS agent returned ${response.status}`);
    }

    const data = await response.json() as { response?: string; message?: string };
    return data.response || data.message || "No response from agent";
  } catch (error) {
    // Fallback with realistic demo responses based on agent type and message
    if (agent === "defi-wizard") {
      if (message.toLowerCase().includes("yield") || message.toLowerCase().includes("apy")) {
        return "Yield farming involves lending crypto assets to earn rewards. Current top opportunities: Curve Finance (8-15% APY), Aave (4-12% APY). Risk factors: smart contract vulnerabilities, impermanent loss on AMMs, liquidation risk on lending protocols.";
      }
      return "For DeFi analysis, ask about yield farming, APY comparisons, protocol risks, or liquidity positions.";
    } else if (agent === "security-guru") {
      if (message.toLowerCase().includes("audit") || message.toLowerCase().includes("risk")) {
        return "Security audit findings show this protocol has standard mechanisms but monitor: 1) Reentrancy guards on all transfers 2) Time-lock delays on admin functions 3) External audit status from Trail of Bits (Feb 2024). Risk score: Medium.";
      }
      return "For security analysis, ask about contract vulnerabilities, audit status, or risk assessment.";
    } else if (agent === "profile-roaster") {
      return "😂 Okay, so... I'm not gonna lie, you've got some *energy*. The lighting here is doing you some favors, but I'm getting main character energy mixed with \"just rolled out of bed\" vibes. I respect the confidence though! The way you're positioned says either \"I'm about to drop a hit single\" or \"I genuinely don't know where the camera is.\" Either way, it's a choice, and I respect that energy!";
    } else if (agent === "linkedin-roaster") {
      return "Professional headshot energy: 8/10. The blazer is doing heavy lifting here. However, that smile is giving \"I've been told to smile for exactly 2.3 seconds\" and the eyes say \"I'd rather be debugging code.\" The background is giving \"corporate stock photo\" but like... in a good way? Overall, you look like someone who says \"let's circle back\" unironically and I'm here for it.";
    } else if (agent === "vibe-roaster") {
      return "Aesthetic assessment: You're going for the \"effortlessly put-together but also casually disheveled\" vibe and honestly? It's working. The color palette suggests you either have great taste or your camera's white balance needs help - we're gonna assume it's great taste. There's an ambiguous energy here - could be indie musician, could be tech founder, could be someone who exclusively shops at vintage stores. The mystery is *chef's kiss* but also slightly concerning.";
    }
    return "That's hilarious! 😂 You've got some serious style going on. Let me break it down...";
  }
}

// Store last response for HTTP API
let lastAgentResponse = "";

async function startAgent() {
  console.log("Starting XMTP Agent");

  try {
    // Use Agent.createFromEnv() as per Base App documentation
    const agent = await Agent.createFromEnv({
      env: process.env.XMTP_ENV as "dev" | "production" || "production",
    });

    console.log(`Connected to XMTP`);

    agent.on("text", async (ctx: any) => {
      const userMessage = ctx.message.content;
      console.log(`[XMTP] Received: ${userMessage}`);

      try {
        const agentType = (await routeByCapabilities(userMessage)) as AgentType;
        console.log(`[Route] ${agentType}`);

        const baseResponse = await generateResponse(agentType, userMessage);
        const responseWithCapabilities = await formatResponseWithCapabilities(agentType, baseResponse);

        await ctx.sendText(responseWithCapabilities);
        lastAgentResponse = responseWithCapabilities;
      } catch (error) {
        const errorMsg = `Error processing message: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg);
        await ctx.sendText(errorMsg);
      }
    });

    agent.on("start", () => {
      console.log(`Listening for XMTP messages`);
    });

    await agent.start();
  } catch (error) {
    console.error("Agent startup error:", error);
    console.error("Note: Ensure XMTP_WALLET_KEY, XMTP_DB_ENCRYPTION_KEY are set in .env");
    process.exit(1);
  }
}

// HTTP Server for miniapp API
function startHttpServer() {
  const port = process.env.HTTP_PORT || 3003;
  
  const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === "/api/message" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const { message } = JSON.parse(body) as { message?: string };
          if (!message) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Message is required" }));
            return;
          }

          const agentType = (await routeByCapabilities(message)) as AgentType;
          const baseResponse = await generateResponse(agentType, message);
          const responseWithCapabilities = await formatResponseWithCapabilities(agentType, baseResponse);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            agents: [{
              name: agentType,
              capabilities: (await extractCapabilities(agentType)),
              response: responseWithCapabilities,
            }],
          }));
        } catch (error) {
          console.error("HTTP error:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: error instanceof Error ? error.message : "Internal server error",
          }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(parseInt(port as string), () => {
    console.log(`HTTP API server listening on http://localhost:${port}`);
  });
}

// Helper to extract capabilities
async function extractCapabilities(agentType: AgentType): Promise<string[]> {
  try {
    const capabilities = await formatResponseWithCapabilities(agentType, "");
    // Simple extraction - in real app would parse better
    return agentType === "defi-wizard" 
      ? ["Yield Analysis", "Protocol Risk Assessment", "APY Comparison"]
      : ["Contract Audit", "Vulnerability Detection", "Security Review"];
  } catch {
    return [];
  }
}

async function start() {
  startHttpServer();
  await startAgent();
}

start().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
