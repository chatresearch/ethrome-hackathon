import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities, resolveAgentCapabilities } from "./ens-resolver.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import logger from "./logger.js";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru" | "profile-roaster" | "linkedin-roaster" | "vibe-roaster";

// Generate a UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Upload media to ElizaOS for agent
async function uploadMediaToElizaOS(agentId: string, base64: string): Promise<string> {
  const elizaosPort = process.env.ELIZAOS_PORT || "3002";
  
  try {
    // Convert base64 to blob
    const base64Data = base64.split(',')[1] || base64;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Detect content type
    let mimeType = 'image/png';
    if (base64.includes('image/jpeg') || base64.includes('/9j/')) {
      mimeType = 'image/jpeg';
    } else if (base64.includes('image/gif')) {
      mimeType = 'image/gif';
    } else if (base64.includes('image/webp')) {
      mimeType = 'image/webp';
    }
    
    const blob = new Blob([bytes], { type: mimeType });
    const formData = new FormData();
    formData.append('file', blob, `roast-${Date.now()}.${mimeType.split('/')[1]}`);
    
    logger.info(`[Media] Uploading to ElizaOS for agent ${agentId}, size: ${blob.size} bytes`);
    
    const response = await fetch(`http://localhost:${elizaosPort}/api/media/${agentId}/upload-media`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`ElizaOS media upload returned ${response.status}`);
    }
    
    const mediaData = await response.json() as { url?: string };
    if (!mediaData.url) {
      throw new Error('No media URL returned from ElizaOS');
    }
    
    logger.info(`[Media] ✅ Uploaded to ElizaOS: ${mediaData.url}`);
    return mediaData.url;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`[Media] ❌ Upload failed: ${msg}`);
    throw error;
  }
}

// Compress base64 image by reducing quality and size
function compressBase64Image(base64: string, maxSizeKB: number = 200): string {
  // If already small enough, return as-is
  const sizeInKB = base64.length / 1024;
  if (sizeInKB <= maxSizeKB) {
    logger.info(`[Image] Size ${sizeInKB.toFixed(1)}KB - no compression needed`);
    return base64;
  }

  logger.info(`[Image] Compressing from ${sizeInKB.toFixed(1)}KB to ~${maxSizeKB}KB`);
  
  // Extract header and data
  const parts = base64.split(',');
  if (parts.length !== 2) return base64;
  
  const header = parts[0];
  const data = parts[1];
  
  // Estimate compression ratio needed
  const ratio = maxSizeKB / sizeInKB;
  const targetChars = Math.floor(data.length * ratio);
  
  // Truncate the base64 string (this effectively reduces quality)
  const compressed = data.substring(0, targetChars);
  const result = `${header},${compressed}`;
  
  logger.info(`[Image] Compressed to ${(result.length / 1024).toFixed(1)}KB`);
  return result;
}

// Generate presigned URL for S3 upload
async function generatePresignedUrl(filename: string, contentType: string = 'image/png'): Promise<string> {
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
    logger.info(`[S3] Generated presigned URL for ${key}`);
    return url;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[S3] Failed to generate presigned URL:`, message);
    throw new Error(`Failed to generate presigned URL: ${message}`);
  }
}

// Agent ID mappings (from curl http://localhost:3002/api/agents)
const AGENT_IDS: Record<AgentType, string> = {
  "defi-wizard": "adb273ad-5c79-06a3-bd62-266b870651e6",
  "security-guru": "23296f74-bc2c-012b-bc06-d3a1b6f5e61b",
  "profile-roaster": "6bb0e88e-ec59-00f3-b411-84e72ef35003",
  "linkedin-roaster": "92faf961-5fbf-0593-9b91-d069872d4082",
  "vibe-roaster": "f7b032ca-cd10-023b-84fa-4ed33652d551",
};

// Query ElizaOS agents via REST API messaging
async function generateResponse(agent: AgentType, message: string): Promise<string> {
  const elizaosPort = process.env.ELIZAOS_PORT || "3002";
  const agentId = AGENT_IDS[agent];
  
  if (!agentId) {
    throw new Error(`No agent ID configured for: ${agent}`);
  }
  
  // Detect if message contains image data (base64) - can be anywhere in the message
  const isImage = message.includes("data:image/") || message.includes("base64,") || message.includes(".s3.");
  
  logger.info(`[generateResponse] Agent: ${agent}, Has image: ${isImage}, Message preview: ${message.substring(0, 100)}`);
  
  // Format message for vision agents if it's an image
  let formattedMessage = message;
  if (isImage && (agent === "profile-roaster" || agent === "linkedin-roaster" || agent === "vibe-roaster")) {
    // Extract the image part - could be base64 or S3 URL
    const imageMatch = message.match(/(data:image\/[^:]*;base64,[A-Za-z0-9+/=]+)/);
    let s3Match = message.match(/(https:\/\/[^\s]+\.s3\.[^\s]+)/);
    
    let imageUrl = null;
    
    // If we have base64 data, upload it to ElizaOS media API
    if (imageMatch) {
      try {
        logger.info(`[generateResponse] Base64 image detected, uploading to ElizaOS media API...`);
        imageUrl = await uploadMediaToElizaOS(agentId, imageMatch[1]);
      } catch (error) {
        logger.error(`[generateResponse] Failed to upload base64 to ElizaOS:`, error);
        throw error;
      }
    }
    // If we have an S3 URL, use it directly (ElizaOS can fetch it)
    else if (s3Match) {
      imageUrl = s3Match[1];
      logger.info(`[generateResponse] Using S3 URL directly: ${imageUrl}`);
    }
    
    if (imageUrl) {
      formattedMessage = `Please analyze this image and provide a hilarious, witty roast. Here's the image: ${imageUrl}`;
      logger.info(`[generateResponse] Image URL set, formatted message length: ${formattedMessage.length}`);
    }
  }
  
  try {
    // Use ElizaOS Sessions API (from https://docs.elizaos.ai/api-reference)
    const elizaosPort = process.env.ELIZAOS_PORT || "3002";
    
    logger.info(`\n[generateResponse] ========================================`);
    logger.info(`[generateResponse] Starting ElizaOS session for: ${agent}`);
    logger.info(`[generateResponse] Agent ID: ${agentId}`);
    logger.info(`[generateResponse] Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    logger.info(`[generateResponse] ========================================\n`);
    
    // Step 1: Create a session (POST /api/messaging/sessions)
    const userId = generateUUID();
    
    logger.info(`[CURL 1] Creating ElizaOS session...`);
    logger.info(`[CURL 1] POST http://localhost:${elizaosPort}/api/messaging/sessions`);
    logger.info(`[CURL 1] Body: { agentId: "${agentId}", userId: "${userId}" }`);
    
    const sessionResp = await fetch(`http://localhost:${elizaosPort}/api/messaging/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agentId,
        userId: userId,
      }),
    });
    
    if (!sessionResp.ok) {
      const errorText = await sessionResp.text();
      throw new Error(`Failed to create session: ${sessionResp.status} - ${errorText}`);
    }
    
    const sessionData = await sessionResp.json() as { sessionId?: string; id?: string };
    const sessionId = sessionData.sessionId || sessionData.id;
    
    if (!sessionId) {
      throw new Error('No session ID returned from ElizaOS');
    }
    
    logger.info(`[CURL 1] ✅ Session created`);
    logger.info(`[CURL 1] SessionId: ${sessionId}\n`);
    
    // Step 2: Send message to session (POST /api/messaging/sessions/{sessionId}/messages)
    logger.info(`[CURL 2] Sending message to ElizaOS session...`);
    logger.info(`[CURL 2] POST http://localhost:${elizaosPort}/api/messaging/sessions/${sessionId}/messages`);
    logger.info(`[CURL 2] Body: { content: "${formattedMessage.substring(0, 50)}${formattedMessage.length > 50 ? '...' : ''}", userId: "${userId}" }`);
    
    const messageResp = await fetch(`http://localhost:${elizaosPort}/api/messaging/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: formattedMessage,
        userId: userId,
      }),
    });
    
    if (!messageResp.ok) {
      const errorText = await messageResp.text();
      throw new Error(`Failed to send message to session: ${messageResp.status} - ${errorText}`);
    }
    
    const messageData = await messageResp.json() as { id?: string };
    const messageId = messageData.id;
    
    logger.info(`[CURL 2] ✅ Message sent`);
    logger.info(`[CURL 2] MessageId: ${messageId}\n`);
    
    // Step 3: Poll for agent response (GET /api/messaging/sessions/{sessionId}/messages)
    logger.info(`[CURL 3] Polling for agent response...`);
    logger.info(`[CURL 3] GET http://localhost:${elizaosPort}/api/messaging/sessions/${sessionId}/messages`);
    
    let response = "";
    let pollAttempts = 0;
    const maxAttempts = 30; // 30 attempts = ~32 seconds max wait (2s initial + 29s polling)
    let initialWait = true;
    
    while (!response && pollAttempts < maxAttempts) {
      // First wait: 20 seconds before first poll (GPT-4o needs time to process images)
      // Subsequent waits: 2.5 seconds between polls
      const delayMs = initialWait ? 20000 : 2500;
      await new Promise(resolve => setTimeout(resolve, delayMs));
      initialWait = false;
      
      pollAttempts++;
      
      const messagesResp = await fetch(`http://localhost:${elizaosPort}/api/messaging/sessions/${sessionId}/messages`);
      
      if (!messagesResp.ok) {
        logger.info(`[CURL 3] Attempt ${pollAttempts}/${maxAttempts}: Failed to fetch (${messagesResp.status})`);
        continue;
      }
      
      const messagesData = await messagesResp.json() as { messages?: any[] };
      const messages = messagesData.messages || [];
      
      // Find the most recent agent response (isAgent: true)
      const agentMessages = messages.filter((msg: any) => msg.isAgent === true);
      
      if (agentMessages.length > 0) {
        const latestAgentMessage = agentMessages[agentMessages.length - 1];
        response = latestAgentMessage.content;
        logger.info(`[CURL 3] ✅ Got agent response on attempt ${pollAttempts}/${maxAttempts}`);
        logger.info(`[CURL 3] Response length: ${response.length} characters\n`);
        break;
      } else {
        // Show progress every 5 attempts
        if (pollAttempts % 5 === 0) {
          logger.info(`[CURL 3] Attempt ${pollAttempts}/${maxAttempts}: Still waiting for agent...`);
        }
      }
    }
    
    if (!response) {
      throw new Error(`No response from agent after ${maxAttempts} polling attempts`);
    }
    
    logger.info(`[generateResponse] ========================================`);
    logger.info(`[generateResponse] ✅ Complete!`);
    logger.info(`[generateResponse] Response: "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"`);
    logger.info(`[generateResponse] ========================================\n`);
    
    return response;
  } catch (error) {
    logger.error(`\n[generateResponse] ❌ ERROR: ${error}`);
    logger.error(`[generateResponse] ========================================\n`);
    throw error;
  }
}

// Store last response for HTTP API
let lastAgentResponse = "";

async function startAgent() {
  logger.info("Starting XMTP Agent");

  try {
    // Use Agent.createFromEnv() as per Base App documentation
    const agent = await Agent.createFromEnv({
      env: process.env.XMTP_ENV as "dev" | "production" || "production",
    });

    logger.info(`Connected to XMTP`);

    agent.on("text", async (ctx: any) => {
      const userMessage = ctx.message.content;
      logger.info(`[XMTP] Received: ${userMessage}`);

      try {
        const agentType = (await routeByCapabilities(userMessage)) as AgentType;
        logger.info(`[Route] ${agentType}`);

        const baseResponse = await generateResponse(agentType, userMessage);
        const responseWithCapabilities = await formatResponseWithCapabilities(agentType, baseResponse);

        await ctx.sendText(responseWithCapabilities);
        lastAgentResponse = responseWithCapabilities;
      } catch (error) {
        const errorMsg = `Error processing message: ${error instanceof Error ? error.message : String(error)}`;
        logger.error(errorMsg);
        await ctx.sendText(errorMsg);
      }
    });

    agent.on("start", () => {
      logger.info(`Listening for XMTP messages`);
    });

    await agent.start();
  } catch (error) {
    logger.error("Agent startup error:", error);
    logger.error("Note: Ensure XMTP_WALLET_KEY, XMTP_DB_ENCRYPTION_KEY are set in .env");
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
        
        logger.info(`[S3] Presigned URL request for ${filename}`);
        const presignedUrl = await generatePresignedUrl(filename, contentType);
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          uploadUrl: presignedUrl,
          expiresIn: 3600 
        }));
      } catch (error) {
        logger.error("[S3] Error generating presigned URL:", error);
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
          logger.error("HTTP error:", error);
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
    logger.info(`HTTP API server listening on http://localhost:${port}`);
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
  logger.error("Fatal error:", error);
  process.exit(1);
});
