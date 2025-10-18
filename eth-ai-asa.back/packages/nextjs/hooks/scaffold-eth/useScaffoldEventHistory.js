"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScaffoldEventHistory = void 0;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const chains_1 = require("viem/chains");
const wagmi_1 = require("wagmi");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/hooks/scaffold-eth");
const common_1 = require("~~/utils/scaffold-eth/common");
const getEvents = async (getLogsParams, publicClient, Options) => {
    const logs = await publicClient?.getLogs({
        address: getLogsParams.address,
        fromBlock: getLogsParams.fromBlock,
        toBlock: getLogsParams.toBlock,
        args: getLogsParams.args,
        event: getLogsParams.event,
    });
    if (!logs)
        return undefined;
    const finalEvents = await Promise.all(logs.map(async (log) => {
        return {
            ...log,
            blockData: Options?.blockData && log.blockHash ? await publicClient?.getBlock({ blockHash: log.blockHash }) : null,
            transactionData: Options?.transactionData && log.transactionHash
                ? await publicClient?.getTransaction({ hash: log.transactionHash })
                : null,
            receiptData: Options?.receiptData && log.transactionHash
                ? await publicClient?.getTransactionReceipt({ hash: log.transactionHash })
                : null,
        };
    }));
    return finalEvents;
};
/**
 * @deprecated **Recommended only for local (hardhat/anvil) chains and development.**
 * It uses getLogs which can overload RPC endpoints (especially on L2s with short block times).
 * For production, use an indexer such as ponder.sh or similar to query contract events efficiently.
 *
 * Reads events from a deployed contract.
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - optional block number to start reading events from (defaults to `deployedOnBlock` in deployedContracts.ts if set for contract, otherwise defaults to 0)
 * @param config.toBlock - optional block number to stop reading events at (if not provided, reads until current block)
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - set this to false to disable the hook from running (default: true)
 * @param config.blocksBatchSize - optional batch size for fetching events. If specified, each batch will contain at most this many blocks (default: 500)
 */
const useScaffoldEventHistory = ({ contractName, eventName, fromBlock, toBlock, chainId, filters, blockData, transactionData, receiptData, watch, enabled = true, blocksBatchSize = 500, }) => {
    const selectedNetwork = (0, scaffold_eth_1.useSelectedNetwork)(chainId);
    // Runtime warning for non-local chains
    (0, react_1.useEffect)(() => {
        if (selectedNetwork.id !== chains_1.hardhat.id) {
            console.log("⚠️ useScaffoldEventHistory is not optimized for production use. It can overload RPC endpoints (especially on L2s)");
        }
    }, [selectedNetwork.id]);
    const publicClient = (0, wagmi_1.usePublicClient)({
        chainId: selectedNetwork.id,
    });
    const [liveEvents, setLiveEvents] = (0, react_1.useState)([]);
    const [lastFetchedBlock, setLastFetchedBlock] = (0, react_1.useState)(null);
    const [isPollingActive, setIsPollingActive] = (0, react_1.useState)(false);
    const { data: blockNumber } = (0, wagmi_1.useBlockNumber)({ watch: watch, chainId: selectedNetwork.id });
    const { data: deployedContractData } = (0, scaffold_eth_2.useDeployedContractInfo)({
        contractName,
        chainId: selectedNetwork.id,
    });
    const event = deployedContractData &&
        deployedContractData.abi.find(part => part.type === "event" && part.name === eventName);
    const isContractAddressAndClientReady = Boolean(deployedContractData?.address) && Boolean(publicClient);
    const fromBlockValue = fromBlock !== undefined
        ? fromBlock
        : BigInt(deployedContractData && "deployedOnBlock" in deployedContractData
            ? deployedContractData.deployedOnBlock || 0
            : 0);
    const query = (0, react_query_1.useInfiniteQuery)({
        queryKey: [
            "eventHistory",
            {
                contractName,
                address: deployedContractData?.address,
                eventName,
                fromBlock: fromBlockValue?.toString(),
                toBlock: toBlock?.toString(),
                chainId: selectedNetwork.id,
                filters: JSON.stringify(filters, common_1.replacer),
                blocksBatchSize: blocksBatchSize.toString(),
            },
        ],
        queryFn: async ({ pageParam }) => {
            if (!isContractAddressAndClientReady)
                return undefined;
            // Calculate the toBlock for this batch
            let batchToBlock = toBlock;
            const batchEndBlock = pageParam + BigInt(blocksBatchSize) - 1n;
            const maxBlock = toBlock || (blockNumber ? BigInt(blockNumber) : undefined);
            if (maxBlock) {
                batchToBlock = batchEndBlock < maxBlock ? batchEndBlock : maxBlock;
            }
            const data = await getEvents({
                address: deployedContractData?.address,
                event,
                fromBlock: pageParam,
                toBlock: batchToBlock,
                args: filters,
            }, publicClient, { blockData, transactionData, receiptData });
            setLastFetchedBlock(batchToBlock || blockNumber || 0n);
            return data;
        },
        enabled: enabled && isContractAddressAndClientReady && !isPollingActive, // Disable when polling starts
        initialPageParam: fromBlockValue,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (!blockNumber || fromBlockValue >= blockNumber)
                return undefined;
            const nextBlock = lastPageParam + BigInt(blocksBatchSize);
            // Don't go beyond the specified toBlock or current block
            const maxBlock = toBlock && toBlock < blockNumber ? toBlock : blockNumber;
            if (nextBlock > maxBlock)
                return undefined;
            return nextBlock;
        },
        select: data => {
            const events = data.pages.flat();
            return {
                pages: events?.reverse(),
                pageParams: data.pageParams,
            };
        },
    });
    // Check if we're caught up and should start polling
    const shouldStartPolling = () => {
        if (!watch || !blockNumber || isPollingActive)
            return false;
        return !query.hasNextPage && query.status === "success";
    };
    // Poll for new events when watch mode is enabled
    (0, react_query_1.useQuery)({
        queryKey: ["liveEvents", contractName, eventName, blockNumber?.toString(), lastFetchedBlock?.toString()],
        enabled: Boolean(watch && enabled && isContractAddressAndClientReady && blockNumber && (shouldStartPolling() || isPollingActive)),
        queryFn: async () => {
            if (!isContractAddressAndClientReady || !blockNumber)
                return null;
            if (!isPollingActive && shouldStartPolling()) {
                setIsPollingActive(true);
            }
            const maxBlock = toBlock && toBlock < blockNumber ? toBlock : blockNumber;
            const startBlock = lastFetchedBlock || maxBlock;
            // Only fetch if there are new blocks to check
            if (startBlock >= maxBlock)
                return null;
            const newEvents = await getEvents({
                address: deployedContractData?.address,
                event,
                fromBlock: startBlock + 1n,
                toBlock: maxBlock,
                args: filters,
            }, publicClient, { blockData, transactionData, receiptData });
            if (newEvents && newEvents.length > 0) {
                setLiveEvents(prev => [...newEvents, ...prev]);
            }
            setLastFetchedBlock(maxBlock);
            return newEvents;
        },
        refetchInterval: false,
    });
    // Manual trigger to fetch next page when previous page completes (only when not polling)
    (0, react_1.useEffect)(() => {
        if (!isPollingActive &&
            query.status === "success" &&
            query.hasNextPage &&
            !query.isFetchingNextPage &&
            !query.error) {
            query.fetchNextPage();
        }
    }, [query, isPollingActive]);
    // Combine historical data from infinite query with live events from watch hook
    const historicalEvents = query.data?.pages || [];
    const allEvents = [...liveEvents, ...historicalEvents];
    // remove duplicates
    const seenEvents = new Set();
    const combinedEvents = allEvents.filter(event => {
        const eventKey = `${event?.transactionHash}-${event?.logIndex}-${event?.blockHash}`;
        if (seenEvents.has(eventKey)) {
            return false;
        }
        seenEvents.add(eventKey);
        return true;
    });
    return {
        data: combinedEvents,
        status: query.status,
        error: query.error,
        isLoading: query.isLoading,
        isFetchingNewEvent: query.isFetchingNextPage,
        refetch: query.refetch,
    };
};
exports.useScaffoldEventHistory = useScaffoldEventHistory;
