// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Delete an agent from AgentRegistry (Base Sepolia)
 * @dev Run with: forge script script/DeleteAgent.s.sol --rpc-url https://sepolia.base.org --broadcast --account <account>
 */
contract DeleteAgent is Script {
    function run() external {
        vm.startBroadcast();
        
        // Update this to your Base Sepolia contract address
        AgentRegistry registry = AgentRegistry(payable(0xFBeE7f501704A9AA629Ae2D0aE6FB30989571Bd0));
        
        console.log("Deleting agent: defi-wizard.ballew.eth");
        
        registry.deleteAgent("defi-wizard.ballew.eth");
        
        console.log("Agent deleted successfully!");
        console.log("Total agents remaining:", registry.getTotalAgents());
        
        vm.stopBroadcast();
    }
}
