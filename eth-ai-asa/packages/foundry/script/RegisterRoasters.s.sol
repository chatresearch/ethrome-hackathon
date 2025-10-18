// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/AgentRegistry.sol";
import "./ScriptConstants.sol";

/**
 * @notice Register all agents on AgentRegistry (Base Sepolia)
 * @dev Run with: forge script script/RegisterRoasters.s.sol --rpc-url https://sepolia.base.org --broadcast
 */
contract RegisterRoasters is Script {
    function run() external {
        vm.startBroadcast();
        
        AgentRegistry registry = AgentRegistry(payable(ScriptConstants.AGENT_REGISTRY_BASE_SEPOLIA));
        
        console.log("Registering all agents on AgentRegistry (Base Sepolia)...");
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
            console.log("   [SKIP] Already registered - updating price...\n");
            registry.updateAgent(ScriptConstants.PROFILE_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE, true);
        }
        
        // Register LinkedIn Roaster
        console.log("4. Registering linkedin-roaster.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.LINKEDIN_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered - updating price...\n");
            registry.updateAgent(ScriptConstants.LINKEDIN_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE, true);
        }
        
        // Register Vibe Roaster
        console.log("5. Registering vibe-roaster.aiconfig.eth...");
        try registry.registerAgent(ScriptConstants.VIBE_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE) {
            console.log("   [OK] Registered\n");
        } catch {
            console.log("   [SKIP] Already registered - updating price...\n");
            registry.updateAgent(ScriptConstants.VIBE_ROASTER_NAME, ScriptConstants.AGENT_QUERY_PRICE, true);
        }
        
        vm.stopBroadcast();
        
        console.log("=== COMPLETE ===");
        console.log("All agents processed!");
        console.log("Total agents registered:", registry.getTotalAgents());
    }
}
