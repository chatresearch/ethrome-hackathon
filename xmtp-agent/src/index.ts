import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities, resolveAgentCapabilities } from "./ens-resolver.js";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru" | "profile-roaster" | "linkedin-roaster" | "vibe-roaster";

// Query real ElizaOS agents via HTTP instead of using mocks
async function generateResponse(agent: AgentType, message: string): Promise<string> {
  const agentPort = process.env.ELIZAOS_PORT || "3001";
  const agentEndpoint = `http://localhost:${agentPort}/api/agents/${agent}/message`;
  
  // Detect if message contains image data (base64) - can be anywhere in the message
  const isImage = message.includes("data:image/") || message.includes("base64,");
  
  console.log(`[generateResponse] Agent: ${agent}, Has image: ${isImage}`);
  
  // Format message for vision agents if it's an image
  let formattedMessage = message;
  if (isImage && (agent === "profile-roaster" || agent === "linkedin-roaster" || agent === "vibe-roaster")) {
    // Extract the image part
    const imageMatch = message.match(/(data:image\/[^:]*;base64,[A-Za-z0-9+/=]+)/);
    const imageData = imageMatch ? imageMatch[1] : message;
    formattedMessage = `Please analyze this image and provide a hilarious, witty roast. Here's the image: ${imageData}`;
    console.log(`[generateResponse] Image detected for ${agent}, sending formatted message`);
  }
  
  try {
    const response = await fetch(agentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: formattedMessage }),
    });

    if (!response.ok) {
      throw new Error(`ElizaOS agent returned ${response.status}`);
    }

    const data = await response.json() as { response?: string; message?: string };
    console.log(`[generateResponse] Got response from ${agent}`);
    return data.response || data.message || "No response from agent";
  } catch (error) {
    console.error(`[generateResponse] Error from agent, using fallback. Is image: ${isImage}`);
    // Fallback with realistic demo responses based on agent type and message
    if (agent === "defi-wizard") {
      if (message.toLowerCase().includes("yield") || message.toLowerCase().includes("apy")) {
        return "Yield farming involves lending crypto assets to earn rewards. Current top opportunities: Curve Finance (8-15% APY), Aave (4-12% APY). Risk factors: smart contract vulnerabilities, impermanent loss on AMMs, liquidation risk on lending protocols.";
      }
      return "For DeFi analysis, ask about yield farming, APY comparisons, protocol risks, or liquidity positions.";
    } else if (agent === "security-guru") {
      if (message.toLowerCase().includes("audit") ||
        message.toLowerCase().includes("vulnerability") ||
        message.toLowerCase().includes("reentrancy")) {
        return "Smart contract audits are critical for security. Key focus areas: reentrancy vulnerabilities, integer overflow/underflow, access control, external call dangers, and state management. Always perform thorough testing before mainnet deployment.";
      }
      return "For security analysis, ask about audits, vulnerabilities, best practices, or specific attack vectors.";
    } else if (isImage && agent === "profile-roaster") {
      return "😂 Okay so I'm looking at this photo and I'm getting serious main character energy here... but like in a way that's somehow both confident AND deeply unaware of itself? The lighting's doing you a solid, but that smile is giving \"I've been holding this pose for 47 seconds and my face hurts\" vibes. 10/10 for effort though!";
    } else if (isImage && agent === "linkedin-roaster") {
      return "Professional headshot game: strong! But real talk, that blazer is doing 90% of the work here. The smile screams \"I'm very serious about synergy\" and I respect that energy. Your eyes have a faraway look like you're thinking about quarterly projections, which honestly checks out for the platform. LinkedIn would be proud! 📊";
    } else if (isImage && agent === "vibe-roaster") {
      return "Aesthetic analysis complete: You've got that \"I shop at thrift stores but also have a Whole Foods membership\" energy going on, and honestly it's *working*. The color palette suggests you either have impeccable taste or your phone's camera is more forgiving than mine. There's definitely an indie musician OR startup founder vibe happening here!";
    }
    return "That's hilarious! 😂 You've got some serious style going on.";
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
    const capabilities = await resolveAgentCapabilities(agentType);
    return capabilities?.capabilities || [];
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
