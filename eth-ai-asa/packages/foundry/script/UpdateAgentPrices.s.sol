// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Update agent prices on AgentRegistry
 * @dev Run with: forge script script/UpdateAgentPrices.s.sol --rpc-url https://sepolia.base.org --broadcast --account ai --password ai
 */
contract UpdateAgentPrices is Script {
    function run() external {
        vm.startBroadcast();
        
        AgentRegistry registry = AgentRegistry(payable(ScriptConstants.AGENT_REGISTRY_BASE_SEPOLIA));
        
        console.log("Updating agent prices...");
        
        // Update DeFi Wizard
        registry.updateAgent(ScriptConstants.DEFI_WIZARD_NAME, ScriptConstants.AGENT_QUERY_PRICE, true);
        console.log("Updated:", ScriptConstants.DEFI_WIZARD_NAME);
        
        // Update Security Guru
        registry.updateAgent(ScriptConstants.SECURITY_GURU_NAME, ScriptConstants.AGENT_QUERY_PRICE, true);
        console.log("Updated:", ScriptConstants.SECURITY_GURU_NAME);
        
        vm.stopBroadcast();
        
        console.log("\nDone! All agents updated to", ScriptConstants.AGENT_QUERY_PRICE / 1e16, "cents");
    }
}
