import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { useXMTP } from './hooks/useXMTP';
import { recordVote } from './lib/scoring';
import './styles/App.css';
const getCurrentUserId = () => {
    let userId = localStorage.getItem('roast-generator-user-id');
    if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('roast-generator-user-id', userId);
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
        const saved = localStorage.getItem('roast-generator-dark-mode');
        return saved ? JSON.parse(saved) : false;
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const userId = getCurrentUserId();
    // Apply dark mode on mount and when toggled
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }
        else {
            document.documentElement.classList.remove('dark-mode');
        }
        localStorage.setItem('roast-generator-dark-mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);
    useEffect(() => {
        setLeaderboardRefresh(0);
    }, []);
    const handleImageUpload = async (imageBase64, selectedAgent) => {
        setUploadedImage(imageBase64);
        setIsLoading(true);
        try {
            const query = selectedAgent
                ? `[REQUEST TO ${selectedAgent.toUpperCase()}] Please roast this image: ${imageBase64.substring(0, 100)}...`
                : `Roast this image: ${imageBase64.substring(0, 100)}...`;
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
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { className: "header-content", children: [_jsx("h1", { children: "AI Roast Generator" }), _jsx("p", { children: "Upload a selfie and get savage AI roasts \uD83D\uDE08" })] }), _jsx("button", { className: "theme-toggle", onClick: toggleDarkMode, title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode', "aria-label": "Toggle dark mode", children: isDarkMode ? '☀️' : '🌙' })] }), _jsxs("main", { className: "main-content", children: [_jsxs("section", { className: "query-section", children: [_jsx(QueryBuilder, { onSubmit: handleImageUpload, isLoading: isLoading, availableAgents: [
                                    { name: 'profile-roaster', description: 'Dating Profile Roast' },
                                    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
                                    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
                                ] }), xmtpError && _jsx("div", { className: "error-banner", children: xmtpError })] }), uploadedImage && (_jsxs("section", { className: "image-preview-section", children: [_jsx("h2", { children: "Your Selfie" }), _jsx("img", { src: uploadedImage, alt: "Your selfie", className: "preview-image" })] })), _jsxs("section", { className: "results-section", children: [_jsx("h2", { children: "The Roasts \uD83D\uDD25" }), _jsx(ResultsDisplay, { results: results })] }), _jsxs("section", { className: "voting-section", children: [_jsx("h2", { children: "Rate the Roasts" }), _jsx("p", { children: "Vote on how funny each roast is (1-5 scale, 5 = HILARIOUS)" }), results.length === 0 ? (_jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Upload a selfie to get roasted!" })) : (results.map((result, idx) => (_jsxs("div", { className: "vote-card", children: [_jsx("h4", { children: result.agent }), _jsx("div", { className: "vote-buttons", children: [1, 2, 3, 4, 5].map((score) => (_jsx("button", { onClick: () => handleVote(idx, score), className: `vote-btn ${votes[idx] === score ? 'active' : ''}`, children: score }, score))) }), _jsx("span", { className: "vote-value", children: votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote' })] }, idx))))] }), _jsxs("section", { className: "leaderboard-section", children: [_jsx("h2", { children: "Funniest Roasts" }), _jsx("p", { children: "Community's favorite roasts" }), _jsx(Leaderboard, { refreshTrigger: leaderboardRefresh })] })] })] }));
};
//# sourceMappingURL=App.js.map