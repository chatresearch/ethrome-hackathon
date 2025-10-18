import { Agent } from "@xmtp/agent-sdk";
import { Wallet } from "ethers";
import * as dotenv from "dotenv";
import { routeByCapabilities, formatResponseWithCapabilities } from "./ens-resolver.js";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru";

function generateResponse(agent: AgentType, message: string): string {
  const responses: Record<AgentType, (msg: string) => string> = {
    "defi-wizard": (msg) => {
      return `DeFi Wizard: Regarding "${msg}" - I focus on yield farming, liquidity protocols, and risk management.`;
    },
    "security-guru": (msg) => {
      return `Security Guru: About "${msg}" - Smart contract security is critical.`;
    },
  };

  return responses[agent](message);
}

async function runE2ETest() {
  console.log("=== XMTP Agent E2E Tests ===\n");

  const privateKey = process.env.XMTP_WALLET_KEY;
  if (!privateKey) {
    console.error("✗ XMTP_WALLET_KEY not set in .env");
    process.exit(1);
  }

  const signer = new Wallet(privateKey);
  console.log(`✓ Wallet initialized: ${signer.address}\n`);

  try {
    console.log("Starting XMTP Agent...");
    const agent = await Agent.create(signer as any);
    console.log("✓ Agent connected\n");

    let messageReceived = false;
    let messageRoutedCorrectly = false;
    let responseFormatted = false;

    agent.on("text", async (ctx: any) => {
      messageReceived = true;
      console.log(`✓ Message received: "${ctx.message.content}"`);

      const userMessage = ctx.message.content;
      const agentType = (await routeByCapabilities(userMessage)) as AgentType;
      
      if ((userMessage.includes("yield") && agentType === "defi-wizard") ||
          (userMessage.includes("audit") && agentType === "security-guru")) {
        messageRoutedCorrectly = true;
        console.log(`✓ Message routed to: ${agentType}`);
      }

      const baseResponse = generateResponse(agentType, userMessage);
      const finalResponse = await formatResponseWithCapabilities(agentType, baseResponse);
      
      if (finalResponse.includes("[") && finalResponse.includes("]")) {
        responseFormatted = true;
        console.log(`✓ Response formatted with metadata`);
      }

      await ctx.reply({ content: finalResponse });
      console.log(`✓ Response sent\n`);
    });

    agent.on("start", () => {
      console.log("✓ Agent listening for messages\n");
    });

    console.log("Starting agent...");
    await agent.start();

    console.log("\n=== E2E Test Summary ===");
    console.log("E2E tests require manual message sending via XMTP.");
    console.log("Agent is now running and will:");
    console.log("- Receive messages from XMTP");
    console.log("- Route using ENS capabilities");
    console.log("- Format responses with agent metadata");
    console.log("- Send responses back to group chat\n");
    console.log("Press Ctrl+C to stop the agent.");

  } catch (error) {
    console.error("✗ E2E Test Failed:", error);
    process.exit(1);
  }
}

runE2ETest();
