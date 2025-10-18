import React, { useState } from 'react';

interface AgentResponse {
  agent: string;
  capabilities: string[];
  response: string;
  timestamp: number;
}

interface ResultsDisplayProps {
  results: AgentResponse[];
  s3ImageUrl?: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, s3ImageUrl }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleExpand = (idx: number) => {
    const newExpanded = new Set(expandedIdx);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedIdx(newExpanded);
  };

  const getAgentIcon = (agentName: string): string => {
    if (agentName.includes('defi')) return '💰';
    if (agentName.includes('security')) return '🔒';
    if (agentName.includes('profile')) return '💕';
    if (agentName.includes('linkedin')) return '💼';
    if (agentName.includes('vibe')) return '✨';
    return '😈';
  };

  if (results.length === 0) {
    return <div className="results-empty">Submit a query to see agent analysis</div>;
  }

  return (
    <div className="results-display">
      {results.map((result, idx) => (
        <div key={idx} className="result-card" style={{ animation: `slideIn 0.3s ease-out ${idx * 50}ms both` }}>
          <div className="agent-header">
            <div className="agent-title">
              <span className="agent-icon">{getAgentIcon(result.agent)}</span>
              <h3>{result.agent.toUpperCase()}</h3>
            </div>
            <div className="result-actions">
              <button
                className="copy-btn"
                onClick={() => handleCopy(result.response, idx)}
                title="Copy response"
                aria-label="Copy response to clipboard"
              >
                {copiedIdx === idx ? '✓ Copied!' : '📋 Copy'}
              </button>
              {s3ImageUrl && (
                <button
                  className="share-btn"
                  onClick={() => {
                    const shareText = `Check out this roast! 🔥 ${s3ImageUrl}`;
                    navigator.clipboard.writeText(shareText);
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2000);
                  }}
                  title="Copy shareable link"
                  aria-label="Copy shareable link"
                >
                  {copiedIdx === idx ? '✓ Copied!' : '🔗 Share'}
                </button>
              )}
            </div>
          </div>

          <div className="capabilities">
            {result.capabilities.length > 0 ? (
              result.capabilities.map((cap, i) => (
                <span key={i} className="capability-badge">
                  {cap}
                </span>
              ))
            ) : (
              <span className="capability-badge">General AI Analysis</span>
            )}
          </div>

          <div className="response-container">
            <p className={`response-text ${expandedIdx.has(idx) ? 'expanded' : 'collapsed'}`}>
              {result.response}
            </p>
            {result.response.length > 300 && (
              <button
                className="expand-btn"
                onClick={() => toggleExpand(idx)}
              >
                {expandedIdx.has(idx) ? '↑ Show less' : '↓ Show more'}
              </button>
            )}
          </div>

          <div className="result-footer">
            <time className="timestamp" dateTime={new Date(result.timestamp).toISOString()}>
              {new Date(result.timestamp).toLocaleTimeString()} • {new Date(result.timestamp).toLocaleDateString()}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
};


