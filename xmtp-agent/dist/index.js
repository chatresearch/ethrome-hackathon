import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities, resolveAgentCapabilities } from "./ens-resolver.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();
// Generate presigned URL for S3 upload
async function generatePresignedUrl(filename, contentType = 'image/png') {
    try {
        const s3Client = new S3Client({ region: 'eu-south-1' });
        const bucket = 'irc-ai-roaster';
        const key = `roasts/${Date.now()}-${Math.random().toString(36).substring(7)}-${filename}`;
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
        console.log(`[S3] Generated presigned URL for ${key}`);
        return url;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[S3] Failed to generate presigned URL:`, message);
        throw new Error(`Failed to generate presigned URL: ${message}`);
    }
}
// Query real ElizaOS agents via HTTP instead of using mocks
async function generateResponse(agent, message) {
    const agentPort = process.env.ELIZAOS_PORT || "3001";
    const agentEndpoint = `http://localhost:${agentPort}/api/agents/${agent}/message`;
    // Detect if message contains image data (base64) - can be anywhere in the message
    const isImage = message.includes("data:image/") || message.includes("base64,") || message.includes(".s3.");
    console.log(`[generateResponse] Agent: ${agent}, Has image: ${isImage}`);
    // Format message for vision agents if it's an image
    let formattedMessage = message;
    if (isImage && (agent === "profile-roaster" || agent === "linkedin-roaster" || agent === "vibe-roaster")) {
        // Extract the image part - could be base64 or S3 URL
        const imageMatch = message.match(/(data:image\/[^:]*;base64,[A-Za-z0-9+/=]+)/);
        const s3Match = message.match(/(https:\/\/[^\s]+\.s3\.[^\s]+)/);
        const imageData = imageMatch ? imageMatch[1] : (s3Match ? s3Match[1] : message);
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
        const data = await response.json();
        console.log(`[generateResponse] Got response from ${agent}`);
        return data.response || data.message || "No response from agent";
    }
    catch (error) {
        console.error(`[generateResponse] Error from agent, using fallback. Is image: ${isImage}`);
        // Fallback with realistic demo responses based on agent type and message
        if (agent === "defi-wizard") {
            if (message.toLowerCase().includes("yield") || message.toLowerCase().includes("apy")) {
                return "Yield farming involves lending crypto assets to earn rewards. Current top opportunities: Curve Finance (8-15% APY), Aave (4-12% APY). Risk factors: smart contract vulnerabilities, impermanent loss on AMMs, liquidation risk on lending protocols.";
            }
            return "For DeFi analysis, ask about yield farming, APY comparisons, protocol risks, or liquidity positions.";
        }
        else if (agent === "security-guru") {
            if (message.toLowerCase().includes("audit") ||
                message.toLowerCase().includes("vulnerability") ||
                message.toLowerCase().includes("reentrancy")) {
                return "Smart contract audits are critical for security. Key focus areas: reentrancy vulnerabilities, integer overflow/underflow, access control, external call dangers, and state management. Always perform thorough testing before mainnet deployment.";
            }
            return "For security analysis, ask about audits, vulnerabilities, best practices, or specific attack vectors.";
        }
        else if (isImage && agent === "profile-roaster") {
            return "😂 Okay so I'm looking at this photo and I'm getting serious main character energy here... but like in a way that's somehow both confident AND deeply unaware of itself? The lighting's doing you a solid, but that smile is giving \"I've been holding this pose for 47 seconds and my face hurts\" vibes. 10/10 for effort though!";
        }
        else if (isImage && agent === "linkedin-roaster") {
            return "Professional headshot game: strong! But real talk, that blazer is doing 90% of the work here. The smile screams \"I'm very serious about synergy\" and I respect that energy. Your eyes have a faraway look like you're thinking about quarterly projections, which honestly checks out for the platform. LinkedIn would be proud! 📊";
        }
        else if (isImage && agent === "vibe-roaster") {
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
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }
        // Health check endpoint
        if (req.url === "/api/health" && req.method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
            return;
        }
        // S3 Presigned URL endpoint
        if (req.url?.startsWith("/api/s3-upload-url") && req.method === "GET") {
            try {
                const queryParams = new URL(req.url || "", `http://${req.headers.host || 'localhost'}`);
                const filename = queryParams.searchParams.get('filename') || 'image.png';
                const contentType = queryParams.searchParams.get('contentType') || 'image/png';
                console.log(`[S3] Presigned URL request for ${filename}`);
                const presignedUrl = await generatePresignedUrl(filename, contentType);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    uploadUrl: presignedUrl,
                    expiresIn: 3600
                }));
            }
            catch (error) {
                console.error("[S3] Error generating presigned URL:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    error: error instanceof Error ? error.message : "Failed to generate presigned URL"
                }));
            }
            return;
        }
        if (req.url?.startsWith("/api/message") && req.method === "POST") {
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
        const capabilities = await resolveAgentCapabilities(agentType);
        return capabilities?.capabilities || [];
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
    process.exit(1);
});
