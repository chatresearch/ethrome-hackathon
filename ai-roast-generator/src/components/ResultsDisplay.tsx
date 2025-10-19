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

  const handleShare = (agentName: string, roastText: string, idx: number) => {
    const cleanedText = cleanRoastText(roastText);
    const shortRoast = cleanedText.substring(0, 200);
    const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
    const fullShareUrl = `${window.location.origin}${shareableUrl}`;
    
    const shareText = `Just got roasted by ${agentName}! 🔥\n\n"${shortRoast}..."\n\n${fullShareUrl}`;
    handleCopy(shareText, idx);
  };

  const handleTwitterShare = (agentName: string, roastText: string) => {
    const cleanedText = cleanRoastText(roastText);
    const shortRoast = cleanedText.substring(0, 100);
    const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
    const fullShareUrl = `${window.location.origin}${shareableUrl}`;
    
    const text = `Just got roasted by ${agentName}! 🔥\n"${shortRoast}..."\n\nTry AI Roast Generator`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullShareUrl)}`;
    window.open(url, 'twitter-share', 'width=550,height=420');
  };

  const handleFarcasterShare = (agentName: string, roastText: string) => {
    const cleanedText = cleanRoastText(roastText);
    const shortRoast = cleanedText.substring(0, 100);
    const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
    const fullShareUrl = `${window.location.origin}${shareableUrl}`;
    
    const text = `Just got roasted by ${agentName}! 🔥\n"${shortRoast}..."\n\nTry AI Roast Generator at ${fullShareUrl}`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, 'farcaster-share', 'width=550,height=420');
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

  const cleanRoastText = (text: string) => {
    // Remove only the first line [AGENT-NAME] and the Capabilities line
    // Split by first double newline to separate header from content
    const lines = text.split('\n');
    
    // Find where the actual roast content starts (after capabilities line)
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Capabilities:')) {
        startIdx = i + 1;
        // Skip empty lines after capabilities
        while (startIdx < lines.length && lines[startIdx].trim() === '') {
          startIdx++;
        }
        break;
      }
    }
    
    return lines.slice(startIdx).join('\n').trim();
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
                onClick={() => handleCopy(cleanRoastText(result.response), idx)}
                title="Copy response"
                aria-label="Copy response to clipboard"
              >
                {copiedIdx === idx ? '✓ Copied!' : '📋 Copy'}
              </button>
              {s3ImageUrl && (
                <>
                  <button
                    className="share-btn"
                    onClick={() => handleTwitterShare(result.agent, cleanRoastText(result.response))}
                    title="Share on Twitter/X"
                    aria-label="Share on Twitter"
                  >
                    𝕏 Tweet
                  </button>
                  <button
                    className="share-btn"
                    onClick={() => handleFarcasterShare(result.agent, cleanRoastText(result.response))}
                    title="Share on Farcaster"
                    aria-label="Share on Farcaster"
                  >
                    🎭 Cast
                  </button>
                  <button
                    className="share-btn"
                    onClick={() => handleShare(result.agent, cleanRoastText(result.response), idx)}
                    title="Copy shareable text"
                    aria-label="Copy shareable text"
                  >
                    {copiedIdx === idx ? '✓ Copied!' : '🔗 Share'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="capabilities">
            {result.capabilities.map((cap, capIdx) => (
              <span key={capIdx} className="capability-badge">
                {cap}
              </span>
            ))}
          </div>

          <div className="response-text">
            {expandedIdx.has(idx) ? cleanRoastText(result.response) : `${cleanRoastText(result.response).substring(0, 200)}...`}
          </div>

          <div className="response-container">
            {cleanRoastText(result.response).length > 300 && (
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


