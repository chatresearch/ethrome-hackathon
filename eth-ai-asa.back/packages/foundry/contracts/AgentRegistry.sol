//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/console.sol";

/**
 * @title AgentRegistry
 * @dev Payment and discovery layer for AI agents identified by ENS
 * Implements ENSIP-TBD-11: Agent Capabilities
 * Agent metadata stored in ENS text records, not on-chain
 * @author ENS Agent Marketplace Team
 */
contract AgentRegistry {
    struct Agent {
        address owner;
        string ensName;             // Store for easy lookup
        uint256 queryPrice;         // Price per query in wei
        uint256 totalQueries;       // Total queries made
        uint256 earnings;           // Accumulated earnings
        bool active;
        uint256 registeredAt;
    }

    // State Variables
    mapping(bytes32 => Agent) public agents; // ensNameHash => Agent
    bytes32[] public agentHashes;
    mapping(address => bytes32[]) public agentsByOwner;
    
    address public platformOwner;

    // Events
    event AgentRegistered(
        bytes32 indexed ensNameHash,
        string ensName,
        address indexed owner,
        uint256 queryPrice
    );
    
    event AgentUpdated(
        bytes32 indexed ensNameHash,
        uint256 queryPrice,
        bool active
    );
    
    event AgentQueried(
        bytes32 indexed ensNameHash,
        address indexed querier,
        uint256 pricePaid
    );
    
    event EarningsWithdrawn(
        bytes32 indexed ensNameHash,
        address indexed owner,
        uint256 amount
    );
    
    event AgentDeleted(
        bytes32 indexed ensNameHash,
        string ensName,
        address indexed owner
    );

    constructor() {
        platformOwner = msg.sender;
        console.log("AgentRegistry deployed - ENSIP-TBD-11 compliant");
    }

    /**
     * @dev Register an agent
     * Agent metadata should be stored in ENS text records:
     *   - agent.capabilities: URL to A2A capabilities JSON
     *   - agent.endpoint: API endpoint URL
     *   - agent.description: Human-readable description
     *   - agent.type: Framework type (e.g., "eliza-os")
     *   - agent.version: Agent version
     * 
     * @param _ensName The ENS name (e.g., "warrior.ballew.eth")
     * @param _queryPrice Price in wei per query
     */
    function registerAgent(
        string memory _ensName,
        uint256 _queryPrice
    ) public {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        require(agents[ensNameHash].owner == address(0), "Agent already registered");

        Agent memory newAgent = Agent({
            owner: msg.sender,
            ensName: _ensName,
            queryPrice: _queryPrice,
            totalQueries: 0,
            earnings: 0,
            active: true,
            registeredAt: block.timestamp
        });

        agents[ensNameHash] = newAgent;
        agentHashes.push(ensNameHash);
        agentsByOwner[msg.sender].push(ensNameHash);

        console.log("Agent registered:", _ensName);
        emit AgentRegistered(ensNameHash, _ensName, msg.sender, _queryPrice);
    }

    /**
     * @dev Update agent pricing and status
     * Metadata updates happen via ENS text records directly
     */
    function updateAgent(
        string memory _ensName,
        uint256 _queryPrice,
        bool _active
    ) public {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        require(agents[ensNameHash].owner == msg.sender, "Not agent owner");

        agents[ensNameHash].queryPrice = _queryPrice;
        agents[ensNameHash].active = _active;

        emit AgentUpdated(ensNameHash, _queryPrice, _active);
    }

    /**
     * @dev Query an agent (pay for service)
     * Frontend reads agent metadata from ENS text records
     */
    function queryAgent(string memory _ensName) public payable {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        Agent storage agent = agents[ensNameHash];
        
        require(agent.active, "Agent not active");
        require(msg.value >= agent.queryPrice, "Insufficient payment");

        agent.totalQueries += 1;
        agent.earnings += msg.value;

        console.log("Agent queried:", _ensName);
        emit AgentQueried(ensNameHash, msg.sender, msg.value);
    }

    /**
     * @dev Agent owner withdraws earnings
     */
    function withdrawEarnings(string memory _ensName) public {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        require(agents[ensNameHash].owner == msg.sender, "Not agent owner");
        
        uint256 amount = agents[ensNameHash].earnings;
        require(amount > 0, "No earnings to withdraw");

        agents[ensNameHash].earnings = 0;
        payable(msg.sender).transfer(amount);

        emit EarningsWithdrawn(ensNameHash, msg.sender, amount);
    }

    /**
     * @dev Delete an agent permanently
     * Only agent owner can delete
     * Removes from all mappings and arrays
     * Note: Earnings are lost if not withdrawn first
     */
    function deleteAgent(string memory _ensName) public {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        require(agents[ensNameHash].owner == msg.sender, "Not agent owner");
        
        string memory agentName = agents[ensNameHash].ensName;
        
        // Delete from main mapping
        delete agents[ensNameHash];
        
        // Remove from agentsByOwner mapping
        bytes32[] storage ownerAgents = agentsByOwner[msg.sender];
        for (uint256 i = 0; i < ownerAgents.length; i++) {
            if (ownerAgents[i] == ensNameHash) {
                ownerAgents[i] = ownerAgents[ownerAgents.length - 1];
                ownerAgents.pop();
                break;
            }
        }
        
        // Remove from agentHashes array
        for (uint256 i = 0; i < agentHashes.length; i++) {
            if (agentHashes[i] == ensNameHash) {
                agentHashes[i] = agentHashes[agentHashes.length - 1];
                agentHashes.pop();
                break;
            }
        }
        
        console.log("Agent deleted:", _ensName);
        emit AgentDeleted(ensNameHash, agentName, msg.sender);
    }

    // ============ View Functions ============

    /**
     * @dev Get agent payment data
     * For metadata, read ENS text records client-side
     */
    function getAgent(string memory _ensName) public view returns (Agent memory) {
        bytes32 ensNameHash = keccak256(abi.encodePacked(_ensName));
        return agents[ensNameHash];
    }

    /**
     * @dev Get all agent ENS names
     */
    function getAllAgentNames() public view returns (string[] memory) {
        string[] memory names = new string[](agentHashes.length);
        for (uint256 i = 0; i < agentHashes.length; i++) {
            names[i] = agents[agentHashes[i]].ensName;
        }
        return names;
    }

    /**
     * @dev Get agents owned by address
     */
    function getAgentsByOwner(address _owner) public view returns (string[] memory) {
        bytes32[] memory hashes = agentsByOwner[_owner];
        string[] memory names = new string[](hashes.length);
        for (uint256 i = 0; i < hashes.length; i++) {
            names[i] = agents[hashes[i]].ensName;
        }
        return names;
    }

    function getTotalAgents() public view returns (uint256) {
        return agentHashes.length;
    }

    receive() external payable {}
}
