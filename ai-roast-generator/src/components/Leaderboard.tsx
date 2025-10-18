import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry, getTopRoasts, RoastData } from '../lib/scoring';

export const Leaderboard: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [entries, setEntries] = useState<RoastData[]>([]);

  useEffect(() => {
    setEntries(getTopRoasts(10));
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
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="agent-col">Agent</th>
            <th className="roast-col">Roast</th>
            <th className="votes-col">Votes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => {
            const shareableUrl = entry.imageUrl 
              ? `/api/roast?image=${encodeURIComponent(entry.imageUrl)}&agent=${encodeURIComponent(entry.agent)}&text=${encodeURIComponent(entry.roastText)}`
              : '#';
            return (
              <tr key={entry.id} className={idx < 3 ? `top-${idx + 1}` : ''}>
                <td className="rank-col">
                  <span className="rank-badge">#{idx + 1}</span>
                </td>
                <td className="agent-col">
                  <span className="agent-icon">{getAgentIcon(entry.agent)}</span>
                  {entry.agent}
                </td>
                <td className="roast-col">
                  <a href={shareableUrl} target="_blank" rel="noopener noreferrer" className="roast-link">
                    {entry.roastText.substring(0, 50)}...
                  </a>
                </td>
                <td className="votes-col">⭐ {entry.votes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
