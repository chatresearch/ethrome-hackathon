"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const core_1 = require("@elizaos/core");
const dotenv_1 = __importDefault(require("dotenv"));
const core_test_utils_1 = require("./utils/core-test-utils");
// Setup environment variables
dotenv_1.default.config();
// Spy on logger to capture logs for documentation
(0, bun_test_1.beforeAll)(() => {
    (0, bun_test_1.spyOn)(core_1.logger, 'info');
    (0, bun_test_1.spyOn)(core_1.logger, 'error');
    (0, bun_test_1.spyOn)(core_1.logger, 'warn');
});
(0, bun_test_1.afterAll)(() => {
    // No global restore needed in bun:test;
});
(0, bun_test_1.describe)('Actions', () => {
    // Find the HELLO_WORLD action from the plugin
    const helloWorldAction = plugin_1.default.actions?.find((action) => action.name === 'HELLO_WORLD');
    // Run core tests on all plugin actions
    (0, bun_test_1.it)('should pass core action tests', () => {
        if (plugin_1.default.actions) {
            const coreTestResults = (0, core_test_utils_1.runCoreActionTests)(plugin_1.default.actions);
            (0, bun_test_1.expect)(coreTestResults).toBeDefined();
            (0, bun_test_1.expect)(coreTestResults.formattedNames).toBeDefined();
            (0, bun_test_1.expect)(coreTestResults.formattedActions).toBeDefined();
            (0, bun_test_1.expect)(coreTestResults.composedExamples).toBeDefined();
            // Document the core test results
            (0, core_test_utils_1.documentTestResult)('Core Action Tests', coreTestResults);
        }
    });
    (0, bun_test_1.describe)('HELLO_WORLD Action', () => {
        (0, bun_test_1.it)('should exist in the plugin', () => {
            (0, bun_test_1.expect)(helloWorldAction).toBeDefined();
        });
        (0, bun_test_1.it)('should have the correct structure', () => {
            if (helloWorldAction) {
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('name', 'HELLO_WORLD');
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('description');
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('similes');
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('validate');
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('handler');
                (0, bun_test_1.expect)(helloWorldAction).toHaveProperty('examples');
                (0, bun_test_1.expect)(Array.isArray(helloWorldAction.similes)).toBe(true);
                (0, bun_test_1.expect)(Array.isArray(helloWorldAction.examples)).toBe(true);
            }
        });
        (0, bun_test_1.it)('should have GREET and SAY_HELLO as similes', () => {
            if (helloWorldAction) {
                (0, bun_test_1.expect)(helloWorldAction.similes).toContain('GREET');
                (0, bun_test_1.expect)(helloWorldAction.similes).toContain('SAY_HELLO');
            }
        });
        (0, bun_test_1.it)('should have at least one example', () => {
            if (helloWorldAction && helloWorldAction.examples) {
                (0, bun_test_1.expect)(helloWorldAction.examples.length).toBeGreaterThan(0);
                // Check first example structure
                const firstExample = helloWorldAction.examples[0];
                (0, bun_test_1.expect)(firstExample.length).toBeGreaterThan(1); // At least two messages
                // First message should be a request
                (0, bun_test_1.expect)(firstExample[0]).toHaveProperty('name');
                (0, bun_test_1.expect)(firstExample[0]).toHaveProperty('content');
                (0, bun_test_1.expect)(firstExample[0].content).toHaveProperty('text');
                (0, bun_test_1.expect)(firstExample[0].content.text).toContain('hello');
                // Second message should be a response
                (0, bun_test_1.expect)(firstExample[1]).toHaveProperty('name');
                (0, bun_test_1.expect)(firstExample[1]).toHaveProperty('content');
                (0, bun_test_1.expect)(firstExample[1].content).toHaveProperty('text');
                (0, bun_test_1.expect)(firstExample[1].content).toHaveProperty('actions');
                (0, bun_test_1.expect)(firstExample[1].content.text).toBe('hello world!');
                (0, bun_test_1.expect)(firstExample[1].content.actions).toContain('HELLO_WORLD');
            }
        });
        (0, bun_test_1.it)('should return true from validate function', async () => {
            if (helloWorldAction) {
                const runtime = (0, core_test_utils_1.createMockRuntime)();
                const mockMessage = (0, core_test_utils_1.createMockMessage)('Hello!');
                const mockState = (0, core_test_utils_1.createMockState)();
                let result = false;
                let error = null;
                try {
                    result = await helloWorldAction.validate(runtime, mockMessage, mockState);
                    (0, bun_test_1.expect)(result).toBe(true);
                }
                catch (e) {
                    error = e;
                    core_1.logger.error({ error: e }, 'Validate function error:');
                }
                (0, core_test_utils_1.documentTestResult)('HELLO_WORLD action validate', result, error);
            }
        });
        (0, bun_test_1.it)('should call back with hello world response from handler', async () => {
            if (helloWorldAction) {
                const runtime = (0, core_test_utils_1.createMockRuntime)();
                const mockMessage = (0, core_test_utils_1.createMockMessage)('Hello!');
                const mockState = (0, core_test_utils_1.createMockState)();
                let callbackResponse = {};
                let error = null;
                const mockCallback = (response) => {
                    callbackResponse = response;
                };
                try {
                    await helloWorldAction.handler(runtime, mockMessage, mockState, {}, mockCallback, []);
                    // Verify callback was called with the right content
                    (0, bun_test_1.expect)(callbackResponse).toBeTruthy();
                    (0, bun_test_1.expect)(callbackResponse).toHaveProperty('text');
                    (0, bun_test_1.expect)(callbackResponse).toHaveProperty('actions');
                    (0, bun_test_1.expect)(callbackResponse.actions).toContain('HELLO_WORLD');
                    (0, bun_test_1.expect)(callbackResponse).toHaveProperty('source', 'test');
                }
                catch (e) {
                    error = e;
                    core_1.logger.error({ error: e }, 'Handler function error:');
                }
                (0, core_test_utils_1.documentTestResult)('HELLO_WORLD action handler', callbackResponse, error);
            }
        });
    });
});
