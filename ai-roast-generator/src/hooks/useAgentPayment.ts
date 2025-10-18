import { useCallback, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';

const AGENT_REGISTRY_ADDRESS = '0xFBeE7f501704A9AA629Ae2D0aE6FB30989571Bd0';
const BASE_SEPOLIA_CHAIN_ID = 84532;

interface AgentPaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useAgentPayment() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
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

        if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
          throw new Error(`Please switch to Base Sepolia network (current chain: ${chainId})`);
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
    [isConnected, chainId, address]
  );

  return {
    queryAgentWithPayment,
    loading,
    error,
    isConnected,
    isCorrectNetwork: chainId === BASE_SEPOLIA_CHAIN_ID,
  };
}

// Helper to fetch agent price from contract
export async function fetchAgentPrice(agentName: string): Promise<string> {
  try {
    const response = await fetch('https://sepolia.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: AGENT_REGISTRY_ADDRESS,
            data: encodeGetAgent(agentName),
          },
          'latest',
        ],
        id: 1,
      }),
    });

    const result = await response.json();
    if (result.result) {
      // Parse the returned struct to get queryPrice (second field after owner)
      // Struct: owner (20 bytes) + ensName (32 bytes offset) + queryPrice (32 bytes) + ...
      const queryPriceHex = '0x' + result.result.slice(130, 194);
      return formatEther(BigInt(queryPriceHex));
    }
  } catch (error) {
    console.error('Error fetching agent price:', error);
  }
  return '0.00001'; // Fallback
}

function encodeQueryAgent(agentName: string): string {
  const functionSignature = '0x17a7e67e'; // keccak256('queryAgent(string)')
  const encodedName = encodeString(agentName);
  return functionSignature + encodedName.slice(2);
}

function encodeGetAgent(agentName: string): string {
  const functionSignature = 'bde52cb2'; // keccak256('getAgent(string)').slice(0, 8)
  const encodedName = encodeString(agentName);
  return '0x' + functionSignature + encodedName.slice(2);
}

function encodeString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const hex = Array.from(bytes, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
  
  const offset = '0000000000000000000000000000000000000000000000000000000000000020';
  const length = ('0000000000000000000000000000000000000000000000000000000000' + bytes.length.toString(16)).slice(-64);
  const padded = (hex + '0'.repeat(64)).slice(0, Math.ceil(bytes.length / 32) * 64);
  
  return offset + length + padded;
}
