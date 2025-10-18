import React, { useState, useEffect } from 'react';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { useXMTP } from './hooks/useXMTP';
import { recordVote } from './lib/scoring';
import './styles/App.css';

interface AgentResponse {
  agent: string;
  capabilities: string[];
  response: string;
  timestamp: number;
}

const getCurrentUserId = () => {
  let userId = localStorage.getItem('protocol-council-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('protocol-council-user-id', userId);
  }
  return userId;
};

export const App: React.FC = () => {
  const { sendMessage, error: xmtpError } = useXMTP();
  const [results, setResults] = useState<AgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const userId = getCurrentUserId();

  useEffect(() => {
    setLeaderboardRefresh(0);
  }, []);

  const handleQuerySubmit = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await sendMessage(query);
      
      if (response.agents) {
        const newResults = response.agents.map((agent: any) => ({
          agent: agent.name,
          capabilities: agent.capabilities || [],
          response: agent.response,
          timestamp: Date.now(),
        }));
        setResults((prev) => [...prev, ...newResults]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (resultIdx: number, accuracy: number) => {
    setVotes((prev) => ({
      ...prev,
      [resultIdx]: accuracy,
    }));

    recordVote(userId, {
      resultIndex: resultIdx,
      agentName: results[resultIdx]?.agent || 'unknown',
      vote: accuracy,
      timestamp: Date.now(),
    });

    setLeaderboardRefresh(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Protocol Council</h1>
        <p>Collaborative protocol analysis with AI agents</p>
      </header>

      <main className="main-content">
        <section className="query-section">
          <QueryBuilder onSubmit={handleQuerySubmit} isLoading={isLoading} />
          {xmtpError && <div className="error-banner">{xmtpError}</div>}
        </section>

        <section className="results-section">
          <h2>Agent Analysis</h2>
          <ResultsDisplay results={results} />
        </section>

        <section className="voting-section">
          <h2>Accuracy Voting</h2>
          <p>Vote on how accurate each agent's analysis is (1-5 scale)</p>
          {results.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>Submit a query to vote on agent responses</p>
          ) : (
            results.map((result, idx) => (
              <div key={idx} className="vote-card">
                <h4>{result.agent}</h4>
                <div className="vote-buttons">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleVote(idx, score)}
                      className={`vote-btn ${votes[idx] === score ? 'active' : ''}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <span className="vote-value">{votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote'}</span>
              </div>
            ))
          )}
        </section>

        <section className="leaderboard-section">
          <h2>Leaderboard</h2>
          <p>Top contributors by accuracy</p>
          <Leaderboard refreshTrigger={leaderboardRefresh} />
        </section>
      </main>
    </div>
  );
};
