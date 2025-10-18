import React, { useState } from 'react';

interface QueryBuilderProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading?: boolean;
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ onSubmit, isLoading = false }) => {
  const [protocolName, setProtocolName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!protocolName.trim()) {
      setError('Please enter a protocol name');
      return;
    }

    try {
      await onSubmit(`Analyze the protocol: ${protocolName}`);
      setProtocolName('');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="query-builder">
      <div className="query-input">
        <input
          type="text"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
          placeholder="Enter protocol name (e.g., Aave, Uniswap, Lido)"
          disabled={isLoading}
          className="protocol-input"
        />
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Analyzing...' : 'Analyze Protocol'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};


