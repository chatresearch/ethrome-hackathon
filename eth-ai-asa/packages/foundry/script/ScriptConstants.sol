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
    address constant DEPLOYER_ADDRESS = 0xC8bB12839E395E817ee2FA588dE32aeD3aed7F82;
    
    // Ethereum Sepolia
    address constant ENS_RESOLVER_SEPOLIA = 0x8FADE66B79cC9f707aB26799354482EB93a5B7dD;
    
    // ==================== Agent Configuration ====================
    
    // Agent Names (ENS domains)
    string constant DEFI_WIZARD_NAME = "defi-wizard.aiconfig.eth";
    string constant SECURITY_GURU_NAME = "security-guru.aiconfig.eth";
    string constant PROFILE_ROASTER_NAME = "profile-roaster.aiconfig.eth";
    string constant LINKEDIN_ROASTER_NAME = "linkedin-roaster.aiconfig.eth";
    string constant VIBE_ROASTER_NAME = "vibe-roaster.aiconfig.eth";
    
    // Agent Prices (in wei)
    uint256 constant AGENT_QUERY_PRICE = 0.00001 ether;
    
    // Agent Namehashes (Ethereum Sepolia)
    bytes32 constant DEFI_WIZARD_NAMEHASH = 0xcc8d67d267418ddf688ea6584cb37b7585ad68b8ba96abe7fc1e171f06b3aac8;
    bytes32 constant SECURITY_GURU_NAMEHASH = 0x4d2087036941ac174b2487fe484c53da33efe56a75f0bb03a8ba53de7eda21f9;
    bytes32 constant PROFILE_ROASTER_NAMEHASH = 0x45ca6a6f01892386a42e394aceac5ef800db2d72ff20c4b1ec3a86678b88a97c;
    bytes32 constant LINKEDIN_ROASTER_NAMEHASH = 0x9ab497bab10c19e6a68242f4285c78180d09611d0c2abeb40d7277155be52905;
    bytes32 constant VIBE_ROASTER_NAMEHASH = 0xfa8ae6d9d236c730d97a804d0331ee26fbff0c2496c91f6f5e403d07110665cc;
    
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
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/defi-wizard-capabilities.json";
    
    string constant SECURITY_GURU_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/security-guru-capabilities.json";
    
    string constant PROFILE_ROASTER_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/profile-roaster-capabilities.json";
    
    string constant LINKEDIN_ROASTER_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/linkedin-roaster-capabilities.json";
    
    string constant VIBE_ROASTER_CAPABILITIES_URL = 
        "https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/vibe-roaster-capabilities.json";
    
    string constant DEFI_WIZARD_ENDPOINT = "https://api.placeholder.com/defi-wizard";
    string constant SECURITY_GURU_ENDPOINT = "https://api.placeholder.com/security-guru";
    string constant PROFILE_ROASTER_ENDPOINT = "https://api.placeholder.com/profile-roaster";
    string constant LINKEDIN_ROASTER_ENDPOINT = "https://api.placeholder.com/linkedin-roaster";
    string constant VIBE_ROASTER_ENDPOINT = "https://api.placeholder.com/vibe-roaster";
    
    string constant DEFI_WIZARD_DESCRIPTION = "Expert DeFi strategy and yield optimization advisor";
    string constant SECURITY_GURU_DESCRIPTION = "Smart contract security expert and vulnerability analyzer";
    string constant PROFILE_ROASTER_DESCRIPTION = "Hilarious roaster that provides witty critiques of dating profiles and selfies";
    string constant LINKEDIN_ROASTER_DESCRIPTION = "Corporate culture expert that roasts professional headshots with satire";
    string constant VIBE_ROASTER_DESCRIPTION = "Fashion and aesthetic expert that roasts overall vibes and life choices";
}
