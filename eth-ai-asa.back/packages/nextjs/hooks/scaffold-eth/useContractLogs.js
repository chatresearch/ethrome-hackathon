"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContractLogs = void 0;
const react_1 = require("react");
const useTargetNetwork_1 = require("./useTargetNetwork");
const wagmi_1 = require("wagmi");
const useContractLogs = (address) => {
    const [logs, setLogs] = (0, react_1.useState)([]);
    const { targetNetwork } = (0, useTargetNetwork_1.useTargetNetwork)();
    const client = (0, wagmi_1.usePublicClient)({ chainId: targetNetwork.id });
    (0, react_1.useEffect)(() => {
        const fetchLogs = async () => {
            if (!client)
                return console.error("Client not found");
            try {
                const existingLogs = await client.getLogs({
                    address: address,
                    fromBlock: 0n,
                    toBlock: "latest",
                });
                setLogs(existingLogs);
            }
            catch (error) {
                console.error("Failed to fetch logs:", error);
            }
        };
        fetchLogs();
        return client?.watchBlockNumber({
            onBlockNumber: async (_blockNumber, prevBlockNumber) => {
                const newLogs = await client.getLogs({
                    address: address,
                    fromBlock: prevBlockNumber,
                    toBlock: "latest",
                });
                setLogs(prevLogs => [...prevLogs, ...newLogs]);
            },
        });
    }, [address, client]);
    return logs;
};
exports.useContractLogs = useContractLogs;
