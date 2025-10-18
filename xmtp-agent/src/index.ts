import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import * as http from "http";
import { routeByCapabilities, formatResponseWithCapabilities, resolveAgentCapabilities } from "./ens-resolver.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru" | "profile-roaster" | "linkedin-roaster" | "vibe-roaster";

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
    
    console.log(`[Media] Uploading to ElizaOS for agent ${agentId}, size: ${blob.size} bytes`);
    
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
    
    console.log(`[Media] ✅ Uploaded to ElizaOS: ${mediaData.url}`);
    return mediaData.url;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[Media] ❌ Upload failed: ${msg}`);
    throw error;
  }
}

// Compress base64 image by reducing quality and size
function compressBase64Image(base64: string, maxSizeKB: number = 200): string {
  // If already small enough, return as-is
  const sizeInKB = base64.length / 1024;
  if (sizeInKB <= maxSizeKB) {
    console.log(`[Image] Size ${sizeInKB.toFixed(1)}KB - no compression needed`);
    return base64;
  }

  console.log(`[Image] Compressing from ${sizeInKB.toFixed(1)}KB to ~${maxSizeKB}KB`);
  
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
  
  console.log(`[Image] Compressed to ${(result.length / 1024).toFixed(1)}KB`);
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
    console.log(`[S3] Generated presigned URL for ${key}`);
    return url;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[S3] Failed to generate presigned URL:`, message);
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
  
  console.log(`[generateResponse] Agent: ${agent}, Has image: ${isImage}, Message preview: ${message.substring(0, 100)}`);
  
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
        console.log(`[generateResponse] Base64 image detected, uploading to ElizaOS media API...`);
        imageUrl = await uploadMediaToElizaOS(agentId, imageMatch[1]);
      } catch (error) {
        console.error(`[generateResponse] Failed to upload base64 to ElizaOS:`, error);
        throw error;
      }
    }
    // If we have an S3 URL, use it directly (ElizaOS can fetch it)
    else if (s3Match) {
      imageUrl = s3Match[1];
      console.log(`[generateResponse] Using S3 URL directly: ${imageUrl}`);
    }
    
    if (imageUrl) {
      formattedMessage = `Please analyze this image and provide a hilarious, witty roast. Here's the image: ${imageUrl}`;
      console.log(`[generateResponse] Image URL set, formatted message length: ${formattedMessage.length}`);
    }
  }
  
  try {
    // Create a unique channel ID for this conversation
    const channelId = `channel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const serverId = "server-roaster";
    const userId = `user-${Date.now()}`;
    
    console.log(`[generateResponse] Sending to ElizaOS at http://localhost:${elizaosPort}/api/messaging/submit`);
    console.log(`[generateResponse] Agent ID: ${agentId}, Channel: ${channelId}, Message length: ${formattedMessage.length}`);
    
    const response = await fetch(`http://localhost:${elizaosPort}/api/messaging/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel_id: channelId,
        server_id: serverId,
        author_id: userId,
        content: formattedMessage,
        source_type: "user",
        raw_message: {
          text: formattedMessage,
          actions: ["REPLY"]
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElizaOS returned ${response.status}`);
    }

    const data = await response.json() as { success?: boolean; data?: any };
    console.log(`[generateResponse] ElizaOS response status: ${data.success}`);
    
    // The messaging/submit endpoint accepts the message but responses come async
    // We need to check for agent response in the channel
    // For now, wait a bit for the agent to process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to get messages from the channel
    try {
      const messagesResp = await fetch(`http://localhost:${elizaosPort}/api/channels/${channelId}/messages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (messagesResp.ok) {
        const messagesData = await messagesResp.json() as { data?: any[] };
        if (messagesData.data && messagesData.data.length > 0) {
          // Find the agent's response (usually the last message)
          const agentResponse = messagesData.data[messagesData.data.length - 1];
          if (agentResponse.content) {
            console.log(`[generateResponse] Got response from ${agent}: ${agentResponse.content.substring(0, 100)}`);
            return agentResponse.content;
          }
        }
      }
    } catch (msgErr) {
      console.error(`[generateResponse] Could not fetch messages:`, msgErr);
    }
    
    throw new Error(`No response from agent ${agent}`);
  } catch (error) {
    console.error(`[generateResponse] Error: ${error}`);
    throw error;
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
      } catch (error) {
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
