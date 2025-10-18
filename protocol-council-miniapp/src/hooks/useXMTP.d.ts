interface XMTPMessage {
    sender: string;
    content: string;
    timestamp: number;
    agentType?: string;
}
export declare function useXMTP(): {
    messages: XMTPMessage[];
    error: string | null;
    sendMessage: (content: string) => Promise<any>;
    addAgentResponse: (response: XMTPMessage) => void;
};
export {};
//# sourceMappingURL=useXMTP.d.ts.map