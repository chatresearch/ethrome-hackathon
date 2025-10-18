"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWatchBalance = void 0;
const react_1 = require("react");
const useTargetNetwork_1 = require("./useTargetNetwork");
const react_query_1 = require("@tanstack/react-query");
const wagmi_1 = require("wagmi");
/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
const useWatchBalance = (useBalanceParameters) => {
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: blockNumber } = (0, wagmi_1.useBlockNumber)({ watch: true, chainId: targetNetwork.id });
    const { queryKey, ...restUseBalanceReturn } = (0, wagmi_1.useBalance)(useBalanceParameters);
    (0, react_1.useEffect)(() => {
        queryClient.invalidateQueries({ queryKey });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockNumber]);
    return restUseBalanceReturn;
};
exports.useWatchBalance = useWatchBalance;
