import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { WalletConnect } from './components/WalletConnect';
import { useXMTP } from './hooks/useXMTP';
import { useAgentPayment } from './hooks/useAgentPayment';
import { wagmiConfig } from './hooks/wagmiConfig';
import { recordVote } from './lib/scoring';
import './styles/App.css';
import '@rainbow-me/rainbowkit/styles.css';
const AGENT_PRICES = {
    'profile-roaster': '0.001',
    'linkedin-roaster': '0.001',
    'vibe-roaster': '0.001',
};
const getCurrentUserId = () => {
    let userId = localStorage.getItem('roast-generator-user-id');
    if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('roast-generator-user-id', userId);
    }
    return userId;
};
const AppContent = () => {
    const { sendMessage, error: xmtpError } = useXMTP();
    const { queryAgentWithPayment, loading: paymentLoading, error: paymentError, isConnected, isCorrectNetwork } = useAgentPayment();
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
    const handleImageUpload = async (imageBase64, agent) => {
        setUploadedImage(imageBase64);
        setIsLoading(true);
        try {
            // First, process payment on-chain
            if (isConnected && isCorrectNetwork) {
                const agentName = agent || 'profile-roaster';
                const price = AGENT_PRICES[agentName] || '0.001';
                console.log(`Processing payment for ${agentName} (${price} ETH)...`);
                const paymentResult = await queryAgentWithPayment(agentName, price);
                if (!paymentResult.success) {
                    throw new Error(`Payment failed: ${paymentResult.error}`);
                }
                console.log(`Payment confirmed! TX: ${paymentResult.txHash}`);
            }
            else if (!isConnected) {
                throw new Error('Please connect your wallet to proceed');
            }
            else if (!isCorrectNetwork) {
                throw new Error('Please switch to Base Sepolia network');
            }
            // Then, query the agent via XMTP
            const query = agent
                ? `[REQUEST TO ${agent.toUpperCase()}] Please roast this image: ${imageBase64.substring(0, 100)}...`
                : `Roast this image: ${imageBase64.substring(0, 100)}...`;
            const response = await sendMessage(query);
            if (response.agents) {
                const newResults = response.agents.map((agentResponse) => ({
                    agent: agentResponse.name,
                    capabilities: agentResponse.capabilities || [],
                    response: agentResponse.response,
                    timestamp: Date.now(),
                }));
                setResults((prev) => [...prev, ...newResults]);
            }
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error('Error:', errorMsg);
            alert(`Error: ${errorMsg}`);
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
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { className: "header-content", children: [_jsx("h1", { children: "AI Roast Generator" }), _jsx("p", { children: "Upload a selfie and get savage AI roasts \uD83D\uDE08" })] }), _jsxs("div", { className: "header-controls", children: [_jsx("button", { className: "theme-toggle", onClick: toggleDarkMode, title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode', "aria-label": "Toggle dark mode", children: isDarkMode ? '☀️' : '🌙' }), _jsx(WalletConnect, {})] })] }), _jsxs("main", { className: "main-content", children: [_jsx("section", { className: "network-status", children: isConnected ? (isCorrectNetwork ? (_jsx("div", { className: "status-badge success", children: "\u2713 Base Sepolia Connected" })) : (_jsx("div", { className: "status-badge warning", children: "\u26A0 Switch to Base Sepolia" }))) : (_jsx("div", { className: "status-badge warning", children: "\u26A0 Wallet not connected" })) }), _jsxs("section", { className: "query-section", children: [_jsx(QueryBuilder, { onSubmit: handleImageUpload, isLoading: isLoading || paymentLoading, availableAgents: [
                                    { name: 'profile-roaster', description: 'Dating Profile Roast' },
                                    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
                                    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
                                ] }), xmtpError && _jsx("div", { className: "error-banner", children: xmtpError }), paymentError && _jsx("div", { className: "error-banner", children: paymentError }), _jsx("div", { className: "pricing-info", children: _jsx("span", { className: "cost-badge", children: "\uD83D\uDCB0 0.001 ETH per roast" }) })] }), uploadedImage && (_jsxs("section", { className: "image-preview-section", children: [_jsx("h2", { children: "Your Selfie" }), _jsx("img", { src: uploadedImage, alt: "Your selfie", className: "preview-image" })] })), _jsxs("section", { className: "results-section", children: [_jsx("h2", { children: "The Roasts \uD83D\uDD25" }), _jsx(ResultsDisplay, { results: results })] }), _jsxs("section", { className: "voting-section", children: [_jsx("h2", { children: "Rate the Roasts" }), _jsx("p", { children: "Vote on how funny each roast is (1-5 scale, 5 = HILARIOUS)" }), results.length === 0 ? (_jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Upload a selfie to get roasted!" })) : (results.map((result, idx) => (_jsxs("div", { className: "vote-card", children: [_jsx("h4", { children: result.agent }), _jsx("div", { className: "vote-buttons", children: [1, 2, 3, 4, 5].map((score) => (_jsx("button", { onClick: () => handleVote(idx, score), className: `vote-btn ${votes[idx] === score ? 'active' : ''}`, children: score }, score))) }), _jsx("span", { className: "vote-value", children: votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote' })] }, idx))))] }), _jsxs("section", { className: "leaderboard-section", children: [_jsx("h2", { children: "Funniest Roasts" }), _jsx("p", { children: "Community's favorite roasts" }), _jsx(Leaderboard, { refreshTrigger: leaderboardRefresh })] })] })] }));
};
export const App = () => {
    return (_jsx(WagmiProvider, { config: wagmiConfig, children: _jsx(RainbowKitProvider, { children: _jsx(AppContent, {}) }) }));
};
//# sourceMappingURL=App.js.map