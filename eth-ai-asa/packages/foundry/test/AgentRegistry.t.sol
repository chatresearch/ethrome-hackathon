// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/AgentRegistry.sol";

/**
 * @title AgentRegistryTest
 * @dev Comprehensive test suite for AgentRegistry contract
 * Tests agent registration, querying, payments, and withdrawals
 */
contract AgentRegistryTest is Test {
    AgentRegistry public registry;
    
    // Test accounts
    address public defiOwner = address(0x1111);
    address public securityOwner = address(0x2222);
    address public querier1 = address(0x3333);
    address public querier2 = address(0x4444);
    
    // Real agent names from our deployment
    string constant DEFI_WIZARD = "defi-wizard.aiconfig.eth";
    string constant SECURITY_GURU = "security-guru.aiconfig.eth";
    
    // Prices
    uint256 constant DEFI_PRICE = 0.00001 ether;
    uint256 constant SECURITY_PRICE = 0.00001 ether;

    function setUp() public {
        registry = new AgentRegistry();
        
        // Fund test accounts
        vm.deal(defiOwner, 10 ether);
        vm.deal(securityOwner, 10 ether);
        vm.deal(querier1, 10 ether);
        vm.deal(querier2, 10 ether);
    }

    // ==================== Registration Tests ====================

    function test_RegisterAgent_Success() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.owner, defiOwner);
        assertEq(agent.queryPrice, DEFI_PRICE);
        assertTrue(agent.active);
        assertEq(agent.totalQueries, 0);
        assertEq(agent.earnings, 0);
    }

    function test_RegisterAgent_MultipleAgents() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(securityOwner);
        registry.registerAgent(SECURITY_GURU, SECURITY_PRICE);
        
        assertEq(registry.getTotalAgents(), 2);
    }

    function test_RegisterAgent_DuplicateReverts() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(defiOwner);
        vm.expectRevert("Agent already registered");
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
    }

    // ==================== Query Tests ====================

    function test_QueryAgent_Success() public {
        // Register agent
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Query agent
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        // Verify stats updated
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.totalQueries, 1);
        assertEq(agent.earnings, DEFI_PRICE);
    }

    function test_QueryAgent_MultipleQueries() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Query 3 times
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier2);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.totalQueries, 3);
        assertEq(agent.earnings, DEFI_PRICE * 3);
    }

    function test_QueryAgent_InsufficientPaymentReverts() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(querier1);
        vm.expectRevert("Insufficient payment");
        registry.queryAgent{value: DEFI_PRICE / 2}(DEFI_WIZARD);
    }

    function test_QueryAgent_InactiveAgentReverts() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Deactivate agent
        vm.prank(defiOwner);
        registry.updateAgent(DEFI_WIZARD, DEFI_PRICE, false);
        
        // Try to query
        vm.prank(querier1);
        vm.expectRevert("Agent not active");
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
    }

    function test_QueryAgent_ExtraPaymentAccepted() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Query with extra payment
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE * 2}(DEFI_WIZARD);
        
        // Agent should earn the full amount sent
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.earnings, DEFI_PRICE * 2);
    }

    // ==================== Update Tests ====================

    function test_UpdateAgent_PriceChange() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        uint256 newPrice = 0.00005 ether;
        vm.prank(defiOwner);
        registry.updateAgent(DEFI_WIZARD, newPrice, true);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.queryPrice, newPrice);
    }

    function test_UpdateAgent_Deactivation() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(defiOwner);
        registry.updateAgent(DEFI_WIZARD, DEFI_PRICE, false);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertFalse(agent.active);
    }

    function test_UpdateAgent_Reactivation() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Deactivate
        vm.prank(defiOwner);
        registry.updateAgent(DEFI_WIZARD, DEFI_PRICE, false);
        
        // Reactivate
        vm.prank(defiOwner);
        registry.updateAgent(DEFI_WIZARD, DEFI_PRICE, true);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertTrue(agent.active);
    }

    function test_UpdateAgent_OnlyOwnerCanUpdate() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(querier1); // Not the owner
        vm.expectRevert("Not agent owner");
        registry.updateAgent(DEFI_WIZARD, DEFI_PRICE * 2, true);
    }

    // ==================== Withdrawal Tests ====================

    function test_WithdrawEarnings_Success() public {
        // Setup
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        // Withdraw
        uint256 balanceBefore = defiOwner.balance;
        vm.prank(defiOwner);
        registry.withdrawEarnings(DEFI_WIZARD);
        
        assertEq(defiOwner.balance, balanceBefore + DEFI_PRICE);
        
        // Check earnings zeroed
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.earnings, 0);
    }

    function test_WithdrawEarnings_MultipleWithdrawals() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Query twice
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier2);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        // Withdraw all
        uint256 balanceBefore = defiOwner.balance;
        vm.prank(defiOwner);
        registry.withdrawEarnings(DEFI_WIZARD);
        
        assertEq(defiOwner.balance, balanceBefore + (DEFI_PRICE * 2));
    }

    function test_WithdrawEarnings_NoEarningsReverts() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(defiOwner);
        vm.expectRevert("No earnings to withdraw");
        registry.withdrawEarnings(DEFI_WIZARD);
    }

    function test_WithdrawEarnings_OnlyOwnerCanWithdraw() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier2); // Not the owner
        vm.expectRevert("Not agent owner");
        registry.withdrawEarnings(DEFI_WIZARD);
    }

    // ==================== View Function Tests ====================

    function test_GetAgent_ReturnsCorrectData() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.owner, defiOwner);
        assertEq(agent.queryPrice, DEFI_PRICE);
        assertTrue(agent.active);
    }

    function test_GetTotalAgents_CountsCorrectly() public {
        assertEq(registry.getTotalAgents(), 0);
        
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        assertEq(registry.getTotalAgents(), 1);
        
        vm.prank(securityOwner);
        registry.registerAgent(SECURITY_GURU, SECURITY_PRICE);
        assertEq(registry.getTotalAgents(), 2);
    }

    // ==================== Integration Tests ====================

    function test_FullWorkflow_RegisterQueryWithdraw() public {
        // 1. Register two agents
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(securityOwner);
        registry.registerAgent(SECURITY_GURU, SECURITY_PRICE);
        
        assertEq(registry.getTotalAgents(), 2);
        
        // 2. Query both agents multiple times
        vm.prank(querier1);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier2);
        registry.queryAgent{value: DEFI_PRICE}(DEFI_WIZARD);
        
        vm.prank(querier1);
        registry.queryAgent{value: SECURITY_PRICE}(SECURITY_GURU);
        
        // 3. Check stats
        AgentRegistry.Agent memory defi = registry.getAgent(DEFI_WIZARD);
        assertEq(defi.totalQueries, 2);
        assertEq(defi.earnings, DEFI_PRICE * 2);
        
        AgentRegistry.Agent memory security = registry.getAgent(SECURITY_GURU);
        assertEq(security.totalQueries, 1);
        assertEq(security.earnings, SECURITY_PRICE);
        
        // 4. Withdraw earnings
        uint256 defiBalanceBefore = defiOwner.balance;
        vm.prank(defiOwner);
        registry.withdrawEarnings(DEFI_WIZARD);
        assertEq(defiOwner.balance, defiBalanceBefore + (DEFI_PRICE * 2));
        
        uint256 securityBalanceBefore = securityOwner.balance;
        vm.prank(securityOwner);
        registry.withdrawEarnings(SECURITY_GURU);
        assertEq(securityOwner.balance, securityBalanceBefore + SECURITY_PRICE);
    }

    // ==================== Delete Tests ====================

    function test_DeleteAgent_Success() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        assertEq(registry.getTotalAgents(), 1);
        
        vm.prank(defiOwner);
        registry.deleteAgent(DEFI_WIZARD);
        
        assertEq(registry.getTotalAgents(), 0);
    }

    function test_DeleteAgent_OnlyOwnerCanDelete() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(querier1); // Not the owner
        vm.expectRevert("Not agent owner");
        registry.deleteAgent(DEFI_WIZARD);
    }

    function test_DeleteAgent_EmitEvent() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        bytes32 ensHash = keccak256(abi.encodePacked(DEFI_WIZARD));
        
        vm.prank(defiOwner);
        vm.expectEmit(true, true, false, true);
        emit AgentDeleted(ensHash, DEFI_WIZARD, defiOwner);
        registry.deleteAgent(DEFI_WIZARD);
    }

    function test_DeleteAgent_RemovesFromAllMappings() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        vm.prank(securityOwner);
        registry.registerAgent(SECURITY_GURU, SECURITY_PRICE);
        
        assertEq(registry.getTotalAgents(), 2);
        
        // Delete first agent
        vm.prank(defiOwner);
        registry.deleteAgent(DEFI_WIZARD);
        
        assertEq(registry.getTotalAgents(), 1);
        
        // Check that deleted agent is gone
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.owner, address(0));
        
        // Check other agent still exists
        AgentRegistry.Agent memory otherAgent = registry.getAgent(SECURITY_GURU);
        assertEq(otherAgent.owner, securityOwner);
    }

    function test_DeleteAgent_CanReregisterAfterDelete() public {
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
        
        // Delete
        vm.prank(defiOwner);
        registry.deleteAgent(DEFI_WIZARD);
        
        // Re-register
        vm.prank(defiOwner);
        registry.registerAgent(DEFI_WIZARD, DEFI_PRICE * 2);
        
        AgentRegistry.Agent memory agent = registry.getAgent(DEFI_WIZARD);
        assertEq(agent.queryPrice, DEFI_PRICE * 2);
        assertTrue(agent.active);
    }

    event AgentDeleted(bytes32 indexed ensNameHash, string ensName, address indexed owner);
}
