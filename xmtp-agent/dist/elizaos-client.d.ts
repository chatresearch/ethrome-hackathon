/**
 * Direct client for calling ElizaOS agents without HTTP
 * This imports the agents directly and calls them programmatically
 */
export declare function callElizaOSAgent(agentName: string, message: string): Promise<string>;
