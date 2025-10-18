import { useCallback, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ethers } from 'ethers';

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
    const BASE_SEPOLIA_RPC = 'https://base-sepolia.g.alchemy.com/v2/7U4mbJajvpp6GzozCw6z6kMEGAqKcXkG';
    console.log(`[Price] Fetching price for ${agentName}...`);
    
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
    
    const AGENT_REGISTRY_ABI = [
      'function getAgent(string memory _ensName) public view returns (tuple(address owner, string ensName, uint256 queryPrice, uint256 totalQueries, uint256 earnings, bool active, uint256 registeredAt))'
    ];
    
    const contract = new ethers.Contract(AGENT_REGISTRY_ADDRESS, AGENT_REGISTRY_ABI, provider);
    console.log(`[Price] Calling getAgent() on contract ${AGENT_REGISTRY_ADDRESS}...`);
    
    const agent = await contract.getAgent(agentName);
    console.log(`[Price] Got agent data:`, agent);
    
    const price = agent.queryPrice;
    if (!price || price === 0n) {
      throw new Error(`Invalid price for agent ${agentName}`);
    }
    
    const priceEth = formatEther(price);
    console.log(`[Price] ✅ Price fetched for ${agentName}: ${priceEth} ETH`);
    return priceEth;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Price] ❌ Failed to fetch price for ${agentName}:`, message, error);
    throw new Error(`Failed to fetch price for ${agentName}: ${message}`);
  }
}

// Helper to fetch ENS avatar for an agent using ethers.js
export async function fetchAgentAvatar(ensName: string): Promise<string> {
  try {
    const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/7U4mbJajvpp6GzozCw6z6kMEGAqKcXkG';
    console.log(`[ENS] Creating provider for ${ensName}...`);
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    
    console.log(`[ENS] Resolving avatar for ${ensName}...`);
    const resolver = await provider.getResolver(ensName);
    console.log(`[ENS] Resolver result:`, resolver);
    
    if (!resolver) {
      throw new Error(`No ENS resolver found for ${ensName}`);
    }
    
    console.log(`[ENS] Fetching avatar text record...`);
    const avatarUrl = await resolver.getText('avatar');
    console.log(`[ENS] Avatar URL result:`, avatarUrl);
    
    if (!avatarUrl) {
      throw new Error(`No avatar text record set for ${ensName}`);
    }
    
    console.log(`[ENS] ✅ Avatar fetched for ${ensName}: ${avatarUrl}`);
    return avatarUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ENS] ❌ Failed to fetch avatar for ${ensName}:`, message, error);
    throw new Error(`Failed to fetch avatar for ${ensName}: ${message}`);
  }
}

function encodeQueryAgent(agentName: string): string {
  const functionSignature = '0x17a7e67e'; // keccak256('queryAgent(string)')
  const encodedName = encodeString(agentName);
  return functionSignature + encodedName.slice(2);
}

function encodeString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const hex = Array.from(bytes, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
  
  const offset = '0000000000000000000000000000000000000000000000000000000000000020';
  const length = ('0000000000000000000000000000000000000000000000000000000000' + bytes.length.toString(16)).slice(-64);
  const padded = (hex + '0'.repeat(64)).slice(0, Math.ceil(bytes.length / 32) * 64);
  
  return offset + length + padded;
}
