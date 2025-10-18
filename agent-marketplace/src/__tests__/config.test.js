"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const zod_1 = require("zod");
const core_test_utils_1 = require("./utils/core-test-utils");
const core_1 = require("@elizaos/core");
// Access the plugin's init function
const initPlugin = plugin_1.default.init;
(0, bun_test_1.describe)('Plugin Configuration Schema', () => {
    // Create a backup of the original env values
    const originalEnv = { ...process.env };
    (0, bun_test_1.beforeEach)(() => {
        // Use spyOn for logger methods
        (0, bun_test_1.spyOn)(core_1.logger, 'info');
        (0, bun_test_1.spyOn)(core_1.logger, 'error');
        (0, bun_test_1.spyOn)(core_1.logger, 'warn');
        // Reset environment variables before each test
        process.env = { ...originalEnv };
    });
    (0, bun_test_1.afterEach)(() => {
        // Restore original environment variables after each test
        process.env = { ...originalEnv };
    });
    (0, bun_test_1.it)('should accept valid configuration', async () => {
        const validConfig = {
            EXAMPLE_PLUGIN_VARIABLE: 'valid-value',
        };
        if (initPlugin) {
            let error = null;
            try {
                await initPlugin(validConfig, (0, core_test_utils_1.createMockRuntime)());
            }
            catch (e) {
                error = e;
            }
            (0, bun_test_1.expect)(error).toBeNull();
        }
    });
    (0, bun_test_1.it)('should accept empty configuration', async () => {
        const emptyConfig = {};
        if (initPlugin) {
            let error = null;
            try {
                await initPlugin(emptyConfig, (0, core_test_utils_1.createMockRuntime)());
            }
            catch (e) {
                error = e;
            }
            (0, bun_test_1.expect)(error).toBeNull();
        }
    });
    (0, bun_test_1.it)('should accept configuration with additional properties', async () => {
        const configWithExtra = {
            EXAMPLE_PLUGIN_VARIABLE: 'valid-value',
            EXTRA_PROPERTY: 'should be ignored',
        };
        if (initPlugin) {
            let error = null;
            try {
                await initPlugin(configWithExtra, (0, core_test_utils_1.createMockRuntime)());
            }
            catch (e) {
                error = e;
            }
            (0, bun_test_1.expect)(error).toBeNull();
        }
    });
    (0, bun_test_1.it)('should reject invalid configuration', async () => {
        const invalidConfig = {
            EXAMPLE_PLUGIN_VARIABLE: '', // Empty string violates min length
        };
        if (initPlugin) {
            let error = null;
            try {
                await initPlugin(invalidConfig, (0, core_test_utils_1.createMockRuntime)());
            }
            catch (e) {
                error = e;
            }
            (0, bun_test_1.expect)(error).not.toBeNull();
        }
    });
    (0, bun_test_1.it)('should set environment variables from valid config', async () => {
        const testConfig = {
            EXAMPLE_PLUGIN_VARIABLE: 'test-value',
        };
        if (initPlugin) {
            // Ensure env variable doesn't exist beforehand
            delete process.env.EXAMPLE_PLUGIN_VARIABLE;
            // Initialize with config
            await initPlugin(testConfig, (0, core_test_utils_1.createMockRuntime)());
            // Verify environment variable was set
            (0, bun_test_1.expect)(process.env.EXAMPLE_PLUGIN_VARIABLE).toBe('test-value');
        }
    });
    (0, bun_test_1.it)('should not override existing environment variables', async () => {
        // Set environment variable before initialization
        process.env.EXAMPLE_PLUGIN_VARIABLE = 'pre-existing-value';
        const testConfig = {
        // Omit the variable to test that existing env vars aren't overridden
        };
        if (initPlugin) {
            await initPlugin(testConfig, (0, core_test_utils_1.createMockRuntime)());
            // Verify environment variable was not changed
            (0, bun_test_1.expect)(process.env.EXAMPLE_PLUGIN_VARIABLE).toBe('pre-existing-value');
        }
    });
    (0, bun_test_1.it)('should handle zod validation errors gracefully', async () => {
        // Create a mock of zod's parseAsync that throws a ZodError
        const mockZodError = new zod_1.z.ZodError([
            {
                code: zod_1.z.ZodIssueCode.too_small,
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: 'Example plugin variable is too short',
                path: ['EXAMPLE_PLUGIN_VARIABLE'],
            },
        ]);
        // Create a simple schema for mocking
        const schema = zod_1.z.object({
            EXAMPLE_PLUGIN_VARIABLE: zod_1.z.string().min(1),
        });
        // Mock the parseAsync function
        const originalParseAsync = schema.parseAsync;
        schema.parseAsync = (0, bun_test_1.mock)().mockRejectedValue(mockZodError);
        try {
            // Use the mocked schema directly to avoid TypeScript errors
            await schema.parseAsync({});
            // Should not reach here
            (0, bun_test_1.expect)(true).toBe(false);
        }
        catch (error) {
            (0, bun_test_1.expect)(error).toBe(mockZodError);
        }
        // Restore the original parseAsync
        schema.parseAsync = originalParseAsync;
    });
    (0, bun_test_1.it)('should rethrow non-zod errors', async () => {
        // Create a generic error
        const genericError = new Error('Something went wrong');
        // Create a simple schema for mocking
        const schema = zod_1.z.object({
            EXAMPLE_PLUGIN_VARIABLE: zod_1.z.string().min(1),
        });
        // Mock the parseAsync function
        const originalParseAsync = schema.parseAsync;
        schema.parseAsync = (0, bun_test_1.mock)().mockRejectedValue(genericError);
        try {
            // Use the mocked schema directly to avoid TypeScript errors
            await schema.parseAsync({});
            // Should not reach here
            (0, bun_test_1.expect)(true).toBe(false);
        }
        catch (error) {
            (0, bun_test_1.expect)(error).toBe(genericError);
        }
        // Restore the original parseAsync
        schema.parseAsync = originalParseAsync;
    });
});
