import { Agent } from "@xmtp/agent-sdk";
import { Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
// Realistic agent responses
function generateResponse(agent, message) {
    const responses = {
        "defi-wizard": (msg) => {
            return `🧙 **DeFi Wizard**: Regarding your question about "${msg}" - ` +
                `In DeFi, I focus on yield farming, liquidity protocols, and risk management. ` +
                `Key considerations: protocol TVL, APY sustainability, smart contract audits, and your risk tolerance. ` +
                `Always research the underlying protocol and diversify your positions.`;
        },
        "security-guru": (msg) => {
            return `🔐 **Security Guru**: About your security concern "${msg}" - ` +
                `Smart contract security is critical. Key vulnerabilities to watch: reentrancy, overflow/underflow, access control issues. ` +
                `Always verify: source code, security audits, contract history, and community feedback. ` +
                `When uncertain, use battle-tested protocols with established track records.`;
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
    }
    if (lowerMsg.includes("security") ||
        lowerMsg.includes("contract") ||
        lowerMsg.includes("vulnerability") ||
        lowerMsg.includes("audit") ||
        lowerMsg.includes("exploit")) {
        return "security-guru";
    }
    return "defi-wizard"; // Default
}
async function startAgent() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("PRIVATE_KEY not set. Create .env and add your private key.");
    }
    // Create wallet signer
    const signer = new Wallet(privateKey);
    console.log(`\n✅ Starting XMTP Agent`);
    console.log(`📍 Agent Address: ${signer.address}\n`);
    // Create agent
    const agent = await Agent.create(signer, {
        env: "production",
    });
    console.log(`✅ XMTP Agent Connected\n`);
    // Handle text messages
    agent.on("text", async (ctx) => {
        const userMessage = ctx.content();
        console.log(`\n📨 User: ${userMessage}`);
        // Determine which agent to use
        const agentType = determineAgent(userMessage);
        console.log(`🔀 Routing to: ${agentType}`);
        // Generate response
        const response = generateResponse(agentType, userMessage);
        console.log(`✅ Responding...\n`);
        // Send response
        await ctx.sendText(response);
    });
    // Log when ready
    agent.on("start", () => {
        console.log(`⏳ Listening for messages...\n`);
    });
    // Start listening
    await agent.start();
}
startAgent().catch((error) => {
    console.error("❌ Agent error:", error);
    process.exit(1);
});
