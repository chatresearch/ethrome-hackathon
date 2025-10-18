import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { WalletConnect } from './components/WalletConnect';
import { useXMTP } from './hooks/useXMTP';
import { useAgentPayment, fetchAgentPrice, fetchAgentAvatar } from './hooks/useAgentPayment';
import { useS3Upload } from './hooks/useS3Upload';
import { wagmiConfig } from './hooks/wagmiConfig';
import { recordVote } from './lib/scoring';
import './styles/App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { useHealthCheck } from './hooks/useHealthCheck';
import { Confetti } from './components/Confetti';
const AGENT_PRICES = {
    'profile-roaster': '0.00001',
    'linkedin-roaster': '0.00001',
    'vibe-roaster': '0.00001',
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
    const { uploadImageToS3 } = useS3Upload();
    const xmtpHealth = useHealthCheck();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [votes, setVotes] = useState({});
    const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('roast-generator-dark-mode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Check system preference
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [s3ImageUrl, setS3ImageUrl] = useState(null);
    const [livePrices, setLivePrices] = useState(AGENT_PRICES);
    const [agentAvatars, setAgentAvatars] = useState({});
    const [isAnimatedTagline, setIsAnimatedTagline] = useState(false);
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const userId = getCurrentUserId();
    // Fetch live agent prices and avatars on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const agents = ['profile-roaster', 'linkedin-roaster', 'vibe-roaster', 'defi-wizard', 'security-guru'];
                // Fetch prices
                const prices = {};
                for (const agent of agents) {
                    const agentFqn = `${agent}.aiconfig.eth`;
                    try {
                        const price = await fetchAgentPrice(agentFqn);
                        prices[agent] = price;
                    }
                    catch (error) {
                        console.warn(`[Price] Failed to fetch for ${agent}:`, error instanceof Error ? error.message : String(error));
                        // Continue without price for this agent
                    }
                }
                setLivePrices(prices);
                console.log('Live prices fetched from contract:', prices);
                // Fetch avatars in parallel
                const avatarPromises = agents.map(async (agent) => {
                    const agentFqn = `${agent}.aiconfig.eth`;
                    try {
                        const avatar = await fetchAgentAvatar(agentFqn);
                        console.log(`[Avatar] ✅ Loaded ${agent}`);
                        return { agent, avatar };
                    }
                    catch (error) {
                        console.warn(`[Avatar] Failed to fetch for ${agent}:`, error instanceof Error ? error.message : String(error));
                        return { agent, avatar: null };
                    }
                });
                // Set avatars as they complete
                const results = await Promise.all(avatarPromises);
                const avatars = {};
                results.forEach(({ agent, avatar }) => {
                    if (avatar) {
                        avatars[agent] = avatar;
                        setAgentAvatars((prev) => ({ ...prev, [agent]: avatar }));
                    }
                });
                console.log('Agent avatars fetched:', avatars);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                console.error('CRITICAL: Failed to fetch live prices and avatars from contract:', message);
                throw new Error(`Cannot load agent prices or avatars from Base Sepolia: ${message}`);
            }
        };
        fetchData();
    }, []);
    // Animate tagline every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimatedTagline(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    // Trigger confetti when first result appears
    useEffect(() => {
        if (results.length > 0) {
            setConfettiTrigger(prev => prev + 1);
        }
    }, [results.length]);
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
        setS3ImageUrl(null);
        setIsLoading(true);
        try {
            // Parse agents - can be comma-separated or single agent
            const agentsToUse = agent ? agent.split(',').map(a => a.trim()) : [];
            // First, process payment on-chain for each agent
            if (isConnected && isCorrectNetwork && agentsToUse.length > 0) {
                for (const agentName of agentsToUse) {
                    const price = livePrices[agentName];
                    if (!price) {
                        throw new Error(`Price not loaded for ${agentName}. Please refresh the page.`);
                    }
                    console.log(`Processing payment for ${agentName} (${price} ETH)...`);
                    const paymentResult = await queryAgentWithPayment(agentName, price);
                    if (!paymentResult.success) {
                        const errorMsg = paymentResult.error || 'Unknown error';
                        // Funny error messages
                        if (errorMsg.toLowerCase().includes('insufficient')) {
                            throw new Error(`💸 Oops! Your wallet is too poor for roasts. You need ${price} ETH but your account is basically a crypto beggar. Go touch grass and earn some Base coins! 😅`);
                        }
                        else if (errorMsg.toLowerCase().includes('network')) {
                            throw new Error('🌍 Wrong network, buddy! Are you even on Base Sepolia? Your roasts need to be L2!');
                        }
                        else {
                            throw new Error(`💥 Payment kaboom! ${errorMsg}`);
                        }
                    }
                    console.log(`Payment confirmed! TX: ${paymentResult.txHash}`);
                }
            }
            else if (!isConnected) {
                throw new Error('🔗 Connect your wallet first, genius!');
            }
            else if (!isCorrectNetwork) {
                throw new Error('🌍 Wrong network! Switch to Base Sepolia to get roasted!');
            }
            // Upload image to S3 for sharing
            console.log('Uploading image to S3...');
            const s3Url = await uploadImageToS3(imageBase64);
            setS3ImageUrl(s3Url);
            console.log(`Image uploaded to S3: ${s3Url}`);
            // Then, query the agent via XMTP with base64 for vision processing
            const query = agent
                ? `[REQUEST TO ${agent.toUpperCase()}] Please roast this image: ${s3Url}`
                : `Roast this image: ${s3Url}`;
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
            alert(`❌ ${errorMsg}`);
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
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { className: "banner", children: [_jsx("img", { src: "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/main/eth-ai-asa/agent-capabilities/roaster-banner.png", alt: "AI Roast Generator", className: "banner-image" }), _jsxs("div", { className: "banner-overlay", children: [_jsx("h1", { children: "AI Roast Generator" }), _jsx("p", { className: "animated-tagline", children: isAnimatedTagline ? "Let's see what you're working with 😅" : "Ready to get roasted? 🔥" })] })] }), _jsxs("div", { className: "header-controls", children: [_jsx("button", { className: "theme-toggle", onClick: toggleDarkMode, title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode', "aria-label": "Toggle dark mode", children: isDarkMode ? '☀️' : '🌙' }), _jsx(WalletConnect, {}), !isConnected && (_jsx("div", { className: "status-badge warning", children: "\u26A0 Not connected" })), isConnected && !isCorrectNetwork && (_jsx("div", { className: "status-badge warning", children: "\u26A0 Wrong network" })), isConnected && isCorrectNetwork && (_jsx("div", { className: "status-badge success", children: "\u2713 Connected" })), _jsx("div", { className: `health-indicator ${xmtpHealth?.status}`, title: xmtpHealth?.message })] })] }), _jsxs("main", { className: "main-content", children: [_jsxs("section", { className: "query-section", children: [_jsx(QueryBuilder, { onSubmit: handleImageUpload, isLoading: isLoading || paymentLoading, availableAgents: [
                                    { name: 'profile-roaster', description: 'Dating Profile Roast' },
                                    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
                                    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
                                ], agentAvatars: agentAvatars, agentPrices: livePrices }), xmtpError && _jsx("div", { className: "error-banner", children: xmtpError }), paymentError && _jsx("div", { className: "error-banner", children: paymentError })] }), uploadedImage && (_jsxs("section", { className: "image-preview-section", children: [_jsx("h2", { children: "Your Selfie" }), _jsx("img", { src: uploadedImage, alt: "Your selfie", className: "preview-image" })] })), _jsxs("section", { className: "results-section", children: [_jsx("h2", { children: "The Roasts \uD83D\uDD25" }), _jsx(ResultsDisplay, { results: results, s3ImageUrl: s3ImageUrl })] }), _jsxs("section", { className: "voting-section", children: [_jsx("h2", { children: "Rate the Roasts" }), _jsx("p", { children: "Vote on how funny each roast is (1-5 scale, 5 = HILARIOUS)" }), results.length === 0 ? (_jsx("p", { style: { color: 'var(--text-secondary)' }, children: "Upload a selfie to get roasted!" })) : (results.map((result, idx) => (_jsxs("div", { className: "vote-card", children: [_jsx("h4", { children: result.agent }), _jsx("div", { className: "vote-buttons", children: [1, 2, 3, 4, 5].map((score) => (_jsx("button", { onClick: () => handleVote(idx, score), className: `vote-btn ${votes[idx] === score ? 'active' : ''}`, children: score }, score))) }), _jsx("span", { className: "vote-value", children: votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote' })] }, idx))))] }), _jsxs("section", { className: "leaderboard-section", children: [_jsx("h2", { children: "Funniest Roasts" }), _jsx("p", { children: "Community's favorite roasts" }), _jsx(Leaderboard, { refreshTrigger: leaderboardRefresh })] })] }), _jsx(Confetti, { trigger: confettiTrigger })] }));
};
export const App = () => {
    const queryClient = new QueryClient();
    return (_jsx(WagmiProvider, { config: wagmiConfig, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(RainbowKitProvider, { children: _jsx(AppContent, {}) }) }) }));
};
//# sourceMappingURL=App.js.map