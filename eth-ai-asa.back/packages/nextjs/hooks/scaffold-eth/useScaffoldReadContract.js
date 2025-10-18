"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScaffoldReadContract = void 0;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/hooks/scaffold-eth");
/**
 * Wrapper around wagmi's useContractRead hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 */
const useScaffoldReadContract = ({ contractName, functionName, args, chainId, ...readConfig }) => {
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    const { data: deployedContract } = (0, scaffold_eth_2.useDeployedContractInfo)({
        contractName,
        chainId: selectedNetwork.id,
    });
    const { query: queryOptions, watch, ...readContractConfig } = readConfig;
    // set watch to true by default
    const defaultWatch = watch ?? true;
    const readContractHookRes = (0, wagmi_1.useReadContract)({
        chainId: selectedNetwork.id,
        functionName,
        address: deployedContract?.address,
        abi: deployedContract?.abi,
        args,
        ...readContractConfig,
        query: {
            enabled: !Array.isArray(args) || !args.some(arg => arg === undefined),
            ...queryOptions,
        },
    });
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: blockNumber } = (0, wagmi_1.useBlockNumber)({
        watch: defaultWatch,
        chainId: selectedNetwork.id,
        query: {
            enabled: defaultWatch,
        },
    });
    (0, react_1.useEffect)(() => {
        if (defaultWatch) {
            queryClient.invalidateQueries({ queryKey: readContractHookRes.queryKey });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockNumber]);
    return readContractHookRes;
};
exports.useScaffoldReadContract = useScaffoldReadContract;
