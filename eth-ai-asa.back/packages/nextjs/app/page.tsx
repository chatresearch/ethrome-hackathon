"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">ENS Agent Marketplace</span>
          </h1>
          <p className="text-center text-lg opacity-75 mt-4 mb-6">ENSIP-TBD-11 Reference Implementation</p>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            {mounted && <Address address={connectedAddress} />}
          </div>

          <p className="text-center text-base opacity-70 mt-6">
            Discover, query, and pay for AI agent services using ENS for decentralized discovery.
          </p>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-primary mb-4" />
              <p className="font-semibold mb-2">Agent Marketplace</p>
              <p className="mb-4">Explore and query AI agents built with ENSIP-TBD-11 protocol.</p>
              <Link href="/agents" passHref className="btn btn-primary btn-sm">
                Browse Agents
              </Link>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary mb-4" />
              <p className="font-semibold mb-2">Debug</p>
              <p className="mb-4">Tinker with the AgentRegistry smart contract directly.</p>
              <Link href="/debug" passHref className="btn btn-secondary btn-sm">
                Debug Contracts
              </Link>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-accent mb-4" />
              <p className="font-semibold mb-2">Block Explorer</p>
              <p className="mb-4">Explore transactions on Base Sepolia.</p>
              <Link href="/blockexplorer" passHref className="btn btn-accent btn-sm">
                Explorer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
