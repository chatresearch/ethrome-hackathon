import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'viem/chains';
export const wagmiConfig = getDefaultConfig({
    appName: 'AI Roast Generator',
    projectId: 'dff08f6bdde3d811e21e991e0bca1d67',
    chains: [baseSepolia],
    ssr: false,
});
//# sourceMappingURL=wagmiConfig.js.map