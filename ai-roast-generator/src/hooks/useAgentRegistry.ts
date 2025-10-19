import { useCallback } from 'react';
import { useContractWrite, useContractRead } from 'wagmi';
import { AgentRegistry } from '../contracts/AgentRegistry';

// AgentRegistry contract ABI (minimal - just what we need)
const AGENT_REGISTRY_ABI = [
  {
    name: 'recordRoast',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_agentName', type: 'string' },
      { name: '_roastText', type: 'string' },
      { name: '_imageUrl', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'voteRoast',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_roastId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getTopRoasts',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_limit', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'agentName', type: 'string' },
          { name: 'roastText', type: 'string' },
          { name: 'imageUrl', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'votes', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getTotalRoasts',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

// Contract address - deployed to Base Sepolia
const AGENT_REGISTRY_ADDRESS = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';

export function useAgentRegistry() {
  const recordRoastAsync = useCallback(
    async (agentName: string, roastText: string, imageUrl: string) => {
      // This would be called after roast is generated
      // For now, logs the data that would be sent
      console.log('[AgentRegistry] Would record roast:', { agentName, roastText, imageUrl });
      // TODO: Wire up contract call via useContractWrite
    },
    []
  );

  const voteRoastAsync = useCallback(
    async (roastId: number) => {
      // Vote on a roast
      console.log('[AgentRegistry] Would vote on roast:', roastId);
      // TODO: Wire up contract call via useContractWrite
    },
    []
  );

  return {
    recordRoastAsync,
    voteRoastAsync,
  };
}
