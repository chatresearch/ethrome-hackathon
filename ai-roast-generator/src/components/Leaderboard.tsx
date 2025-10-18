import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../lib/scoring';

export const Leaderboard: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, [refreshTrigger]);

  if (entries.length === 0) {
    return (
      <div className="leaderboard-empty">
        No votes yet. Start voting to appear on the leaderboard!
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="user-col">User</th>
            <th className="accuracy-col">Accuracy</th>
            <th className="votes-col">Votes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry.userId} className={idx < 3 ? `top-${idx + 1}` : ''}>
              <td className="rank-col">
                <span className="rank-badge">#{entry.rank}</span>
              </td>
              <td className="user-col">{entry.userId}</td>
              <td className="accuracy-col">
                <span className="accuracy-score">{entry.accuracyScore}%</span>
              </td>
              <td className="votes-col">{entry.totalVotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
