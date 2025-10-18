// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Delete old ballew.eth agents
 * @dev Run with: forge script script/DeleteOldAgents.s.sol --rpc-url https://sepolia.base.org --broadcast --account ai --password ai
 */
contract DeleteOldAgents is Script {
    function run() external {
        vm.startBroadcast();
        
        AgentRegistry registry = AgentRegistry(payable(ScriptConstants.AGENT_REGISTRY_BASE_SEPOLIA));
        
        console.log("Deleting old ballew.eth agents...");
        
        // Delete old DeFi Wizard
        registry.deleteAgent("defi-wizard.ballew.eth");
        console.log("Deleted: defi-wizard.ballew.eth");
        
        // Delete old Security Guru
        registry.deleteAgent("security-guru.ballew.eth");
        console.log("Deleted: security-guru.ballew.eth");
        
        vm.stopBroadcast();
        
        console.log("\nOld agents deleted!");
        console.log("Active agents are now:");
        console.log("- defi-wizard.aiconfig.eth");
        console.log("- security-guru.aiconfig.eth");
    }
}
