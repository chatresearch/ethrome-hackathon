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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wagmiConnectors = void 0;
const rainbowkit_1 = require("@rainbow-me/rainbowkit");
const wallets_1 = require("@rainbow-me/rainbowkit/wallets");
const burner_connector_1 = require("burner-connector");
const chains = __importStar(require("viem/chains"));
const scaffold_config_1 = __importDefault(require("~~/scaffold.config"));
const { onlyLocalBurnerWallet, targetNetworks } = scaffold_config_1.default;
const wallets = [
    wallets_1.metaMaskWallet,
    wallets_1.walletConnectWallet,
    wallets_1.ledgerWallet,
    wallets_1.coinbaseWallet,
    wallets_1.rainbowWallet,
    wallets_1.safeWallet,
    ...(!targetNetworks.some(network => network.id !== chains.hardhat.id) || !onlyLocalBurnerWallet
        ? [burner_connector_1.rainbowkitBurnerWallet]
        : []),
];
/**
 * wagmi connectors for the wagmi context
 */
const wagmiConnectors = () => {
    // Only create connectors on client-side to avoid SSR issues
    // TODO: update when https://github.com/rainbow-me/rainbowkit/issues/2476 is resolved
    if (typeof window === "undefined") {
        return [];
    }
    return (0, rainbowkit_1.connectorsForWallets)([
        {
            groupName: "Supported Wallets",
            wallets,
        },
    ], {
        appName: "scaffold-eth-2",
        projectId: scaffold_config_1.default.walletConnectProjectId,
    });
};
exports.wagmiConnectors = wagmiConnectors;
