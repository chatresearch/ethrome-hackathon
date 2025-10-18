"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectedNetwork = useSelectedNetwork;
const scaffold_config_1 = __importDefault(require("~~/scaffold.config"));
const store_1 = require("~~/services/store/store");
const networks_1 = require("~~/utils/scaffold-eth/networks");
/**
 * Given a chainId, retrives the network object from `scaffold.config`,
 * if not found default to network set by `useTargetNetwork` hook
 */
function useSelectedNetwork(chainId) {
    const globalTargetNetwork = (0, store_1.useGlobalState)(({ targetNetwork }) => targetNetwork);
    const targetNetwork = scaffold_config_1.default.targetNetworks.find(targetNetwork => targetNetwork.id === chainId);
    if (targetNetwork) {
        return { ...targetNetwork, ...networks_1.NETWORKS_EXTRA_DATA[targetNetwork.id] };
    }
    return globalTargetNetwork;
}
