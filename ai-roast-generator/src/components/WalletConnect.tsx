import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export const WalletConnect: React.FC = () => {
  return (
    <div className="wallet-connect">
      <ConnectButton />
    </div>
  );
};
