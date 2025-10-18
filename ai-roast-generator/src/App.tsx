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
  let userId = localStorage.getItem('roast-generator-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('roast-generator-user-id', userId);
  }
  return userId;
};

export const App: React.FC = () => {
  const { sendMessage, error: xmtpError } = useXMTP();
  const [results, setResults] = useState<AgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('roast-generator-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const userId = getCurrentUserId();

  // Apply dark mode on mount and when toggled
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('roast-generator-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    setLeaderboardRefresh(0);
  }, []);

  const handleImageUpload = async (imageBase64: string, selectedAgent?: string) => {
    setUploadedImage(imageBase64);
    setIsLoading(true);
    try {
      const query = selectedAgent
        ? `[REQUEST TO ${selectedAgent.toUpperCase()}] Please roast this image: ${imageBase64.substring(0, 100)}...`
        : `Roast this image: ${imageBase64.substring(0, 100)}...`;
      
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>AI Roast Generator</h1>
          <p>Upload a selfie and get savage AI roasts 😈</p>
        </div>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="main-content">
        <section className="query-section">
          <QueryBuilder 
            onSubmit={handleImageUpload} 
            isLoading={isLoading}
            availableAgents={[
              { name: 'profile-roaster', description: 'Dating Profile Roast' },
              { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
              { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
            ]}
          />
          {xmtpError && <div className="error-banner">{xmtpError}</div>}
        </section>

        {uploadedImage && (
          <section className="image-preview-section">
            <h2>Your Selfie</h2>
            <img src={uploadedImage} alt="Your selfie" className="preview-image" />
          </section>
        )}

        <section className="results-section">
          <h2>The Roasts 🔥</h2>
          <ResultsDisplay results={results} />
        </section>

        <section className="voting-section">
          <h2>Rate the Roasts</h2>
          <p>Vote on how funny each roast is (1-5 scale, 5 = HILARIOUS)</p>
          {results.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Upload a selfie to get roasted!</p>
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
          <h2>Funniest Roasts</h2>
          <p>Community's favorite roasts</p>
          <Leaderboard refreshTrigger={leaderboardRefresh} />
        </section>
      </main>
    </div>
  );
};
