const ROOT_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // These will be filled in after signing at https://base.dev/account-association
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'AI Roast Generator',
    subtitle: 'Get roasted by GPT-4o on Base',
    description: 'Upload a photo and let AI roast your vibe. Vote on-chain and share to Twitter/Farcaster.',
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/banner.png`,
    splashBackgroundColor: '#1a1a1a',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'entertainment',
    tags: ['ai', 'gaming', 'web3', 'social'],
    heroImageUrl: `${ROOT_URL}/banner.png`,
    tagline: 'Brutally hilarious AI roasts powered by GPT-4o',
    ogTitle: 'AI Roast Generator - Get Roasted on Base',
    ogDescription: 'Upload a photo and get an AI-powered roast. Vote on-chain and share to social media.',
    ogImageUrl: `${ROOT_URL}/banner.png`,
  },
} as const;
