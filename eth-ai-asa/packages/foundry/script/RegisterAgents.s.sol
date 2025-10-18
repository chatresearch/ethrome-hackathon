// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Register demo agents on AgentRegistry
 * @dev Run with: forge script script/RegisterAgents.s.sol --rpc-url https://sepolia.base.org --broadcast --account ai --password ai
 */
contract RegisterAgents is Script {
    function run() external {
        vm.startBroadcast();
        
        AgentRegistry registry = AgentRegistry(payable(ScriptConstants.AGENT_REGISTRY_BASE_SEPOLIA));
        
        console.log("Registering agents on Base Sepolia...");
        
        // Register DeFi Wizard
        registry.registerAgent(ScriptConstants.DEFI_WIZARD_NAME, ScriptConstants.AGENT_QUERY_PRICE);
        console.log("Registered:", ScriptConstants.DEFI_WIZARD_NAME);
        
        // Register Security Guru
        registry.registerAgent(ScriptConstants.SECURITY_GURU_NAME, ScriptConstants.AGENT_QUERY_PRICE);
        console.log("Registered:", ScriptConstants.SECURITY_GURU_NAME);
        
        vm.stopBroadcast();
        
        console.log("\nAgents registered successfully!");
        console.log("Total agents registered:", registry.getTotalAgents());
    }
}
