import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi';
export const WalletConnect = () => {
    const { address, isConnected } = useAccount();
    return (_jsxs("div", { className: "wallet-connect", children: [_jsx(ConnectButton, {}), isConnected && address && (_jsxs("div", { className: "wallet-info", children: ["Connected: ", address.slice(0, 6), "...", address.slice(-4)] }))] }));
};
//# sourceMappingURL=WalletConnect.js.map