"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScaffoldContract = void 0;
const viem_1 = require("viem");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/hooks/scaffold-eth");
/**
 * Gets a viem instance of the contract present in deployedContracts.ts or externalContracts.ts corresponding to
 * targetNetworks configured in scaffold.config.ts. Optional walletClient can be passed for doing write transactions.
 * @param config - The config settings for the hook
 * @param config.contractName - deployed contract name
 * @param config.walletClient - optional walletClient from wagmi useWalletClient hook can be passed for doing write transactions
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 */
const useScaffoldContract = ({ contractName, walletClient, chainId, }) => {
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const { data: deployedContractData, isLoading: deployedContractLoading } = (0, scaffold_eth_2.useDeployedContractInfo)({
        contractName,
        chainId: selectedNetwork?.id,
    });
    const publicClient = (0, wagmi_1.usePublicClient)({ chainId: selectedNetwork?.id });
    let contract = undefined;
    if (deployedContractData && publicClient) {
        contract = (0, viem_1.getContract)({
            address: deployedContractData.address,
            abi: deployedContractData.abi,
            client: {
                public: publicClient,
                wallet: walletClient ? walletClient : undefined,
            },
        });
    }
    return {
        data: contract,
        isLoading: deployedContractLoading,
    };
};
exports.useScaffoldContract = useScaffoldContract;
