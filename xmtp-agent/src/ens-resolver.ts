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
  "profile-roaster": "profile-roaster.aiconfig.eth",
  "linkedin-roaster": "linkedin-roaster.aiconfig.eth",
  "vibe-roaster": "vibe-roaster.aiconfig.eth",
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

    // Extract capabilities - handle both string arrays and object arrays
    let capabilitiesArray: string[] = [];
    if (Array.isArray(capabilitiesData.capabilities)) {
      capabilitiesArray = capabilitiesData.capabilities
        .map((cap: any) => {
          if (typeof cap === 'string') return cap;
          if (typeof cap === 'object' && cap.name) return cap.name;
          if (typeof cap === 'object' && cap.title) return cap.title;
          return String(cap);
        })
        .filter(Boolean);
    }

    return {
      name: agentName,
      description: description || "No description",
      capabilities: capabilitiesArray,
      type: type || "unknown",
      version: version || "1.0.0",
    };
  } catch (error) {
    console.error(`[ENS] Error resolving ${agentName}:`, error);
    return null;
  }
}

export async function routeByCapabilities(message: string): Promise<string> {
  const lowerMsg = message.toLowerCase();

  // Check for explicit agent request format: [REQUEST TO agentname]
  const explicitRequestMatch = message.match(/\[REQUEST TO (\w+-\w+)\]/i);
  if (explicitRequestMatch) {
    const requestedAgent = explicitRequestMatch[1].toLowerCase();
    const validAgents = ["defi-wizard", "security-guru", "profile-roaster", "linkedin-roaster", "vibe-roaster"];
    if (validAgents.includes(requestedAgent)) {
      console.log(`[Router] Explicit request detected: ${requestedAgent}`);
      return requestedAgent;
    }
  }

  // Roasting keywords (check first, highest priority)
  if (lowerMsg.includes("roast") || lowerMsg.includes("image") || lowerMsg.includes("photo") || lowerMsg.includes("selfie")) {
    if (lowerMsg.includes("linkedin") || lowerMsg.includes("professional") || lowerMsg.includes("headshot")) {
      return "linkedin-roaster";
    } else if (lowerMsg.includes("vibe") || lowerMsg.includes("aesthetic") || lowerMsg.includes("fashion")) {
      return "vibe-roaster";
    }
    // Default to profile roaster for general roasting
    return "profile-roaster";
  }

  // DeFi keywords
  const defiKeywords = [
    "defi",
    "yield",
    "farming",
    "apy",
    "liquidity",
    "tvl",
    "protocol",
    "pool",
  ];
  if (defiKeywords.some((word) => lowerMsg.includes(word))) {
    return "defi-wizard";
  }

  // Security keywords
  const securityKeywords = [
    "security",
    "contract",
    "vulnerability",
    "audit",
    "exploit",
    "reentrancy",
    "overflow",
    "access",
  ];
  if (securityKeywords.some((word) => lowerMsg.includes(word))) {
    return "security-guru";
  }

  // Default to profile roaster for unknown
  return "profile-roaster";
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
