import React, { useState } from 'react';

interface QueryBuilderProps {
  onSubmit: (query: string, agent?: string) => Promise<void>;
  isLoading?: boolean;
  availableAgents?: { name: string; description: string }[];
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ 
  onSubmit, 
  isLoading = false,
  availableAgents = [
    { name: 'defi-wizard', description: 'DeFi Protocol Analysis' },
    { name: 'security-guru', description: 'Security Audit' }
  ]
}) => {
  const [protocolName, setProtocolName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!protocolName.trim()) {
      setError('Please enter a protocol name or question');
      return;
    }

    try {
      const query = selectedAgent 
        ? `[REQUEST TO ${selectedAgent.toUpperCase()}] ${protocolName}`
        : `Analyze the protocol: ${protocolName}`;
      
      await onSubmit(query, selectedAgent || undefined);
      setProtocolName('');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="query-builder">
      <div className="query-controls">
        <div className="agent-selector-wrapper">
          <label htmlFor="agent-select" className="agent-label">
            Choose Agent (optional):
          </label>
          <select
            id="agent-select"
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value || null)}
            disabled={isLoading}
            className="agent-select"
          >
            <option value="">Auto-route by query</option>
            {availableAgents.map((agent) => (
              <option key={agent.name} value={agent.name}>
                {agent.name === 'defi-wizard' ? '💰' : '🔒'} {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="query-input">
        <input
          type="text"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
          placeholder="Enter protocol name (e.g., Aave, Uniswap, Lido) or ask a question"
          disabled={isLoading}
          className="protocol-input"
        />
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};


