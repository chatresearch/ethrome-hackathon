import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
export const wagmiConfig = createConfig({
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(),
    },
});
//# sourceMappingURL=wagmiConfig.js.map