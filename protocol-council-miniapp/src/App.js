import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { useXMTP } from './hooks/useXMTP';
import { recordVote } from './lib/scoring';
import './styles/App.css';
const getCurrentUserId = () => {
    let userId = localStorage.getItem('protocol-council-user-id');
    if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('protocol-council-user-id', userId);
    }
    return userId;
};
export const App = () => {
    const { sendMessage, error: xmtpError } = useXMTP();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [votes, setVotes] = useState({});
    const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('protocol-council-dark-mode');
        return saved ? JSON.parse(saved) : false;
    });
    const userId = getCurrentUserId();
    // Apply dark mode on mount and when toggled
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }
        else {
            document.documentElement.classList.remove('dark-mode');
        }
        localStorage.setItem('protocol-council-dark-mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);
    useEffect(() => {
        setLeaderboardRefresh(0);
    }, []);
    const handleQuerySubmit = async (query, _selectedAgent) => {
        setIsLoading(true);
        try {
            const response = await sendMessage(query);
            if (response.agents) {
                const newResults = response.agents.map((agent) => ({
                    agent: agent.name,
                    capabilities: agent.capabilities || [],
                    response: agent.response,
                    timestamp: Date.now(),
                }));
                setResults((prev) => [...prev, ...newResults]);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleVote = (resultIdx, accuracy) => {
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
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { className: "header-content", children: [_jsx("h1", { children: "Protocol Council" }), _jsx("p", { children: "Collaborative protocol analysis with AI agents" })] }), _jsx("button", { className: "theme-toggle", onClick: toggleDarkMode, title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode', "aria-label": "Toggle dark mode", children: isDarkMode ? '☀️' : '🌙' })] }), _jsxs("main", { className: "main-content", children: [_jsxs("section", { className: "query-section", children: [_jsx(QueryBuilder, { onSubmit: handleQuerySubmit, isLoading: isLoading, availableAgents: [
                                    { name: 'defi-wizard', description: 'DeFi Protocol Analysis' },
                                    { name: 'security-guru', description: 'Security Audit' }
                                ] }), xmtpError && _jsx("div", { className: "error-banner", children: xmtpError })] }), _jsxs("section", { className: "results-section", children: [_jsx("h2", { children: "Agent Analysis" }), _jsx(ResultsDisplay, { results: results })] }), _jsxs("section", { className: "voting-section", children: [_jsx("h2", { children: "Accuracy Voting" }), _jsx("p", { children: "Vote on how accurate each agent's analysis is (1-5 scale)" }), results.length === 0 ? (_jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Submit a query to vote on agent responses" })) : (results.map((result, idx) => (_jsxs("div", { className: "vote-card", children: [_jsx("h4", { children: result.agent }), _jsx("div", { className: "vote-buttons", children: [1, 2, 3, 4, 5].map((score) => (_jsx("button", { onClick: () => handleVote(idx, score), className: `vote-btn ${votes[idx] === score ? 'active' : ''}`, children: score }, score))) }), _jsx("span", { className: "vote-value", children: votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote' })] }, idx))))] }), _jsxs("section", { className: "leaderboard-section", children: [_jsx("h2", { children: "Leaderboard" }), _jsx("p", { children: "Top contributors by accuracy" }), _jsx(Leaderboard, { refreshTrigger: leaderboardRefresh })] })] })] }));
};
//# sourceMappingURL=App.js.map