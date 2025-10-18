import { Agent } from "@xmtp/agent-sdk";
import * as dotenv from "dotenv";
import { routeByCapabilities, formatResponseWithCapabilities } from "./ens-resolver.js";
dotenv.config();
function generateResponse(agent, message) {
    const responses = {
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
    try {
        console.log("Starting XMTP Agent using Agent.createFromEnv()...");
        // Use Agent.createFromEnv() instead of Agent.create(signer)
        const agent = await Agent.createFromEnv({
            env: process.env.XMTP_ENV || "production",
        });
        console.log("✓ Agent connected\n");
        let messageReceived = false;
        let messageRoutedCorrectly = false;
        let responseFormatted = false;
        agent.on("text", async (ctx) => {
            messageReceived = true;
            console.log(`✓ Message received: "${ctx.message.content}"`);
            const userMessage = ctx.message.content;
            const agentType = (await routeByCapabilities(userMessage));
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
    }
    catch (error) {
        console.error("✗ E2E Test Failed:", error);
        process.exit(1);
    }
}
runE2ETest();
