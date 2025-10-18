const STORAGE_KEY = 'protocol-council-votes';
const USERS_KEY = 'protocol-council-users';
export function recordVote(userId, vote) {
    const votes = getVotes();
    votes.push({ ...vote, userId });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    updateUserStats(userId);
}
export function getVotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
export function updateUserStats(userId) {
    const votes = getVotes().filter(v => v.userId === userId);
    const correctVotes = votes.filter(v => v.vote >= 4).length;
    const stats = {
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
    }
    else {
        users.push(stats);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return stats;
}
export function getAllUserStats() {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}
export function getLeaderboard() {
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
export function getUserStats(userId) {
    return getAllUserStats().find(u => u.userId === userId);
}
export function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USERS_KEY);
}
//# sourceMappingURL=scoring.js.map