"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetButton = void 0;
const react_1 = require("react");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const wagmi_1 = require("wagmi");
const outline_1 = require("@heroicons/react/24/outline");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const useWatchBalance_1 = require("~~/hooks/scaffold-eth/useWatchBalance");
// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const localWalletClient = (0, viem_1.createWalletClient)({
    chain: chains_1.hardhat,
    transport: (0, viem_1.http)(),
});
/**
 * FaucetButton button which lets you grab eth.
 */
const FaucetButton = () => {
    const { address, chain: ConnectedChain } = (0, wagmi_1.useAccount)();
    const { data: balance } = (0, useWatchBalance_1.useWatchBalance)({ address });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const faucetTxn = (0, scaffold_eth_1.useTransactor)(localWalletClient);
    const sendETH = async () => {
        if (!address)
            return;
        try {
            setLoading(true);
            await faucetTxn({
                account: FAUCET_ADDRESS,
                to: address,
                value: (0, viem_1.parseEther)(NUM_OF_ETH),
            });
            setLoading(false);
        }
        catch (error) {
            console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
            setLoading(false);
        }
    };
    // Render only on local chain
    if (ConnectedChain?.id !== chains_1.hardhat.id) {
        return null;
    }
    const isBalanceZero = balance && balance.value === 0n;
    return (<div className={!isBalanceZero
            ? "ml-1"
            : "ml-1 tooltip tooltip-bottom tooltip-primary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:-translate-x-2/5"} data-tip="Grab funds from faucet">
      <button className="btn btn-secondary btn-sm px-2 rounded-full" onClick={sendETH} disabled={loading}>
        {!loading ? (<outline_1.BanknotesIcon className="h-4 w-4"/>) : (<span className="loading loading-spinner loading-xs"></span>)}
      </button>
    </div>);
};
exports.FaucetButton = FaucetButton;
