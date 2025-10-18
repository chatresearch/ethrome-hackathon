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
export declare function recordVote(userId: string, vote: VoteData): void;
export declare function getVotes(): Array<VoteData & {
    userId: string;
}>;
export declare function updateUserStats(userId: string): UserStats;
export declare function getAllUserStats(): UserStats[];
export declare function getLeaderboard(): LeaderboardEntry[];
export declare function getUserStats(userId: string): UserStats | undefined;
export declare function clearAllData(): void;
export {};
//# sourceMappingURL=scoring.d.ts.map