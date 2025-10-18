import { ethers } from "ethers";

interface AgentCapabilities {
  name: string;
  description: string;
  capabilities: string[];
  type: string;
  version: string;
}

const ENS_NAMES: Record<string, string> = {
  "defi-wizard": "defi-wizard.aiconfig.eth",
  "security-guru": "security-guru.aiconfig.eth",
};

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://eth-sepolia.g.alchemy.com/v2/7U4mbJajvpp6GzozCw6z6kMEGAqKcXkG";
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

export async function resolveAgentCapabilities(
  agentName: string
): Promise<AgentCapabilities | null> {
  try {
    const ensName = ENS_NAMES[agentName];
    if (!ensName) {
      console.log(`[ENS] Unknown agent: ${agentName}`);
      return null;
    }

    console.log(`[ENS] Resolving ${ensName}`);

    const resolver = await provider.getResolver(ensName);
    if (!resolver) {
      console.log(`[ENS] No resolver found for ${ensName}`);
      return null;
    }

    const capabilitiesUrl = await resolver.getText("agent.capabilities");
    const description = await resolver.getText("agent.description");
    const type = await resolver.getText("agent.type");
    const version = await resolver.getText("agent.version");

    if (!capabilitiesUrl) {
      console.log(`[ENS] No capabilities URL for ${ensName}`);
      return null;
    }

    console.log(`[ENS] Fetching capabilities from ${capabilitiesUrl}`);

    const response = await fetch(capabilitiesUrl);
    if (!response.ok) {
      console.error(`[ENS] Failed to fetch capabilities: ${response.status}`);
      return null;
    }

    const capabilitiesData = await response.json() as Record<string, unknown>;

    return {
      name: agentName,
      description: description || "No description",
      capabilities: (Array.isArray(capabilitiesData.capabilities) ? capabilitiesData.capabilities : []) as string[],
      type: type || "unknown",
      version: version || "1.0.0",
    };
  } catch (error) {
    console.error(`[ENS] Error resolving ${agentName}:`, error);
    return null;
  }
}

export async function routeByCapabilities(message: string): Promise<string> {
  const keywords: Record<string, string[]> = {
    "defi-wizard": [
      "defi",
      "yield",
      "farming",
      "apy",
      "liquidity",
      "tvl",
      "protocol",
      "pool",
    ],
    "security-guru": [
      "security",
      "contract",
      "vulnerability",
      "audit",
      "exploit",
      "reentrancy",
      "overflow",
      "access",
    ],
  };

  const lowerMsg = message.toLowerCase();

  for (const [agent, words] of Object.entries(keywords)) {
    if (words.some((word) => lowerMsg.includes(word))) {
      return agent;
    }
  }

  return "defi-wizard";
}

export async function formatResponseWithCapabilities(
  agentName: string,
  response: string
): Promise<string> {
  const capabilities = await resolveAgentCapabilities(agentName);

  if (!capabilities) {
    return response;
  }

  const capList = capabilities.capabilities.join(", ");
  
  return `[${agentName.toUpperCase()} - v${capabilities.version}]\nCapabilities: ${capList}\n\n${response}`;
}
