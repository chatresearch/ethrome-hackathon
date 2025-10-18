# 🧪 Testing Guide

## Test Framework: Foundry (Forge)

We use **Foundry's Forge** for smart contract testing - it's fast, written in Rust, and tests are written in Solidity.

---

## Running Tests

### Run All Tests

```bash
cd packages/foundry

# Run all tests
forge test

# Run with verbose output (shows gas usage)
forge test -v

# Run with very verbose output (shows all trace details)
forge test -vv

# Run specific test
forge test --match test_QueryAgent_Success
```

### Run Tests with Gas Reports

```bash
# Show gas usage per test
forge test -v

# Run specific test and show gas
forge test -v --match test_FullWorkflow_RegisterQueryWithdraw
```

### Watch Mode (Rerun on file changes)

```bash
forge test --watch
```

---

## Test Coverage

Our test suite includes **19 comprehensive tests** covering:

### Registration Tests (3)
- ✅ `test_RegisterAgent_Success` - Register a new agent
- ✅ `test_RegisterAgent_MultipleAgents` - Register multiple agents
- ✅ `test_RegisterAgent_DuplicateReverts` - Cannot register duplicate agent name

### Query Tests (5)
- ✅ `test_QueryAgent_Success` - Query agent and pay
- ✅ `test_QueryAgent_MultipleQueries` - Multiple queries accumulate earnings
- ✅ `test_QueryAgent_InsufficientPaymentReverts` - Payment must meet minimum
- ✅ `test_QueryAgent_InactiveAgentReverts` - Cannot query inactive agent
- ✅ `test_QueryAgent_ExtraPaymentAccepted` - Extra payments are accepted

### Update Tests (4)
- ✅ `test_UpdateAgent_PriceChange` - Update agent price
- ✅ `test_UpdateAgent_Deactivation` - Deactivate agent
- ✅ `test_UpdateAgent_Reactivation` - Reactivate agent
- ✅ `test_UpdateAgent_OnlyOwnerCanUpdate` - Only owner can update

### Withdrawal Tests (4)
- ✅ `test_WithdrawEarnings_Success` - Withdraw accumulated earnings
- ✅ `test_WithdrawEarnings_MultipleWithdrawals` - Multiple earnings withdrawals
- ✅ `test_WithdrawEarnings_NoEarningsReverts` - Cannot withdraw zero earnings
- ✅ `test_WithdrawEarnings_OnlyOwnerCanWithdraw` - Only owner can withdraw

### View Function Tests (2)
- ✅ `test_GetAgent_ReturnsCorrectData` - Get agent data
- ✅ `test_GetTotalAgents_CountsCorrectly` - Count total agents

### Integration Tests (1)
- ✅ `test_FullWorkflow_RegisterQueryWithdraw` - Complete workflow test

---

## Test File Location

```
packages/foundry/test/AgentRegistry.t.sol
```

## Key Test Concepts

### Setup

```solidity
function setUp() public {
    registry = new AgentRegistry();
    vm.deal(defiOwner, 10 ether);  // Fund test accounts
}
```

### Impersonation (vm.prank)

```solidity
vm.prank(defiOwner);
registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);
```

### Assertions

```solidity
assertEq(actual, expected);          // Equal
assertTrue(condition);               // Is true
assertFalse(condition);              // Is false
```

### Revert Testing

```solidity
vm.expectRevert("Error message");
registry.registerAgent(DEFI_WIZARD, DEFI_PRICE);  // Should revert with message
```

### Funding Accounts

```solidity
vm.deal(querier1, 1 ether);  // Give test account 1 ETH
```

---

## Example Test Run Output

```
Ran 19 tests for test/AgentRegistry.t.sol:AgentRegistryTest
[PASS] test_FullWorkflow_RegisterQueryWithdraw() (gas: 532895)
[PASS] test_GetAgent_ReturnsCorrectData() (gas: 227130)
[PASS] test_GetTotalAgents_CountsCorrectly() (gas: 415311)
...
Suite result: ok. 19 passed; 0 failed; 0 skipped
```

---

## Test Agents

Both tests use our real agent names:
- **DeFi Wizard**: `defi-wizard.aiconfig.eth` (0.00001 ETH per query)
- **Security Guru**: `security-guru.aiconfig.eth` (0.00001 ETH per query)

---

## Debugging Failed Tests

### Run with Trace

```bash
forge test -vv --match test_QueryAgent_Success
```

### Run specific test only

```bash
forge test --match test_RegisterAgent_Success
```

### Get detailed error

```bash
forge test -vvv --match test_QueryAgent_InsufficientPaymentReverts
```

---

## Gas Optimization

The test output shows gas used per test. Lower gas = better optimized:

```
[PASS] test_RegisterAgent_Success() (gas: 227240)    ← 227k gas
[PASS] test_QueryAgent_Success() (gas: 281061)       ← 281k gas
```

Look for optimization opportunities in high-gas tests.

---

## CI/CD Integration

For automated testing on push:

```bash
# Quick check before committing
forge test

# Full test suite with gas report
forge test -v
```

---

## Next Steps

1. **Run the tests**:
   ```bash
   cd packages/foundry && forge test -v
   ```

2. **Review test output** to ensure all pass

3. **Check gas usage** - aim to optimize high-cost operations

4. **Add more tests** for:
   - New features
   - Edge cases
   - Security concerns

---

## Related Documents

- [QUICKSTART.md](./QUICKSTART.md) - Overall project guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [Foundry Book](https://book.getfoundry.sh) - Official Forge documentation
