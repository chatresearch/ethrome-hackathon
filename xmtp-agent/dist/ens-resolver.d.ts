interface AgentCapabilities {
    name: string;
    description: string;
    capabilities: string[];
    type: string;
    version: string;
}
export declare function resolveAgentCapabilities(agentName: string): Promise<AgentCapabilities | null>;
export declare function routeByCapabilities(message: string): Promise<string>;
export declare function formatResponseWithCapabilities(agentName: string, response: string): Promise<string>;
export {};
