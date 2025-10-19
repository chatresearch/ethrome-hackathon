import React, { useState, useEffect } from 'react';
import { getAgentLeaderboard, AgentStats } from '../lib/scoring';

export const Leaderboard: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [entries, setEntries] = useState<AgentStats[]>([]);

  useEffect(() => {
    setEntries(getAgentLeaderboard(10));
  }, [refreshTrigger]);

  if (entries.length === 0) {
    return (
      <div className="leaderboard-empty">
        No votes yet. Start voting to appear on the leaderboard!
      </div>
    );
  }

  const getAgentIcon = (agentName: string): string => {
    if (agentName.includes('defi')) return '💰';
    if (agentName.includes('security')) return '🔒';
    if (agentName.includes('profile')) return '💕';
    if (agentName.includes('linkedin')) return '💼';
    if (agentName.includes('vibe')) return '✨';
    return '😈';
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>Funniest Roasts</h3>
        <p className="leaderboard-subtitle">Community's favorite roasts</p>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="agent-col">Roaster</th>
            <th className="roasts-col">Roasts</th>
            <th className="votes-col">Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry.agent} className={idx < 3 ? `top-${idx + 1}` : ''}>
              <td className="rank-col">
                <span className="rank-badge">#{idx + 1}</span>
              </td>
              <td className="agent-col">
                <span className="agent-icon">{getAgentIcon(entry.agent)}</span>
                {entry.agent}
              </td>
              <td className="roasts-col">{entry.totalRoasts}</td>
              <td className="votes-col">⭐ {entry.totalVotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
