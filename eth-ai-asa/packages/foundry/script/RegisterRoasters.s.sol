// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

interface IENSRegistrar {
    function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external;
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external;
}

interface IENSResolver {
    function setText(bytes32 node, string calldata key, string calldata value) external;
}

/**
 * @notice Register roaster agent subdomains on ENS Sepolia
 * @dev Run with: forge script script/RegisterRoasters.s.sol --rpc-url https://eth-sepolia.public.blastapi.io --broadcast
 */
contract RegisterRoasters is Script {
    // ENS Sepolia addresses
    address constant ENS_REGISTRY = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    address constant ENS_RESOLVER = 0x8FADE66B79cC9f707aB26799354482EB93a5B7dD;
    
    // aiconfig.eth namehash
    bytes32 constant AICONFIG_NAMEHASH = 0x54d0c19d30b42b25ff3c1bea369f16aed85edf2d65be07ffd57417c62b5d3d25;
    
    // Labels for roasters (keccak256 hash of subdomain name)
    bytes32 constant PROFILE_ROASTER_LABEL = keccak256(abi.encodePacked("profile-roaster"));
    bytes32 constant LINKEDIN_ROASTER_LABEL = keccak256(abi.encodePacked("linkedin-roaster"));
    bytes32 constant VIBE_ROASTER_LABEL = keccak256(abi.encodePacked("vibe-roaster"));
    
    function run() external {
        vm.startBroadcast();
        
        IENSRegistrar registrar = IENSRegistrar(ENS_REGISTRY);
        address owner = msg.sender;
        
        console.log("Registering roaster subdomains on ENS Sepolia...\n");
        console.log("Deployer address:", owner);
        
        // Register profile-roaster.aiconfig.eth
        console.log("Registering profile-roaster.aiconfig.eth...");
        registrar.setSubnodeOwner(AICONFIG_NAMEHASH, PROFILE_ROASTER_LABEL, owner);
        console.log("  [OK] Registered");
        
        // Register linkedin-roaster.aiconfig.eth
        console.log("Registering linkedin-roaster.aiconfig.eth...");
        registrar.setSubnodeOwner(AICONFIG_NAMEHASH, LINKEDIN_ROASTER_LABEL, owner);
        console.log("  [OK] Registered");
        
        // Register vibe-roaster.aiconfig.eth
        console.log("Registering vibe-roaster.aiconfig.eth...");
        registrar.setSubnodeOwner(AICONFIG_NAMEHASH, VIBE_ROASTER_LABEL, owner);
        console.log("  [OK] Registered");
        
        vm.stopBroadcast();
        
        console.log("\n=== COMPLETE ===");
        console.log("Roaster subdomains registered!");
        console.log("Next: Run SetENSTextRecords.s.sol to set capabilities");
    }
}
