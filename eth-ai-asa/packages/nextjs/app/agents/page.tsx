"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Agent {
  name: string;
  ensName: string;
  description: string;
  price: string;
  stats?: {
    totalQueries?: number;
    earnings?: string;
  };
}

const AgentMarketplace: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryingAgent, setQueryingAgent] = useState<string | null>(null);

  // Read contract data
  const { data: totalAgents } = useScaffoldReadContract({
    contractName: "AgentRegistry",
    functionName: "getTotalAgents",
  });

  // Write contract function
  const { writeContractAsync: queryAgent } = useScaffoldWriteContract({
    contractName: "AgentRegistry",
  });

  // Mock agents data (would come from contract + ENS in production)
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        name: "DeFi Wizard",
        ensName: "defi-wizard.aiconfig.eth",
        description: "Expert DeFi strategy and yield optimization advisor",
        price: "0.00001",
        stats: { totalQueries: 42, earnings: "0.042" },
      },
      {
        name: "Security Guru",
        ensName: "security-guru.aiconfig.eth",
        description: "Smart contract security expert and vulnerability analyzer",
        price: "0.00001",
        stats: { totalQueries: 28, earnings: "0.042" },
      },
    ];
    setAgents(mockAgents);
    setLoading(false);
  }, []);

  const handleQueryAgent = async (agent: Agent) => {
    try {
      setQueryingAgent(agent.ensName);
      await queryAgent({
        functionName: "queryAgent",
        args: [agent.ensName],
        value: parseEther(agent.price),
      });
      // Success - payment processed
      setTimeout(() => setQueryingAgent(null), 2000);
    } catch (error) {
      console.error("Query failed:", error);
      setQueryingAgent(null);
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-center text-4xl font-bold mb-2">Agent Marketplace</h1>
          <p className="text-center text-lg opacity-70">Discover and query AI agents using ENSIP-TBD-11 protocol</p>
        </div>

        {/* Connected Info */}
        <div className="bg-base-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <div>
              <p className="text-sm opacity-70 mb-2">Connected Wallet</p>
              <Address address={connectedAddress} />
            </div>
            <div>
              <p className="text-sm opacity-70 mb-2">Balance</p>
              <Balance address={connectedAddress} />
            </div>
            <div>
              <p className="text-sm opacity-70 mb-2">Total Agents</p>
              <p className="text-2xl font-bold">{totalAgents?.toString() || "2"}</p>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map(agent => (
              <div key={agent.ensName} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  {/* Agent Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="card-title text-2xl">{agent.name}</h2>
                      <p className="text-sm opacity-70 font-mono">{agent.ensName}</p>
                    </div>
                    <div className="badge badge-primary">{agent.price} ETH</div>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-base opacity-90">{agent.description}</p>

                  {/* Stats */}
                  <div className="stats stats-vertical lg:stats-horizontal w-full mb-4 bg-base-200">
                    <div className="stat">
                      <div className="stat-title text-xs">Queries</div>
                      <div className="stat-value text-lg">{agent.stats?.totalQueries || 0}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-xs">Earnings</div>
                      <div className="stat-value text-lg">{agent.stats?.earnings || "0"} ETH</div>
                    </div>
                  </div>

                  {/* Capabilities Preview */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.name === "DeFi Wizard" ? (
                        <>
                          <div className="badge">Yield Analysis</div>
                          <div className="badge">Protocol Comparison</div>
                          <div className="badge">Risk Assessment</div>
                        </>
                      ) : (
                        <>
                          <div className="badge">Vulnerability Scan</div>
                          <div className="badge">Audit Checklist</div>
                          <div className="badge">Best Practices</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Query Button */}
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleQueryAgent(agent)}
                      disabled={!connectedAddress || queryingAgent === agent.ensName}
                      className="btn btn-primary w-full"
                    >
                      {queryingAgent === agent.ensName ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Querying...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-5 w-5" />
                          Query Agent
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-base-200 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <CheckCircleIcon className="h-6 w-6 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">ENSIP-TBD-11 Compliant</h3>
              <p className="opacity-90 mb-3">
                This marketplace demonstrates a reference implementation of the ENSIP-TBD-11 standard for AI agent
                capabilities. Agent metadata is stored in ENS text records, enabling decentralized agent discovery and
                integration.
              </p>
              <p className="text-sm opacity-70">
                Learn more:{" "}
                <a href="https://docs.ens.domains" target="_blank" rel="noopener noreferrer" className="link">
                  ENS Documentation
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMarketplace;
