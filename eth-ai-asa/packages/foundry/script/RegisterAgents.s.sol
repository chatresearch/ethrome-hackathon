// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Register all agents on local AgentRegistry (Foundry - chain 31337)
 * @dev Run with: forge script script/RegisterAgents.s.sol --rpc-url http://127.0.0.1:8545
 */
contract RegisterAgents is Script {
    function run() external {
        vm.startBroadcast();
        
        // Get the AgentRegistry contract address from deployment
        // For local testing, the address is deployed by the Deploy.s.sol script
        AgentRegistry registry = AgentRegistry(payable(0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35));
        
        console.log("Registering all agents on local AgentRegistry...");
        console.log("Price per query:", ScriptConstants.AGENT_QUERY_PRICE / 1e16, "cents\n");
        
        // Register DeFi Wizard
        console.log("1. Registering defi-wizard.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.DEFI_WIZARD_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered\n");
        }
        
        // Register Security Guru
        console.log("2. Registering security-guru.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.SECURITY_GURU_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered\n");
        }
        
        // Register Profile Roaster
        console.log("3. Registering profile-roaster.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.PROFILE_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered\n");
        }
        
        // Register LinkedIn Roaster
        console.log("4. Registering linkedin-roaster.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.LINKEDIN_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered\n");
        }
        
        // Register Vibe Roaster
        console.log("5. Registering vibe-roaster.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.VIBE_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered\n");
        }
        
        vm.stopBroadcast();
        
        console.log("=== COMPLETE ===");
        console.log("All agents processed!");
        console.log("Total agents registered:", registry.getTotalAgents());
    }
}
