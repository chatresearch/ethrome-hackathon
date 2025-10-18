// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ScriptConstants
 * @notice Shared constants for all deployment and agent scripts
 * @dev Update these values if deploying to different networks or addresses
 */
library ScriptConstants {
    // ==================== Network Addresses ====================
    
    // Base Sepolia
    address constant AGENT_REGISTRY_BASE_SEPOLIA = 0xFBeE7f501704A9AA629Ae2D0aE6FB30989571Bd0;
    
    // Ethereum Sepolia
    address constant ENS_RESOLVER_SEPOLIA = 0x8FADE66B79cC9f707aB26799354482EB93a5B7dD;
    
    // ==================== Agent Configuration ====================
    
    // Agent Names (ENS domains)
    string constant DEFI_WIZARD_NAME = "defi-wizard.aiconfig.eth";
    string constant SECURITY_GURU_NAME = "security-guru.aiconfig.eth";
    
    // Agent Prices (in wei)
    uint256 constant AGENT_QUERY_PRICE = 0.00001 ether;
    
    // Agent Namehashes (Ethereum Sepolia)
    bytes32 constant DEFI_WIZARD_NAMEHASH = 0xcc8d67d267418ddf688ea6584cb37b7585ad68b8ba96abe7fc1e171f06b3aac8;
    bytes32 constant SECURITY_GURU_NAMEHASH = 0x4d2087036941ac174b2487fe484c53da33efe56a75f0bb03a8ba53de7eda21f9;
    
    // ==================== ENSIP-TBD-11 Text Record Keys ====================
    
    string constant KEY_CAPABILITIES = "agent.capabilities";
    string constant KEY_ENDPOINT = "agent.endpoint";
    string constant KEY_DESCRIPTION = "agent.description";
    string constant KEY_TYPE = "agent.type";
    string constant KEY_VERSION = "agent.version";
    
    // ==================== Default Values ====================
    
    string constant DEFAULT_AGENT_TYPE = "eliza-os";
    string constant DEFAULT_AGENT_VERSION = "1.0.0";
    
    // ==================== GitHub URLs ====================
    
    string constant DEFI_WIZARD_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/agent-capabilities/defi-wizard-capabilities.json";
    
    string constant SECURITY_GURU_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/agent-capabilities/security-guru-capabilities.json";
    
    string constant DEFI_WIZARD_ENDPOINT = "https://api.placeholder.com/defi-wizard";
    string constant SECURITY_GURU_ENDPOINT = "https://api.placeholder.com/security-guru";
    
    string constant DEFI_WIZARD_DESCRIPTION = "Expert DeFi strategy and yield optimization advisor";
    string constant SECURITY_GURU_DESCRIPTION = "Smart contract security expert and vulnerability analyzer";
}
