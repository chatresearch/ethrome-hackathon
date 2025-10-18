import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities } from "./ens-resolver.js";
dotenv.config();
<<<<<<< HEAD
function generateResponse(agent, message) {
    const responses = {
        "defi-wizard": (msg) => {
            return `DeFi Wizard: Regarding "${msg}" - I focus on yield farming, liquidity protocols, and risk management. ` +
                `Consider: protocol TVL, APY sustainability, contract audits, risk tolerance. ` +
                `Always research the underlying protocol and diversify.`;
        },
        "security-guru": (msg) => {
            return `Security Guru: About "${msg}" - Smart contract security is critical. ` +
                `Watch for: reentrancy, overflow/underflow, access control issues. ` +
                `Verify: source code, audits, contract history, community feedback.`;
        },
    };
    return responses[agent](message);
}
function determineAgent(message) {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("defi") ||
        lowerMsg.includes("yield") ||
        lowerMsg.includes("farming") ||
        lowerMsg.includes("apy") ||
        lowerMsg.includes("liquidity")) {
        return "defi-wizard";
=======
// Query real ElizaOS agents via HTTP instead of using mocks
async function generateResponse(agent, message) {
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
        const data = await response.json();
        return data.response || data.message || "No response from agent";
>>>>>>> main
    }
    catch (error) {
        throw new Error(`Failed to query ${agent} on port ${agentPort}: ${error instanceof Error ? error.message : String(error)}`);
    }
<<<<<<< HEAD
    return "defi-wizard";
=======
>>>>>>> main
}
// Store last response for HTTP API
let lastAgentResponse = "";
async function startAgent() {
<<<<<<< HEAD
    // Verify required environment variables
    if (!process.env.XMTP_WALLET_KEY) {
        throw new Error("XMTP_WALLET_KEY not set in .env");
    }
    console.log(`Starting XMTP Agent`);
    // Use Agent.createFromEnv() which reads XMTP_WALLET_KEY and XMTP_ENV automatically
    const agent = await Agent.createFromEnv();
    console.log(`Agent connected successfully`);
    agent.on("text", async (ctx) => {
        const userMessage = ctx.message.content;
        console.log(`[User] ${userMessage}`);
        const agentType = determineAgent(userMessage);
        console.log(`[Route] ${agentType}`);
        const response = generateResponse(agentType, userMessage);
        await ctx.sendText(response);
    });
    agent.on("start", () => {
        console.log(`Listening for messages`);
    });
    await agent.start();
}
startAgent().catch((error) => {
    console.error("Error:", error);
=======
    console.log("Starting XMTP Agent");
    try {
        // Use Agent.createFromEnv() as per Base App documentation
        const agent = await Agent.createFromEnv({
            env: process.env.XMTP_ENV || "production",
        });
        console.log(`Connected to XMTP`);
        agent.on("text", async (ctx) => {
            const userMessage = ctx.message.content;
            console.log(`[XMTP] Received: ${userMessage}`);
            try {
                const agentType = (await routeByCapabilities(userMessage));
                console.log(`[Route] ${agentType}`);
                const baseResponse = await generateResponse(agentType, userMessage);
                const responseWithCapabilities = await formatResponseWithCapabilities(agentType, baseResponse);
                await ctx.sendText(responseWithCapabilities);
                lastAgentResponse = responseWithCapabilities;
            }
            catch (error) {
                const errorMsg = `Error processing message: ${error instanceof Error ? error.message : String(error)}`;
                console.error(errorMsg);
                await ctx.sendText(errorMsg);
            }
        });
        agent.on("start", () => {
            console.log(`Listening for XMTP messages`);
        });
        await agent.start();
    }
    catch (error) {
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
                    const { message } = JSON.parse(body);
                    if (!message) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Message is required" }));
                        return;
                    }
                    const agentType = (await routeByCapabilities(message));
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
                }
                catch (error) {
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
    server.listen(parseInt(port), () => {
        console.log(`HTTP API server listening on http://localhost:${port}`);
    });
}
// Helper to extract capabilities
async function extractCapabilities(agentType) {
    try {
        const capabilities = await formatResponseWithCapabilities(agentType, "");
        // Simple extraction - in real app would parse better
        return agentType === "defi-wizard"
            ? ["Yield Analysis", "Protocol Risk Assessment", "APY Comparison"]
            : ["Contract Audit", "Vulnerability Detection", "Security Review"];
    }
    catch {
        return [];
    }
}
async function start() {
    startHttpServer();
    await startAgent();
}
start().catch((error) => {
    console.error("Fatal error:", error);
>>>>>>> main
    process.exit(1);
});
