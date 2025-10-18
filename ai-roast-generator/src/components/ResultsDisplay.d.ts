import React from 'react';
interface AgentResponse {
    agent: string;
    capabilities: string[];
    response: string;
    timestamp: number;
}
interface ResultsDisplayProps {
    results: AgentResponse[];
}
export declare const ResultsDisplay: React.FC<ResultsDisplayProps>;
export {};
//# sourceMappingURL=ResultsDisplay.d.ts.map