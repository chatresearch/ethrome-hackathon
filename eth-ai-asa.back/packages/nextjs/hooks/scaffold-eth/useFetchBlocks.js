"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchBlocks = exports.testClient = void 0;
const react_1 = require("react");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const scaffold_eth_1 = require("~~/utils/scaffold-eth");
const BLOCKS_PER_PAGE = 20;
exports.testClient = (0, viem_1.createTestClient)({
    chain: chains_1.hardhat,
    mode: "hardhat",
    transport: (0, viem_1.webSocket)("ws://127.0.0.1:8545"),
})
    .extend(viem_1.publicActions)
    .extend(viem_1.walletActions);
const useFetchBlocks = () => {
    const [blocks, setBlocks] = (0, react_1.useState)([]);
    const [transactionReceipts, setTransactionReceipts] = (0, react_1.useState)({});
    const [currentPage, setCurrentPage] = (0, react_1.useState)(0);
    const [totalBlocks, setTotalBlocks] = (0, react_1.useState)(0n);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchBlocks = (0, react_1.useCallback)(async () => {
        setError(null);
        try {
            const blockNumber = await exports.testClient.getBlockNumber();
            setTotalBlocks(blockNumber);
            const startingBlock = blockNumber - BigInt(currentPage * BLOCKS_PER_PAGE);
            const blockNumbersToFetch = Array.from({ length: Number(BLOCKS_PER_PAGE < startingBlock + 1n ? BLOCKS_PER_PAGE : startingBlock + 1n) }, (_, i) => startingBlock - BigInt(i));
            const blocksWithTransactions = blockNumbersToFetch.map(async (blockNumber) => {
                try {
                    return exports.testClient.getBlock({ blockNumber, includeTransactions: true });
                }
                catch (err) {
                    setError(err instanceof Error ? err : new Error("An error occurred."));
                    throw err;
                }
            });
            const fetchedBlocks = await Promise.all(blocksWithTransactions);
            fetchedBlocks.forEach(block => {
                block.transactions.forEach(tx => (0, scaffold_eth_1.decodeTransactionData)(tx));
            });
            const txReceipts = await Promise.all(fetchedBlocks.flatMap(block => block.transactions.map(async (tx) => {
                try {
                    const receipt = await exports.testClient.getTransactionReceipt({ hash: tx.hash });
                    return { [tx.hash]: receipt };
                }
                catch (err) {
                    setError(err instanceof Error ? err : new Error("An error occurred."));
                    throw err;
                }
            })));
            setBlocks(fetchedBlocks);
            setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...txReceipts) }));
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error("An error occurred."));
        }
    }, [currentPage]);
    (0, react_1.useEffect)(() => {
        fetchBlocks();
    }, [fetchBlocks]);
    (0, react_1.useEffect)(() => {
        const handleNewBlock = async (newBlock) => {
            try {
                if (currentPage === 0) {
                    if (newBlock.transactions.length > 0) {
                        const transactionsDetails = await Promise.all(newBlock.transactions.map((txHash) => exports.testClient.getTransaction({ hash: txHash })));
                        newBlock.transactions = transactionsDetails;
                    }
                    newBlock.transactions.forEach((tx) => (0, scaffold_eth_1.decodeTransactionData)(tx));
                    const receipts = await Promise.all(newBlock.transactions.map(async (tx) => {
                        try {
                            const receipt = await exports.testClient.getTransactionReceipt({ hash: tx.hash });
                            return { [tx.hash]: receipt };
                        }
                        catch (err) {
                            setError(err instanceof Error ? err : new Error("An error occurred fetching receipt."));
                            throw err;
                        }
                    }));
                    setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, BLOCKS_PER_PAGE - 1)]);
                    setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...receipts) }));
                }
                if (newBlock.number) {
                    setTotalBlocks(newBlock.number);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error("An error occurred."));
            }
        };
        return exports.testClient.watchBlocks({ onBlock: handleNewBlock, includeTransactions: true });
    }, [currentPage]);
    return {
        blocks,
        transactionReceipts,
        currentPage,
        totalBlocks,
        setCurrentPage,
        error,
    };
};
exports.useFetchBlocks = useFetchBlocks;
