"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const core_1 = require("@elizaos/core");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
// Setup environment variables
dotenv_1.default.config();
// Set up logging to capture issues
(0, bun_test_1.beforeAll)(() => {
    (0, bun_test_1.spyOn)(core_1.logger, 'info');
    (0, bun_test_1.spyOn)(core_1.logger, 'error');
    (0, bun_test_1.spyOn)(core_1.logger, 'warn');
    (0, bun_test_1.spyOn)(core_1.logger, 'debug');
});
(0, bun_test_1.afterAll)(() => {
    // No global restore needed in bun:test;
});
// Helper function to document test results
function documentTestResult(testName, result, error = null) {
    // Clean, useful test documentation for developers
    core_1.logger.info(`✓ Testing: ${testName}`);
    if (error) {
        core_1.logger.error(`✗ Error: ${error.message}`);
        if (error.stack) {
            core_1.logger.error(`Stack: ${error.stack}`);
        }
        return;
    }
    if (result) {
        if (typeof result === 'string') {
            if (result.trim() && result.length > 0) {
                const preview = result.length > 60 ? `${result.substring(0, 60)}...` : result;
                core_1.logger.info(`  → ${preview}`);
            }
        }
        else if (typeof result === 'object') {
            try {
                // Show key information in a clean format
                const keys = Object.keys(result);
                if (keys.length > 0) {
                    const preview = keys.slice(0, 3).join(', ');
                    const more = keys.length > 3 ? ` +${keys.length - 3} more` : '';
                    core_1.logger.info(`  → {${preview}${more}}`);
                }
            }
            catch (e) {
                core_1.logger.info(`  → [Complex object]`);
            }
        }
    }
}
// Create a realistic runtime for testing
function createRealRuntime() {
    return {
        character: {
            name: 'Test Character',
            system: 'You are a helpful assistant for testing.',
            plugins: [],
            settings: {},
        },
        getSetting: (key) => null,
        models: plugin_1.default.models,
        db: {
            get: async (key) => {
                return null;
            },
            set: async (key, value) => {
                return true;
            },
            delete: async (key) => {
                return true;
            },
            getKeys: async (pattern) => {
                return [];
            },
        },
        memory: {
            add: async (memory) => {
                // Memory operations for testing
            },
            get: async (id) => {
                return null;
            },
            getByEntityId: async (entityId) => {
                return [];
            },
            getLatest: async (entityId) => {
                return null;
            },
            getRecentMessages: async (options) => {
                return [];
            },
            search: async (query) => {
                return [];
            },
        },
        getService: (serviceType) => {
            return null;
        },
    };
}
// Create realistic memory object
function createRealMemory() {
    const entityId = (0, uuid_1.v4)();
    const roomId = (0, uuid_1.v4)();
    return {
        id: (0, uuid_1.v4)(),
        entityId,
        roomId,
        timestamp: Date.now(),
        content: {
            text: 'What can you provide?',
            source: 'test',
            actions: [],
        },
        metadata: {
            type: 'custom',
            sessionId: (0, uuid_1.v4)(),
            conversationId: (0, uuid_1.v4)(),
        },
    };
}
(0, bun_test_1.describe)('Provider Tests', () => {
    // Find the HELLO_WORLD_PROVIDER from the providers array
    const helloWorldProvider = plugin_1.default.providers?.find((provider) => provider.name === 'HELLO_WORLD_PROVIDER');
    (0, bun_test_1.describe)('HELLO_WORLD_PROVIDER', () => {
        (0, bun_test_1.it)('should exist in the plugin', () => {
            (0, bun_test_1.expect)(plugin_1.default.providers).toBeDefined();
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.providers)).toBe(true);
            if (plugin_1.default.providers) {
                (0, bun_test_1.expect)(plugin_1.default.providers.length).toBeGreaterThan(0);
                const result = plugin_1.default.providers.find((p) => p.name === 'HELLO_WORLD_PROVIDER');
                (0, bun_test_1.expect)(result).toBeDefined();
                documentTestResult('Provider exists check', {
                    found: !!result,
                    providers: plugin_1.default.providers.map((p) => p.name),
                });
            }
        });
        (0, bun_test_1.it)('should have the correct structure', () => {
            if (helloWorldProvider) {
                (0, bun_test_1.expect)(helloWorldProvider).toHaveProperty('name', 'HELLO_WORLD_PROVIDER');
                (0, bun_test_1.expect)(helloWorldProvider).toHaveProperty('description');
                (0, bun_test_1.expect)(helloWorldProvider).toHaveProperty('get');
                (0, bun_test_1.expect)(typeof helloWorldProvider.get).toBe('function');
                documentTestResult('Provider structure check', {
                    name: helloWorldProvider.name,
                    description: helloWorldProvider.description,
                    hasGetMethod: typeof helloWorldProvider.get === 'function',
                });
            }
        });
        (0, bun_test_1.it)('should have a description explaining its purpose', () => {
            if (helloWorldProvider && helloWorldProvider.description) {
                (0, bun_test_1.expect)(typeof helloWorldProvider.description).toBe('string');
                (0, bun_test_1.expect)(helloWorldProvider.description.length).toBeGreaterThan(0);
                documentTestResult('Provider description check', {
                    description: helloWorldProvider.description,
                });
            }
        });
        (0, bun_test_1.it)('should return provider data from the get method', async () => {
            if (helloWorldProvider) {
                const runtime = createRealRuntime();
                const message = createRealMemory();
                const state = {
                    values: { example: 'test value' },
                    data: { additionalContext: 'some context' },
                    text: 'Current state context',
                };
                let result = null;
                let error = null;
                try {
                    core_1.logger.info('Calling provider.get with real implementation');
                    result = await helloWorldProvider.get(runtime, message, state);
                    (0, bun_test_1.expect)(result).toBeDefined();
                    (0, bun_test_1.expect)(result).toHaveProperty('text');
                    (0, bun_test_1.expect)(result).toHaveProperty('values');
                    (0, bun_test_1.expect)(result).toHaveProperty('data');
                    // Look for potential issues in the result
                    if (result && (!result.text || result.text.length === 0)) {
                        core_1.logger.warn('Provider returned empty text');
                    }
                    if (result && Object.keys(result.values).length === 0) {
                        core_1.logger.warn('Provider returned empty values object');
                    }
                    if (result && Object.keys(result.data).length === 0) {
                        core_1.logger.warn('Provider returned empty data object');
                    }
                }
                catch (e) {
                    error = e;
                    core_1.logger.error({ error: e }, 'Error in provider.get:');
                }
                documentTestResult('Provider get method', result, error);
            }
        });
        (0, bun_test_1.it)('should handle error conditions gracefully', async () => {
            if (helloWorldProvider) {
                const runtime = createRealRuntime();
                // Create an invalid memory object to simulate an error scenario
                const invalidMemory = {
                    // Missing properties that would be required
                    id: (0, uuid_1.v4)(),
                };
                const state = {
                    values: {},
                    data: {},
                    text: '',
                };
                let result = null;
                let error = null;
                try {
                    core_1.logger.info('Calling provider.get with invalid memory object');
                    result = await helloWorldProvider.get(runtime, invalidMemory, state);
                    // Even with invalid input, it should not throw errors
                    (0, bun_test_1.expect)(result).toBeDefined();
                    // Log what actual implementation does with invalid input
                    core_1.logger.info('Provider handled invalid input without throwing');
                }
                catch (e) {
                    error = e;
                    core_1.logger.error({ error: e }, 'Provider threw an error with invalid input:');
                }
                documentTestResult('Provider error handling', result, error);
            }
        });
    });
    (0, bun_test_1.describe)('Provider Registration', () => {
        (0, bun_test_1.it)('should include providers in the plugin definition', () => {
            (0, bun_test_1.expect)(plugin_1.default).toHaveProperty('providers');
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.providers)).toBe(true);
            documentTestResult('Plugin providers check', {
                hasProviders: !!plugin_1.default.providers,
                providersCount: plugin_1.default.providers?.length || 0,
            });
        });
        (0, bun_test_1.it)('should correctly initialize providers array', () => {
            // Providers should be an array with at least one provider
            if (plugin_1.default.providers) {
                (0, bun_test_1.expect)(plugin_1.default.providers.length).toBeGreaterThan(0);
                let allValid = true;
                const invalidProviders = [];
                // Each provider should have the required structure
                plugin_1.default.providers.forEach((provider) => {
                    const isValid = provider.name !== undefined &&
                        provider.description !== undefined &&
                        typeof provider.get === 'function';
                    if (!isValid) {
                        allValid = false;
                        invalidProviders.push(provider.name || 'unnamed');
                    }
                    (0, bun_test_1.expect)(provider).toHaveProperty('name');
                    (0, bun_test_1.expect)(provider).toHaveProperty('description');
                    (0, bun_test_1.expect)(provider).toHaveProperty('get');
                    (0, bun_test_1.expect)(typeof provider.get).toBe('function');
                });
                documentTestResult('Provider initialization check', {
                    providersCount: plugin_1.default.providers.length,
                    allValid,
                    invalidProviders,
                });
            }
        });
        (0, bun_test_1.it)('should have unique provider names', () => {
            if (plugin_1.default.providers) {
                const providerNames = plugin_1.default.providers.map((provider) => provider.name);
                const uniqueNames = new Set(providerNames);
                const duplicates = providerNames.filter((name, index) => providerNames.indexOf(name) !== index);
                // There should be no duplicate provider names
                (0, bun_test_1.expect)(providerNames.length).toBe(uniqueNames.size);
                documentTestResult('Provider uniqueness check', {
                    totalProviders: providerNames.length,
                    uniqueProviders: uniqueNames.size,
                    duplicates,
                });
            }
        });
    });
});
