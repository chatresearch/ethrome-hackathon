import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { AGENT_REGISTRY_ABI, AGENT_REGISTRY_ADDRESS } from '../contracts/AgentRegistry';

export function useAgentRegistry() {
  const { writeContractAsync } = useWriteContract();

  const recordRoastAsync = useCallback(
    async (agentName: string, roastText: string, imageUrl: string) => {
      try {
        console.log('[AgentRegistry] Recording roast on-chain:', { agentName, roastText: roastText.substring(0, 50) + '...', imageUrl });
        
        const txHash = await writeContractAsync({
          address: AGENT_REGISTRY_ADDRESS as `0x${string}`,
          abi: AGENT_REGISTRY_ABI,
          functionName: 'recordRoast',
          args: [agentName, roastText, imageUrl],
        });
        
        console.log('[AgentRegistry] ✅ Roast recorded on-chain:', txHash);
        return txHash;
      } catch (error) {
        console.error('[AgentRegistry] ❌ Failed to record roast:', error);
        throw error;
      }
    },
    [writeContractAsync]
  );

  const voteRoastAsync = useCallback(
    async (roastId: number) => {
      try {
        console.log('[AgentRegistry] Voting on roast:', roastId);
        
        const txHash = await writeContractAsync({
          address: AGENT_REGISTRY_ADDRESS as `0x${string}`,
          abi: AGENT_REGISTRY_ABI,
          functionName: 'voteRoast',
          args: [BigInt(roastId)],
          value: BigInt('1000000000000000'), // 0.001 ETH in wei
        });
        
        console.log('[AgentRegistry] ✅ Vote recorded on-chain:', txHash);
        return txHash;
      } catch (error) {
        console.error('[AgentRegistry] ❌ Failed to vote:', error);
        throw error;
      }
    },
    [writeContractAsync]
  );

  return {
    recordRoastAsync,
    voteRoastAsync,
  };
}
