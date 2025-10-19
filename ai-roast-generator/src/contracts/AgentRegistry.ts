export const AGENT_REGISTRY_ABI = [
  {
    inputs: [],
    name: "platformOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_agentName", type: "string" },
      { internalType: "string", name: "_roastText", type: "string" },
      { internalType: "string", name: "_imageUrl", type: "string" },
    ],
    name: "recordRoast",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_roastId", type: "uint256" }],
    name: "voteRoast",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_limit", type: "uint256" }],
    name: "getTopRoasts",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "agentName", type: "string" },
          { internalType: "string", name: "roastText", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint256", name: "votes", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct AgentRegistry.Roast[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRoasts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "roastId", type: "uint256" },
      { indexed: true, internalType: "string", name: "agentName", type: "string" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "imageUrl", type: "string" },
    ],
    name: "RoastRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "roastId", type: "uint256" },
      { indexed: true, internalType: "address", name: "voter", type: "address" },
      { indexed: false, internalType: "uint256", name: "totalVotes", type: "uint256" },
    ],
    name: "RoastVoted",
    type: "event",
  },
] as const;

export const AGENT_REGISTRY_ADDRESS = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519";
