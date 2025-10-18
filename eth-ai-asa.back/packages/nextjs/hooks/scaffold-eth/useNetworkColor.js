"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetworkColor = exports.DEFAULT_NETWORK_COLOR = void 0;
exports.getNetworkColor = getNetworkColor;
const next_themes_1 = require("next-themes");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
exports.DEFAULT_NETWORK_COLOR = ["#666666", "#bbbbbb"];
function getNetworkColor(network, isDarkMode) {
    const colorConfig = network.color ?? exports.DEFAULT_NETWORK_COLOR;
    return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}
/**
 * Gets the color of the target network
 */
const useNetworkColor = (chainId) => {
    const { resolvedTheme } = (0, next_themes_1.useTheme)();
    const chain = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const isDarkMode = resolvedTheme === "dark";
    return getNetworkColor(chain, isDarkMode);
};
exports.useNetworkColor = useNetworkColor;
