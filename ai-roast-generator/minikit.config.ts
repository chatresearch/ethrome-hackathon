const ROOT_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const BANNER_URL = 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/main/eth-ai-asa/agent-capabilities/roaster-banner.png';

export const minikitConfig = {
  accountAssociation: {
    header: 'eyJmaWQiOjEzNzIyOTksInR5cGUiOiJhdXRoIiwia2V5IjoiMHhBMzk3OUQ4QzE2YmJhOTJDY0ZmNUY5YzVmNzc5OUFBNjdjNTdjRWNlIn0',
    payload: 'eyJkb21haW4iOiJhaS1yb2FzdC1nZW5lcmF0b3ItaXZvcnkudmVyY2VsLmFwcCJ9',
    signature: 'M+4kPHzyr7H9MdrzkMJS1AeiL7oENrwIGuFyiiy4JjsemuhJcswJxVgrrRrqsXvgPtKzzO2IYWoEzhhEA3aUjBw=',
  },
  name: 'AI Roast Generator',
  subtitle: 'Get roasted by GPT-4o on Base',
  description: 'Upload a photo and let AI roast your vibe. Vote on-chain and share to Twitter/Farcaster.',
  imageUrl: BANNER_URL,
  iconUrl: `${ROOT_URL}/icon.png`,
  splashImageUrl: BANNER_URL,
  splashBackgroundColor: '#1a1a1a',
  homeUrl: ROOT_URL,
  webhookUrl: `${ROOT_URL}/api/webhook`,
  primaryCategory: 'entertainment',
  tags: ['ai', 'gaming', 'web3', 'social'],
  heroImageUrl: BANNER_URL,
  tagline: 'Brutally hilarious AI roasts powered by GPT-4o',
  ogTitle: 'AI Roast Generator - Get Roasted on Base',
  ogDescription: 'Upload a photo and get an AI-powered roast. Vote on-chain and share to social media.',
  ogImageUrl: BANNER_URL,
  version: '1',
} as const;
