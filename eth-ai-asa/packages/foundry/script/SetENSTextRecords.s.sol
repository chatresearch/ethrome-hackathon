// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "./ScriptConstants.sol";

interface IENSResolver {
    function setText(bytes32 node, string calldata key, string calldata value) external;
}

/**
 * @notice Set ENS text records for ENSIP-TBD-11 compliance
 * @dev Run with: forge script script/SetENSTextRecords.s.sol --rpc-url https://eth-sepolia.public.blastapi.io --broadcast --account ai --password ai
 */
contract SetENSTextRecords is Script {
    function run() external {
        vm.startBroadcast();

        IENSResolver resolver = IENSResolver(ScriptConstants.ENS_RESOLVER_SEPOLIA);
        
        console.log("Setting ENS text records (ENSIP-TBD-11)...\n");
        
        // Set DeFi Wizard records
        _setAgentRecords(
            resolver,
            ScriptConstants.DEFI_WIZARD_NAMEHASH,
            ScriptConstants.DEFI_WIZARD_NAME,
            ScriptConstants.DEFI_WIZARD_CAPABILITIES_URL,
            ScriptConstants.DEFI_WIZARD_ENDPOINT,
            ScriptConstants.DEFI_WIZARD_DESCRIPTION
        );
        
        console.log("");
        
        // Set Security Guru records
        _setAgentRecords(
            resolver,
            ScriptConstants.SECURITY_GURU_NAMEHASH,
            ScriptConstants.SECURITY_GURU_NAME,
            ScriptConstants.SECURITY_GURU_CAPABILITIES_URL,
            ScriptConstants.SECURITY_GURU_ENDPOINT,
            ScriptConstants.SECURITY_GURU_DESCRIPTION
        );
        
        vm.stopBroadcast();
        
        console.log("\n=== COMPLETE ===");
        console.log("Text records set following ENSIP-TBD-11 standard!");
    }
    
    function _setAgentRecords(
        IENSResolver resolver,
        bytes32 node,
        string memory agentName,
        string memory capabilitiesUrl,
        string memory endpoint,
        string memory description
    ) internal {
        console.log(string.concat("Setting records for ", agentName, "..."));
        
        resolver.setText(node, ScriptConstants.KEY_CAPABILITIES, capabilitiesUrl);
        resolver.setText(node, ScriptConstants.KEY_ENDPOINT, endpoint);
        resolver.setText(node, ScriptConstants.KEY_DESCRIPTION, description);
        resolver.setText(node, ScriptConstants.KEY_TYPE, ScriptConstants.DEFAULT_AGENT_TYPE);
        resolver.setText(node, ScriptConstants.KEY_VERSION, ScriptConstants.DEFAULT_AGENT_VERSION);
        
        console.log(string.concat("  + ", agentName, " records set"));
    }
}
