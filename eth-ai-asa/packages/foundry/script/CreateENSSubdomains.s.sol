// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "./DeployHelpers.s.sol";

interface IENSRegistry {
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external returns (bytes32);
    function setResolver(bytes32 node, address resolver) external;
}

/**
 * @notice Create ENS subdomains for aiconfig.eth
 * @dev Creates defi-wizard.aiconfig.eth and security-guru.aiconfig.eth
 * Run with: forge script script/CreateENSSubdomains.s.sol --rpc-url https://eth-sepolia.public.blastapi.io --broadcast --account ai
 */
contract CreateENSSubdomains is ScaffoldETHDeploy {
    // ENS Registry on Sepolia
    address constant ENS_REGISTRY = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    
    // ENS Public Resolver on Sepolia
    address constant RESOLVER = 0x8FADE66B79cC9f707aB26799354482EB93a5B7dD;
    
    // Namehash for aiconfig.eth
    bytes32 constant AICONFIG_NODE = 0x54d0c19d30b42b25ff3c1bea369f16aed85edf2d65be07ffd57417c62b5d3d25;
    
    // Labels for subdomains (keccak256 of the subdomain name)
    bytes32 constant DEFI_WIZARD_LABEL = keccak256("defi-wizard");
    bytes32 constant SECURITY_GURU_LABEL = keccak256("security-guru");
    
    function run() external ScaffoldEthDeployerRunner {
        IENSRegistry registry = IENSRegistry(ENS_REGISTRY);
        
        console.log("Creating subdomains for aiconfig.eth...");
        console.log("Your address:", deployer);
        
        // Create defi-wizard.aiconfig.eth
        console.log("\nCreating defi-wizard.aiconfig.eth...");
        bytes32 defiWizardNode = registry.setSubnodeOwner(
            AICONFIG_NODE,
            DEFI_WIZARD_LABEL,
            deployer
        );
        console.log("defi-wizard subdomain created!");
        console.log("Node:", vm.toString(defiWizardNode));
        
        // Set resolver for defi-wizard.aiconfig.eth
        registry.setResolver(defiWizardNode, RESOLVER);
        console.log("Resolver set for defi-wizard.aiconfig.eth");
        
        // Create security-guru.aiconfig.eth
        console.log("\nCreating security-guru.aiconfig.eth...");
        bytes32 securityGuruNode = registry.setSubnodeOwner(
            AICONFIG_NODE,
            SECURITY_GURU_LABEL,
            deployer
        );
        console.log("security-guru subdomain created!");
        console.log("Node:", vm.toString(securityGuruNode));
        
        // Set resolver for security-guru.aiconfig.eth
        registry.setResolver(securityGuruNode, RESOLVER);
        console.log("Resolver set for security-guru.aiconfig.eth");
        
        console.log("\n=== SUBDOMAIN CREATION COMPLETE ===");
        console.log("defi-wizard.aiconfig.eth node:", vm.toString(defiWizardNode));
        console.log("security-guru.aiconfig.eth node:", vm.toString(securityGuruNode));
        console.log("\nUse these node values in SetENSTextRecords.s.sol!");
    }
}

