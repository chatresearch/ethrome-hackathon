interface AgentPaymentResult {
    success: boolean;
    txHash?: string;
    error?: string;
}
export declare function useAgentPayment(): {
    queryAgentWithPayment: (agentName: string, priceInEth: string) => Promise<AgentPaymentResult>;
    loading: boolean;
    error: string | null;
    isConnected: boolean;
    isCorrectNetwork: boolean;
};
export declare function fetchAgentPrice(agentName: string): Promise<string>;
export {};
//# sourceMappingURL=useAgentPayment.d.ts.map