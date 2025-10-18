import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi';

export const WalletConnect: React.FC = () => {
  const { address, isConnecting, isConnected } = useAccount();

  return (
    <div className="wallet-connect">
      <ConnectButton />
      {isConnected && address && (
        <div className="wallet-info">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
};
