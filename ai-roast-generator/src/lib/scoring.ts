interface VoteData {
  resultIndex: number;
  agentName: string;
  vote: number;
  timestamp: number;
}

interface UserStats {
  userId: string;
  totalVotes: number;
  correctVotes: number;
  accuracyScore: number;
  lastUpdated: number;
}

export interface LeaderboardEntry extends UserStats {
  rank: number;
}

export interface RoastData {
  id: string;
  agent: string;
  roastText: string;
  imageUrl?: string;
  votes: number;
  timestamp: number;
}

export interface AgentStats {
  agent: string;
  totalVotes: number;
  totalRoasts: number;
}

const STORAGE_KEY = 'ai-roast-generator-votes';
const USERS_KEY = 'ai-roast-generator-users';
const ROASTS_KEY = 'ai-roast-generator-roasts';

export function recordVote(userId: string, vote: VoteData): void {
  const votes = getVotes();
  votes.push({ ...vote, userId });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  updateUserStats(userId);
}

export function recordRoast(agent: string, roastText: string, imageUrl?: string): void {
  const roasts = getRoasts();
  const roastId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  roasts.push({
    id: roastId,
    agent,
    roastText,
    imageUrl,
    votes: 0,
    timestamp: Date.now(),
  });
  localStorage.setItem(ROASTS_KEY, JSON.stringify(roasts));
}

export function getRoasts(): RoastData[] {
  const stored = localStorage.getItem(ROASTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function voteRoast(roastId: string): void {
  const roasts = getRoasts();
  const roast = roasts.find(r => r.id === roastId);
  if (roast) {
    roast.votes++;
    localStorage.setItem(ROASTS_KEY, JSON.stringify(roasts));
  }
}

export function getTopRoasts(limit: number = 10): RoastData[] {
  return getRoasts()
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
}

export function getAgentLeaderboard(limit: number = 10): AgentStats[] {
  const roasts = getRoasts();
  const agentStats = new Map<string, { totalVotes: number; totalRoasts: number }>();
  
  roasts.forEach(roast => {
    if (!agentStats.has(roast.agent)) {
      agentStats.set(roast.agent, { totalVotes: 0, totalRoasts: 0 });
    }
    const stats = agentStats.get(roast.agent)!;
    stats.totalVotes += roast.votes;
    stats.totalRoasts += 1;
  });
  
  return Array.from(agentStats.entries())
    .map(([agent, stats]) => ({
      agent,
      ...stats,
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, limit);
}

export function getVotes(): Array<VoteData & { userId: string }> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function updateUserStats(userId: string): UserStats {
  const votes = getVotes().filter(v => v.userId === userId);
  const correctVotes = votes.filter(v => v.vote >= 4).length;
  
  const stats: UserStats = {
    userId,
    totalVotes: votes.length,
    correctVotes,
    accuracyScore: votes.length > 0 ? Math.round((correctVotes / votes.length) * 100) : 0,
    lastUpdated: Date.now(),
  };
  
  const users = getAllUserStats();
  const existingIdx = users.findIndex(u => u.userId === userId);
  if (existingIdx >= 0) {
    users[existingIdx] = stats;
  } else {
    users.push(stats);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return stats;
}

export function getAllUserStats(): UserStats[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLeaderboard(): LeaderboardEntry[] {
  const stats = getAllUserStats()
    .sort((a, b) => {
      if (a.accuracyScore !== b.accuracyScore) {
        return b.accuracyScore - a.accuracyScore;
      }
      return b.totalVotes - a.totalVotes;
    })
    .map((stat, idx) => ({
      ...stat,
      rank: idx + 1,
    }));
  
  return stats;
}

export function getUserStats(userId: string): UserStats | undefined {
  return getAllUserStats().find(u => u.userId === userId);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USERS_KEY);
}


