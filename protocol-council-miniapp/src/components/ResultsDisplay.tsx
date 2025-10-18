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

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) {
    return <div className="results-empty">Submit a protocol to see agent analysis</div>;
  }

  return (
    <div className="results-display">
      {results.map((result, idx) => (
        <div key={idx} className="result-card">
          <div className="agent-header">
            <h3>{result.agent.toUpperCase()}</h3>
            <div className="capabilities">
              {result.capabilities.map((cap, i) => (
                <span key={i} className="capability-badge">
                  {cap}
                </span>
              ))}
            </div>
          </div>
          <p className="response-text">{result.response}</p>
          <div className="timestamp">
            {new Date(result.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};


