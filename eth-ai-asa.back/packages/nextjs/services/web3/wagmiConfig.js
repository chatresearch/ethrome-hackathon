"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.wagmiConfig = exports.enabledChains = void 0;
const wagmiConnectors_1 = require("./wagmiConnectors");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const wagmi_1 = require("wagmi");
const scaffold_config_1 = __importStar(require("~~/scaffold.config"));
const scaffold_eth_1 = require("~~/utils/scaffold-eth");
const { targetNetworks } = scaffold_config_1.default;
// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
exports.enabledChains = targetNetworks.find((network) => network.id === 1)
    ? targetNetworks
    : [...targetNetworks, chains_1.mainnet];
exports.wagmiConfig = (0, wagmi_1.createConfig)({
    chains: exports.enabledChains,
    connectors: (0, wagmiConnectors_1.wagmiConnectors)(),
    ssr: true,
    client: ({ chain }) => {
        let rpcFallbacks = [(0, viem_1.http)()];
        const rpcOverrideUrl = scaffold_config_1.default.rpcOverrides?.[chain.id];
        if (rpcOverrideUrl) {
            rpcFallbacks = [(0, viem_1.http)(rpcOverrideUrl), (0, viem_1.http)()];
        }
        else {
            const alchemyHttpUrl = (0, scaffold_eth_1.getAlchemyHttpUrl)(chain.id);
            if (alchemyHttpUrl) {
                const isUsingDefaultKey = scaffold_config_1.default.alchemyApiKey === scaffold_config_1.DEFAULT_ALCHEMY_API_KEY;
                rpcFallbacks = isUsingDefaultKey ? [(0, viem_1.http)(), (0, viem_1.http)(alchemyHttpUrl)] : [(0, viem_1.http)(alchemyHttpUrl), (0, viem_1.http)()];
            }
        }
        return (0, viem_1.createClient)({
            chain,
            transport: (0, viem_1.fallback)(rpcFallbacks),
            ...(chain.id !== chains_1.hardhat.id ? { pollingInterval: scaffold_config_1.default.pollingInterval } : {}),
        });
    },
});
