// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Deactivate old ballew.eth agents
 * @dev Run with: forge script script/DeactivateOldAgents.s.sol --rpc-url https://sepolia.base.org --broadcast --account ai --password ai
 */
contract DeactivateOldAgents is Script {
    function run() external {
        vm.startBroadcast();
        
        AgentRegistry registry = AgentRegistry(payable(ScriptConstants.AGENT_REGISTRY_BASE_SEPOLIA));
        
        console.log("Deactivating old ballew.eth agents...");
        
        // Deactivate old DeFi Wizard
        registry.updateAgent("defi-wizard.ballew.eth", 0, false);
        console.log("Deactivated: defi-wizard.ballew.eth");
        
        // Deactivate old Security Guru
        registry.updateAgent("security-guru.ballew.eth", 0, false);
        console.log("Deactivated: security-guru.ballew.eth");
        
        vm.stopBroadcast();
        
        console.log("\nOld agents deactivated!");
        console.log("Active agents are now:");
        console.log("- defi-wizard.aiconfig.eth");
        console.log("- security-guru.aiconfig.eth");
    }
}
