import { resolveAgentCapabilities, routeByCapabilities } from "./ens-resolver.js";
const results = [];
async function test(name, fn, details) {
    try {
        const passed = await fn();
        results.push({ name, passed, details });
        const status = passed ? "✓" : "✗";
        console.log(`${status} ${name}: ${details}`);
    }
    catch (error) {
        results.push({ name, passed: false, details: `Error: ${String(error)}` });
        console.log(`✗ ${name}: ${error}`);
    }
}
async function runTests() {
    console.log("=== XMTP Agent ENS Resolver Tests (Real ENS Only) ===\n");
    await test("DeFi Routing", async () => {
        const route = await routeByCapabilities("What is the best yield farming protocol?");
        return route === "defi-wizard";
    }, "Routes 'yield farming' to defi-wizard");
    await test("Security Routing", async () => {
        const route = await routeByCapabilities("How do I check for reentrancy vulnerabilities?");
        return route === "security-guru";
    }, "Routes 'reentrancy' to security-guru");
    await test("Default Routing", async () => {
        const route = await routeByCapabilities("Tell me a joke");
        return route === "defi-wizard";
    }, "Routes unknown queries to defi-wizard");
    await test("DeFi Keywords", async () => {
        const keywords = ["defi", "yield", "farming", "apy", "liquidity", "tvl", "protocol", "pool"];
        for (const keyword of keywords) {
            const route = await routeByCapabilities(`This mentions ${keyword}`);
            if (route !== "defi-wizard")
                return false;
        }
        return true;
    }, "All DeFi keywords route correctly");
    await test("Security Keywords", async () => {
        const keywords = ["security", "contract", "vulnerability", "audit", "exploit", "reentrancy", "overflow", "access"];
        for (const keyword of keywords) {
            const route = await routeByCapabilities(`This mentions ${keyword}`);
            if (route !== "security-guru")
                return false;
        }
        return true;
    }, "All security keywords route correctly");
    await test("ENS Resolution - DeFi Wizard", async () => {
        const caps = await resolveAgentCapabilities("defi-wizard");
        if (!caps) {
            throw new Error("Failed to resolve defi-wizard from ENS. Verify ENS text records set on Sepolia.");
        }
        return caps.name === "defi-wizard" && caps.capabilities.length > 0;
    }, "Resolves defi-wizard capabilities from ENS (REAL)");
    await test("ENS Resolution - Security Guru", async () => {
        const caps = await resolveAgentCapabilities("security-guru");
        if (!caps) {
            throw new Error("Failed to resolve security-guru from ENS. Verify ENS text records set on Sepolia.");
        }
        return caps.name === "security-guru" && caps.capabilities.length > 0;
    }, "Resolves security-guru capabilities from ENS (REAL)");
    await test("Type Safety", async () => {
        const route1 = await routeByCapabilities("liquidity");
        const route2 = await routeByCapabilities("audit");
        return route1 === "defi-wizard" && route2 === "security-guru";
    }, "Type system enforces correct agent types");
    console.log("\n=== Test Summary ===");
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);
    if (passed === total) {
        console.log("All tests passed!");
        process.exit(0);
    }
    else {
        console.log("Some tests failed!");
        process.exit(1);
    }
}
runTests();
