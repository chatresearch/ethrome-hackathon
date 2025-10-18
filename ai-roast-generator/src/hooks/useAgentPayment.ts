import { useCallback, useState } from 'react';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';
import { parseEther } from 'viem';

const AGENT_REGISTRY_ADDRESS = '0xFBeE7f501704A9AA629Ae2D0aE6FB30989571Bd0';
const BASE_SEPOLIA_CHAIN_ID = 84532;

const AGENT_REGISTRY_ABI = [
  {
    name: 'queryAgent',
    type: 'function',
    inputs: [{ name: '_ensName', type: 'string' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'getAgent',
    type: 'function',
    inputs: [{ name: '_ensName', type: 'string' }],
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'ensName', type: 'string' },
      { name: 'queryPrice', type: 'uint256' },
      { name: 'totalQueries', type: 'uint256' },
      { name: 'earnings', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'registeredAt', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const;

interface AgentPaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useAgentPayment() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryAgentWithPayment = useCallback(
    async (agentName: string, priceInEth: string): Promise<AgentPaymentResult> => {
      try {
        setError(null);
        setLoading(true);

        if (!isConnected) {
          throw new Error('Wallet not connected');
        }

        if (chain?.id !== BASE_SEPOLIA_CHAIN_ID) {
          throw new Error(`Please switch to Base Sepolia network (current: ${chain?.name})`);
        }

        // Get agent price from contract
        const agentPrice = parseEther(priceInEth);

        // Send transaction to queryAgent
        const client = await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: address,
              to: AGENT_REGISTRY_ADDRESS,
              data: encodeQueryAgent(agentName),
              value: `0x${agentPrice.toString(16)}`,
            },
          ],
        });

        setLoading(false);
        return {
          success: true,
          txHash: client,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setLoading(false);
        return {
          success: false,
          error: message,
        };
      }
    },
    [isConnected, chain, address]
  );

  return {
    queryAgentWithPayment,
    loading,
    error,
    isConnected,
    isCorrectNetwork: chain?.id === BASE_SEPOLIA_CHAIN_ID,
  };
}

function encodeQueryAgent(agentName: string): string {
  // Encode the queryAgent function call
  const functionSignature = '0x17a7e67e'; // keccak256('queryAgent(string)')
  const encodedName = encodeString(agentName);
  return functionSignature + encodedName.slice(2);
}

function encodeString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const hex = Array.from(bytes, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
  
  // Pad offset (32 bytes)
  const offset = '0000000000000000000000000000000000000000000000000000000000000020';
  // Pad length
  const length = ('0000000000000000000000000000000000000000000000000000000000' + bytes.length.toString(16)).slice(-64);
  // Pad string data
  const padded = (hex + '0'.repeat(64)).slice(0, Math.ceil(bytes.length / 32) * 64);
  
  return offset + length + padded;
}
