"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeployedContractInfo = useDeployedContractInfo;
const react_1 = require("react");
const usehooks_ts_1 = require("usehooks-ts");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const contract_1 = require("~~/utils/scaffold-eth/contract");
function useDeployedContractInfo(configOrName) {
    const isMounted = (0, usehooks_ts_1.useIsMounted)();
    const finalConfig = typeof configOrName === "string" ? { contractName: configOrName } : configOrName;
    (0, react_1.useEffect)(() => {
        if (typeof configOrName === "string") {
            console.warn("Using `useDeployedContractInfo` with a string parameter is deprecated. Please use the object parameter version instead.");
        }
    }, [configOrName]);
    const { contractName, chainId } = finalConfig;
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const deployedContract = contract_1.contracts?.[selectedNetwork.id]?.[contractName];
    const [status, setStatus] = (0, react_1.useState)(contract_1.ContractCodeStatus.LOADING);
    const publicClient = (0, wagmi_1.usePublicClient)({ chainId: selectedNetwork.id });
    (0, react_1.useEffect)(() => {
        const checkContractDeployment = async () => {
            try {
                if (!isMounted() || !publicClient)
                    return;
                if (!deployedContract) {
                    setStatus(contract_1.ContractCodeStatus.NOT_FOUND);
                    return;
                }
                const code = await publicClient.getBytecode({
                    address: deployedContract.address,
                });
                // If contract code is `0x` => no contract deployed on that address
                if (code === "0x") {
                    setStatus(contract_1.ContractCodeStatus.NOT_FOUND);
                    return;
                }
                setStatus(contract_1.ContractCodeStatus.DEPLOYED);
            }
            catch (e) {
                console.error(e);
                setStatus(contract_1.ContractCodeStatus.NOT_FOUND);
            }
        };
        checkContractDeployment();
    }, [isMounted, contractName, deployedContract, publicClient]);
    return {
        data: status === contract_1.ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
        isLoading: status === contract_1.ContractCodeStatus.LOADING,
    };
}
