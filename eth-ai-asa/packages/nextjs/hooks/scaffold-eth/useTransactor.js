"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactor = void 0;
const wagmi_1 = require("wagmi");
const actions_1 = require("wagmi/actions");
const scaffold_config_1 = __importDefault(require("~~/scaffold.config"));
const wagmiConfig_1 = require("~~/services/web3/wagmiConfig");
const scaffold_eth_1 = require("~~/utils/scaffold-eth");
const contract_1 = require("~~/utils/scaffold-eth/contract");
/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({ message, blockExplorerLink }) => {
    return (<div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
      {blockExplorerLink && blockExplorerLink.length > 0 ? (<a href={blockExplorerLink} target="_blank" rel="noreferrer" className="block link">
          check out transaction
        </a>) : null}
    </div>);
};
/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
const useTransactor = (_walletClient) => {
    let walletClient = _walletClient;
    const { data } = (0, wagmi_1.useWalletClient)();
    if (walletClient === undefined && data) {
        walletClient = data;
    }
    const result = async (tx, options) => {
        if (!walletClient) {
            scaffold_eth_1.notification.error("Cannot access account");
            console.error("⚡️ ~ file: useTransactor.tsx ~ error");
            return;
        }
        let notificationId = null;
        let transactionHash = undefined;
        let transactionReceipt;
        let blockExplorerTxURL = "";
        let chainId = scaffold_config_1.default.targetNetworks[0].id;
        try {
            chainId = await walletClient.getChainId();
            // Get full transaction from public client
            const publicClient = (0, actions_1.getPublicClient)(wagmiConfig_1.wagmiConfig);
            notificationId = scaffold_eth_1.notification.loading(<TxnNotification message="Awaiting for user confirmation"/>);
            if (typeof tx === "function") {
                // Tx is already prepared by the caller
                const result = await tx();
                transactionHash = result;
            }
            else if (tx != null) {
                transactionHash = await walletClient.sendTransaction(tx);
            }
            else {
                throw new Error("Incorrect transaction passed to transactor");
            }
            scaffold_eth_1.notification.remove(notificationId);
            blockExplorerTxURL = chainId ? (0, scaffold_eth_1.getBlockExplorerTxLink)(chainId, transactionHash) : "";
            notificationId = scaffold_eth_1.notification.loading(<TxnNotification message="Waiting for transaction to complete." blockExplorerLink={blockExplorerTxURL}/>);
            transactionReceipt = await publicClient.waitForTransactionReceipt({
                hash: transactionHash,
                confirmations: options?.blockConfirmations,
            });
            scaffold_eth_1.notification.remove(notificationId);
            if (transactionReceipt.status === "reverted")
                throw new Error("Transaction reverted");
            scaffold_eth_1.notification.success(<TxnNotification message="Transaction completed successfully!" blockExplorerLink={blockExplorerTxURL}/>, {
                icon: "🎉",
            });
            if (options?.onBlockConfirmation)
                options.onBlockConfirmation(transactionReceipt);
        }
        catch (error) {
            if (notificationId) {
                scaffold_eth_1.notification.remove(notificationId);
            }
            console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
            const message = (0, contract_1.getParsedErrorWithAllAbis)(error, chainId);
            // if receipt was reverted, show notification with block explorer link and return error
            if (transactionReceipt?.status === "reverted") {
                scaffold_eth_1.notification.error(<TxnNotification message={message} blockExplorerLink={blockExplorerTxURL}/>);
                throw error;
            }
            scaffold_eth_1.notification.error(message);
            throw error;
        }
        return transactionHash;
    };
    return result;
};
exports.useTransactor = useTransactor;
