// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/AgentRegistry.sol";

/**
 * @notice Deploy script for AgentRegistry contract
 * @dev Deploy to Base Sepolia with: yarn deploy --file DeployAgentRegistry.s.sol --network baseSepolia
 */
contract DeployAgentRegistry is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        AgentRegistry agentRegistry = new AgentRegistry();
        console.log("AgentRegistry deployed at:", address(agentRegistry));
        console.log("Platform owner:", agentRegistry.platformOwner());
        console.log("Ready to register agents!");
    }
}

