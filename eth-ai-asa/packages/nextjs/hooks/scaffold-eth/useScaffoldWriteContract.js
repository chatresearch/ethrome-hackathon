"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScaffoldWriteContract = useScaffoldWriteContract;
const react_1 = require("react");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/hooks/scaffold-eth");
const scaffold_eth_3 = require("~~/utils/scaffold-eth");
const contract_1 = require("~~/utils/scaffold-eth/contract");
/**
 * Wrapper around wagmi's useWriteContract hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param contractName - name of the contract to be written to
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 * @param writeContractParams - wagmi's useWriteContract parameters
 */
function useScaffoldWriteContract(configOrName, writeContractParams) {
    const finalConfig = typeof configOrName === "string"
        ? { contractName: configOrName, writeContractParams, chainId: undefined }
        : configOrName;
    const { contractName, chainId, writeContractParams: finalWriteContractParams } = finalConfig;
    const wagmiConfig = (0, wagmi_1.useConfig)();
    (0, react_1.useEffect)(() => {
        if (typeof configOrName === "string") {
            console.warn("Using `useScaffoldWriteContract` with a string parameter is deprecated. Please use the object parameter version instead.");
        }
    }, [configOrName]);
    const { chain: accountChain } = (0, wagmi_1.useAccount)();
    const writeTx = (0, scaffold_eth_2.useTransactor)();
    const [isMining, setIsMining] = (0, react_1.useState)(false);
    const wagmiContractWrite = (0, wagmi_1.useWriteContract)(finalWriteContractParams);
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const { data: deployedContractData } = (0, scaffold_eth_2.useDeployedContractInfo)({
        contractName,
        chainId: selectedNetwork.id,
    });
    const sendContractWriteAsyncTx = async (variables, options) => {
        if (!deployedContractData) {
            scaffold_eth_3.notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
            return;
        }
        if (!accountChain?.id) {
            scaffold_eth_3.notification.error("Please connect your wallet");
            return;
        }
        if (accountChain?.id !== selectedNetwork.id) {
            scaffold_eth_3.notification.error(`Wallet is connected to the wrong network. Please switch to ${selectedNetwork.name}`);
            return;
        }
        try {
            setIsMining(true);
            const { blockConfirmations, onBlockConfirmation, ...mutateOptions } = options || {};
            const writeContractObject = {
                abi: deployedContractData.abi,
                address: deployedContractData.address,
                ...variables,
            };
            if (!finalConfig?.disableSimulate) {
                await (0, contract_1.simulateContractWriteAndNotifyError)({
                    wagmiConfig,
                    writeContractParams: writeContractObject,
                    chainId: selectedNetwork.id,
                });
            }
            const makeWriteWithParams = () => wagmiContractWrite.writeContractAsync(writeContractObject, mutateOptions);
            const writeTxResult = await writeTx(makeWriteWithParams, { blockConfirmations, onBlockConfirmation });
            return writeTxResult;
        }
        catch (e) {
            throw e;
        }
        finally {
            setIsMining(false);
        }
    };
    const sendContractWriteTx = (variables, options) => {
        if (!deployedContractData) {
            scaffold_eth_3.notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
            return;
        }
        if (!accountChain?.id) {
            scaffold_eth_3.notification.error("Please connect your wallet");
            return;
        }
        if (accountChain?.id !== selectedNetwork.id) {
            scaffold_eth_3.notification.error(`Wallet is connected to the wrong network. Please switch to ${selectedNetwork.name}`);
            return;
        }
        wagmiContractWrite.writeContract({
            abi: deployedContractData.abi,
            address: deployedContractData.address,
            ...variables,
        }, options);
    };
    return {
        ...wagmiContractWrite,
        isMining,
        // Overwrite wagmi's writeContactAsync
        writeContractAsync: sendContractWriteAsyncTx,
        // Overwrite wagmi's writeContract
        writeContract: sendContractWriteTx,
    };
}
