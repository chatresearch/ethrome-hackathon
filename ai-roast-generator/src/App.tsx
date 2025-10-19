import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryBuilder } from './components/QueryBuilder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Leaderboard } from './components/Leaderboard';
import { WalletConnect } from './components/WalletConnect';
import { LoadingDialog } from './components/LoadingDialog';
import { useXMTP } from './hooks/useXMTP';
import { useAgentPayment, fetchAgentPrice, fetchAgentAvatar } from './hooks/useAgentPayment';
import { useS3Upload } from './hooks/useS3Upload';
import { wagmiConfig } from './hooks/wagmiConfig';
import { recordVote } from './lib/scoring';
import './styles/App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { useHealthCheck } from './hooks/useHealthCheck';
import { Confetti } from './components/Confetti';

// Extend window type to include __xmtpError
declare global {
  interface Window {
    __xmtpError?: string;
  }
}

interface AgentResponse {
  agent: string;
  capabilities: string[];
  response: string;
  timestamp: number;
}

const getCurrentUserId = () => {
  let userId = localStorage.getItem('roast-generator-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('roast-generator-user-id', userId);
  }
  return userId;
};

// Check environment variables and backend connectivity on preload
async function checkBackendConnectivity() {
  // @ts-ignore
  const viteReactAppUrl = import.meta.env.VITE_REACT_APP_XMTP_API;
  // @ts-ignore
  const viteUrl = import.meta.env.VITE_XMTP_API;
  const reactAppUrl = typeof process !== 'undefined' ? process.env.REACT_APP_XMTP_API : undefined;
  
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const localBackendUrl = 'http://127.0.0.1:3003';
  
  const urlsToCheck = [
    { name: 'VITE_REACT_APP_XMTP_API', url: viteReactAppUrl },
    { name: 'VITE_XMTP_API', url: viteUrl },
    { name: 'REACT_APP_XMTP_API', url: reactAppUrl },
    { name: 'Local Backend', url: isProduction ? undefined : localBackendUrl },
  ];
  
  console.log('[Preload] Checking backend connectivity...');
  
  let hasHealthyBackend = false;
  
  for (const { name, url } of urlsToCheck) {
    if (!url) {
      console.log(`[Preload] ${name}: not configured`);
      continue;
    }
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${url}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      
      if (!healthResponse.ok) {
        console.warn(`[Preload] ⚠️ ${name}: ${url} returned ${healthResponse.status} on /api/health`);
        continue;
      }
      
      // Test message endpoint with a dummy request
      const testResponse = await fetch(`${url}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
        signal: AbortSignal.timeout(3000),
      });
      
      if (testResponse.ok || testResponse.status === 400 || testResponse.status === 422) {
        // 400/422 is OK - it means the endpoint exists but rejected the test data
        console.log(`[Preload] ✅ ${name}: ${url} is fully operational`);
        hasHealthyBackend = true;
        break;
      } else if (testResponse.status === 500) {
        console.warn(`[Preload] ❌ ${name}: ${url} returned 500 on /api/message - server error`);
      } else {
        console.warn(`[Preload] ⚠️ ${name}: ${url} returned ${testResponse.status} on /api/message`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[Preload] ❌ ${name}: ${url} - ${msg}`);
    }
  }
  
  if (!hasHealthyBackend) {
    const errorMsg = `❌ XMTP Backend Unavailable\n\nNo working backend found. Checked:\n${urlsToCheck.map(u => `  - ${u.name}: ${u.url || 'not configured'}`).join('\n')}\n\nPlease ensure:\n1. XMTP agent is running on port 3003\n2. ngrok tunnel is active\n3. Environment variables are set on Vercel`;
    console.error('[Preload]', errorMsg);
    // Show banner alert to user
    if (typeof window !== 'undefined') {
      window.__xmtpError = errorMsg;
    }
  }
}

// Run preload check when app starts
if (typeof window !== 'undefined') {
  window.addEventListener('load', checkBackendConnectivity);
  // Also run immediately
  checkBackendConnectivity().catch(console.error);
}

const AppContent: React.FC = () => {
  const { sendMessage, error: xmtpError } = useXMTP();
  const { queryAgentWithPayment, loading: paymentLoading, error: paymentError, isConnected, isCorrectNetwork } = useAgentPayment();
  const { uploadImageToS3 } = useS3Upload();
  const xmtpHealth = useHealthCheck();
  const [results, setResults] = useState<AgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [s3ImageUrl, setS3ImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [preloadError, setPreloadError] = useState<string | null>(null);
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
  const [isAnimatedTagline, setIsAnimatedTagline] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [livePrices, setLivePrices] = useState<Record<string, string>>({});
  const [agentAvatars, setAgentAvatars] = useState<Record<string, string>>({});
  const userId = getCurrentUserId();

  // Fetch live agent prices and avatars on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const agents = ['profile-roaster', 'linkedin-roaster', 'vibe-roaster', 'defi-wizard', 'security-guru'];
        
        // Fetch prices
        const prices: Record<string, string> = {};
        for (const agent of agents) {
          const agentFqn = `${agent}.aiconfig.eth`;
          try {
            const price = await fetchAgentPrice(agentFqn);
            prices[agent] = price;
          } catch (error) {
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
          } catch (error) {
            console.warn(`[Avatar] Failed to fetch for ${agent}:`, error instanceof Error ? error.message : String(error));
            return { agent, avatar: null };
          }
        });

        // Set avatars as they complete
        const results = await Promise.all(avatarPromises);
        const avatars: Record<string, string> = {};
        results.forEach(({ agent, avatar }) => {
          if (avatar) {
            avatars[agent] = avatar;
            setAgentAvatars((prev) => ({ ...prev, [agent]: avatar }));
          }
        });
        console.log('Agent avatars fetched:', avatars);

      } catch (error) {
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
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('roast-generator-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    setLeaderboardRefresh(0);
  }, []);

  // Check for preload errors
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__xmtpError) {
      setPreloadError((window as any).__xmtpError);
    }
  }, []);

  const handleImageUpload = async (imageBase64: string, agent?: string) => {
    setUploadedImage(imageBase64);
    setS3ImageUrl(null);
    setIsLoading(true);
    // Don't show loading dialog yet - wait for payment confirmation
    
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
            } else if (errorMsg.toLowerCase().includes('network')) {
              throw new Error('🌍 Wrong network, buddy! Are you even on Base Sepolia? Your roasts need to be L2!');
            } else {
              throw new Error(`💥 Payment kaboom! ${errorMsg}`);
            }
          }
          
          console.log(`Payment confirmed! TX: ${paymentResult.txHash}`);
        }
      } else if (!isConnected) {
        throw new Error('🔗 Connect your wallet first, genius!');
      } else if (!isCorrectNetwork) {
        throw new Error('🌍 Wrong network! Switch to Base Sepolia to get roasted!');
      }

      // ✅ Payment confirmed! Now show loading dialog
      setIsImageProcessing(true);

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
        const newResults = response.agents.map((agentResponse: any) => ({
          agent: agentResponse.name,
          capabilities: agentResponse.capabilities || [],
          response: agentResponse.response,
          timestamp: Date.now(),
        }));
        setResults((prev) => [...prev, ...newResults]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Error:', errorMsg);
      alert(`❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
      setIsImageProcessing(false);
    }
  };

  const handleVote = (resultIdx: number, accuracy: number) => {
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

  return (
    <div className="app">
      <header className="header">
        <div className="banner">
          <img 
            src="https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/main/eth-ai-asa/agent-capabilities/roaster-banner.png"
            alt="AI Roast Generator"
            className="banner-image"
          />
          <div className="banner-overlay">
            <h1>AI Roast Generator</h1>
            <p className="animated-tagline">
              {isAnimatedTagline ? "Let's see what you're working with 😅" : "Ready to get roasted? 🔥"}
            </p>
          </div>
        </div>
        <div className="header-controls">
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <WalletConnect />
          {!isConnected && (
            <div className="status-badge warning">⚠ Not connected</div>
          )}
          {isConnected && !isCorrectNetwork && (
            <div className="status-badge warning">⚠ Wrong network</div>
          )}
          {isConnected && isCorrectNetwork && (
            <div className="status-badge success">✓ Connected</div>
          )}
          <div 
            className={`health-indicator ${xmtpHealth?.status}`}
            title={xmtpHealth?.message}
          />
        </div>
      </header>

      <main className="main-content">
        <section className="query-section">
          <QueryBuilder 
            onSubmit={handleImageUpload} 
            isLoading={isLoading || paymentLoading}
            availableAgents={[
              { name: 'profile-roaster', description: 'Dating Profile Roast' },
              { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
              { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
            ]}
            agentAvatars={agentAvatars}
            agentPrices={livePrices}
          />
          {xmtpError && <div className="error-banner">{xmtpError}</div>}
          {paymentError && <div className="error-banner">{paymentError}</div>}
          {preloadError && <div className="error-banner">{preloadError}</div>}
        </section>

        {uploadedImage && (
          <section className="image-preview-section">
            <h2>Your Selfie</h2>
            <img src={uploadedImage} alt="Your selfie" className="preview-image" />
          </section>
        )}

        <section className="results-section">
          <h2>The Roasts 🔥</h2>
          <ResultsDisplay results={results} s3ImageUrl={s3ImageUrl} />
        </section>

        <section className="voting-section">
          <h2>Rate the Roasts</h2>
          <p>Vote on how funny each roast is (1-5 scale, 5 = HILARIOUS)</p>
          {results.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Upload a selfie to get roasted!</p>
          ) : (
            results.map((result, idx) => (
              <div key={idx} className="vote-card">
                <h4>{result.agent}</h4>
                <div className="vote-buttons">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleVote(idx, score)}
                      className={`vote-btn ${votes[idx] === score ? 'active' : ''}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <span className="vote-value">{votes[idx] ? `Voted: ${votes[idx]}/5` : 'No vote'}</span>
              </div>
            ))
          )}
        </section>

        <section className="leaderboard-section">
          <h2>Funniest Roasts</h2>
          <p>Community's favorite roasts</p>
          <Leaderboard refreshTrigger={leaderboardRefresh} />
        </section>
      </main>
      <LoadingDialog 
        isOpen={isImageProcessing}
        message={isImageProcessing ? "Processing your roast..." : "Processing your roast..."}
        isImageProcessing={isImageProcessing}
      />
      <Confetti trigger={confettiTrigger} />
    </div>
  );
};

export const App: React.FC = () => {
  const queryClient = new QueryClient();
  
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
