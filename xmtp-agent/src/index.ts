import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";

dotenv.config();

type AgentType = "defi-wizard" | "security-guru";

function generateResponse(agent: AgentType, message: string): string {
  const responses: Record<AgentType, (msg: string) => string> = {
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

function determineAgent(message: string): AgentType {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("defi") ||
    lowerMsg.includes("yield") ||
    lowerMsg.includes("farming") ||
    lowerMsg.includes("apy") ||
    lowerMsg.includes("liquidity")
  ) {
    return "defi-wizard";
  }

  if (
    lowerMsg.includes("security") ||
    lowerMsg.includes("contract") ||
    lowerMsg.includes("vulnerability") ||
    lowerMsg.includes("audit") ||
    lowerMsg.includes("exploit")
  ) {
    return "security-guru";
  }

  return "defi-wizard";
}

async function startAgent() {
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
  process.exit(1);
});
