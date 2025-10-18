"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScaffoldWatchContractEvent = void 0;
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/hooks/scaffold-eth");
/**
 * Wrapper around wagmi's useEventSubscriber hook which automatically loads (by name) the contract ABI and
 * address from the contracts present in deployedContracts.ts & externalContracts.ts
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 * @param config.onLogs - the callback that receives events.
 */
const useScaffoldWatchContractEvent = ({ contractName, eventName, chainId, onLogs, }) => {
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const { data: deployedContractData } = (0, scaffold_eth_2.useDeployedContractInfo)({
        contractName,
        chainId: selectedNetwork.id,
    });
    return (0, wagmi_1.useWatchContractEvent)({
        address: deployedContractData?.address,
        abi: deployedContractData?.abi,
        chainId: selectedNetwork.id,
        onLogs: (logs) => onLogs(logs),
        eventName,
    });
};
exports.useScaffoldWatchContractEvent = useScaffoldWatchContractEvent;
