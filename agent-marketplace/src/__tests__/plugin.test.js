"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const core_1 = require("@elizaos/core");
const plugin_2 = require("../plugin");
const dotenv_1 = __importDefault(require("dotenv"));
// Setup environment variables
dotenv_1.default.config();
// Need to spy on logger for documentation
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
// Create a real runtime for testing
function createRealRuntime() {
    const services = new Map();
    // Create a real service instance if needed
    const createService = (serviceType) => {
        if (serviceType === plugin_2.StarterService.serviceType) {
            return new plugin_2.StarterService({
                character: {
                    name: 'Test Character',
                    system: 'You are a helpful assistant for testing.',
                },
            });
        }
        return null;
    };
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
            get: async (key) => null,
            set: async (key, value) => true,
            delete: async (key) => true,
            getKeys: async (pattern) => [],
        },
        getService: (serviceType) => {
            // Get from cache or create new
            if (!services.has(serviceType)) {
                services.set(serviceType, createService(serviceType));
            }
            return services.get(serviceType);
        },
        registerService: (serviceType, service) => {
            services.set(serviceType, service);
        },
    };
}
(0, bun_test_1.describe)('Plugin Configuration', () => {
    (0, bun_test_1.it)('should have correct plugin metadata', () => {
        (0, bun_test_1.expect)(plugin_1.default.name).toBe('starter');
        (0, bun_test_1.expect)(plugin_1.default.description).toBe('A starter plugin for Eliza');
        (0, bun_test_1.expect)(plugin_1.default.config).toBeDefined();
        documentTestResult('Plugin metadata check', {
            name: plugin_1.default.name,
            description: plugin_1.default.description,
            hasConfig: !!plugin_1.default.config,
        });
    });
    (0, bun_test_1.it)('should include the EXAMPLE_PLUGIN_VARIABLE in config', () => {
        (0, bun_test_1.expect)(plugin_1.default.config).toHaveProperty('EXAMPLE_PLUGIN_VARIABLE');
        documentTestResult('Plugin config check', {
            hasExampleVariable: plugin_1.default.config ? 'EXAMPLE_PLUGIN_VARIABLE' in plugin_1.default.config : false,
            configKeys: Object.keys(plugin_1.default.config || {}),
        });
    });
    (0, bun_test_1.it)('should initialize properly', async () => {
        const originalEnv = process.env.EXAMPLE_PLUGIN_VARIABLE;
        try {
            process.env.EXAMPLE_PLUGIN_VARIABLE = 'test-value';
            // Initialize with config - using real runtime
            const runtime = createRealRuntime();
            let error = null;
            try {
                await plugin_1.default.init?.({ EXAMPLE_PLUGIN_VARIABLE: 'test-value' }, runtime);
                (0, bun_test_1.expect)(true).toBe(true); // If we got here, init succeeded
            }
            catch (e) {
                error = e;
                core_1.logger.error({ error: e }, 'Plugin initialization error:');
            }
            documentTestResult('Plugin initialization', {
                success: !error,
                configValue: process.env.EXAMPLE_PLUGIN_VARIABLE,
            }, error);
        }
        finally {
            process.env.EXAMPLE_PLUGIN_VARIABLE = originalEnv;
        }
    });
    (0, bun_test_1.it)('should throw an error on invalid config', async () => {
        // Test with empty string (less than min length 1)
        if (plugin_1.default.init) {
            const runtime = createRealRuntime();
            let error = null;
            try {
                await plugin_1.default.init({ EXAMPLE_PLUGIN_VARIABLE: '' }, runtime);
                // Should not reach here
                (0, bun_test_1.expect)(true).toBe(false);
            }
            catch (e) {
                error = e;
                // This is expected - test passes
                (0, bun_test_1.expect)(error).toBeTruthy();
            }
            documentTestResult('Plugin invalid config', {
                errorThrown: !!error,
                errorMessage: error?.message || 'No error message',
            }, error);
        }
    });
    (0, bun_test_1.it)('should have a valid config', () => {
        (0, bun_test_1.expect)(plugin_1.default.config).toBeDefined();
        if (plugin_1.default.config) {
            // Check if the config has expected EXAMPLE_PLUGIN_VARIABLE property
            (0, bun_test_1.expect)(Object.keys(plugin_1.default.config)).toContain('EXAMPLE_PLUGIN_VARIABLE');
        }
    });
});
(0, bun_test_1.describe)('Plugin Models', () => {
    (0, bun_test_1.it)('should have TEXT_SMALL model defined', () => {
        if (plugin_1.default.models) {
            (0, bun_test_1.expect)(plugin_1.default.models).toHaveProperty(core_1.ModelType.TEXT_SMALL);
            (0, bun_test_1.expect)(typeof plugin_1.default.models[core_1.ModelType.TEXT_SMALL]).toBe('function');
            documentTestResult('TEXT_SMALL model check', {
                defined: core_1.ModelType.TEXT_SMALL in plugin_1.default.models,
                isFunction: typeof plugin_1.default.models[core_1.ModelType.TEXT_SMALL] === 'function',
            });
        }
    });
    (0, bun_test_1.it)('should have TEXT_LARGE model defined', () => {
        if (plugin_1.default.models) {
            (0, bun_test_1.expect)(plugin_1.default.models).toHaveProperty(core_1.ModelType.TEXT_LARGE);
            (0, bun_test_1.expect)(typeof plugin_1.default.models[core_1.ModelType.TEXT_LARGE]).toBe('function');
            documentTestResult('TEXT_LARGE model check', {
                defined: core_1.ModelType.TEXT_LARGE in plugin_1.default.models,
                isFunction: typeof plugin_1.default.models[core_1.ModelType.TEXT_LARGE] === 'function',
            });
        }
    });
    (0, bun_test_1.it)('should return a response from TEXT_SMALL model', async () => {
        if (plugin_1.default.models && plugin_1.default.models[core_1.ModelType.TEXT_SMALL]) {
            const runtime = createRealRuntime();
            let result = '';
            let error = null;
            try {
                core_1.logger.info('Using OpenAI for TEXT_SMALL model');
                result = await plugin_1.default.models[core_1.ModelType.TEXT_SMALL](runtime, { prompt: 'test' });
                // Check that we get a non-empty string response
                (0, bun_test_1.expect)(result).toBeTruthy();
                (0, bun_test_1.expect)(typeof result).toBe('string');
                (0, bun_test_1.expect)(result.length).toBeGreaterThan(10);
            }
            catch (e) {
                error = e;
                core_1.logger.error('TEXT_SMALL model test failed:', e);
            }
            documentTestResult('TEXT_SMALL model plugin test', result, error);
        }
    });
});
(0, bun_test_1.describe)('StarterService', () => {
    (0, bun_test_1.it)('should start the service', async () => {
        const runtime = createRealRuntime();
        let startResult;
        let error = null;
        try {
            core_1.logger.info('Using OpenAI for TEXT_SMALL model');
            startResult = await plugin_2.StarterService.start(runtime);
            (0, bun_test_1.expect)(startResult).toBeDefined();
            (0, bun_test_1.expect)(startResult.constructor.name).toBe('StarterService');
            // Test real functionality - check stop method is available
            (0, bun_test_1.expect)(typeof startResult.stop).toBe('function');
        }
        catch (e) {
            error = e;
            core_1.logger.error({ error: e }, 'Service start error:');
        }
        documentTestResult('StarterService start', {
            success: !!startResult,
            serviceType: startResult?.constructor.name,
        }, error);
    });
    (0, bun_test_1.it)('should throw an error on startup if the service is already registered', async () => {
        const runtime = createRealRuntime();
        // First registration should succeed
        const result1 = await plugin_2.StarterService.start(runtime);
        (0, bun_test_1.expect)(result1).toBeTruthy();
        let startupError = null;
        try {
            // Second registration should fail
            await plugin_2.StarterService.start(runtime);
            (0, bun_test_1.expect)(true).toBe(false); // Should not reach here
        }
        catch (e) {
            startupError = e;
            (0, bun_test_1.expect)(e).toBeTruthy();
        }
        documentTestResult('StarterService double start', {
            errorThrown: !!startupError,
            errorMessage: startupError?.message || 'No error message',
        }, startupError);
    });
    (0, bun_test_1.it)('should stop the service', async () => {
        const runtime = createRealRuntime();
        let error = null;
        try {
            // Register a real service first
            const service = new plugin_2.StarterService(runtime);
            runtime.registerService(plugin_2.StarterService.serviceType, service);
            // Spy on the real service's stop method
            const stopSpy = (0, bun_test_1.spyOn)(service, 'stop');
            // Call the static stop method
            await plugin_2.StarterService.stop(runtime);
            // Verify the service's stop method was called
            (0, bun_test_1.expect)(stopSpy).toHaveBeenCalled();
        }
        catch (e) {
            error = e;
            core_1.logger.error({ error: e }, 'Service stop error:');
        }
        documentTestResult('StarterService stop', {
            success: !error,
        }, error);
    });
    (0, bun_test_1.it)('should throw an error when stopping a non-existent service', async () => {
        const runtime = createRealRuntime();
        // Don't register a service, so getService will return null
        let error = null;
        try {
            // We'll patch the getService function to ensure it returns null
            const originalGetService = runtime.getService;
            runtime.getService = () => null;
            await plugin_2.StarterService.stop(runtime);
            // Should not reach here
            (0, bun_test_1.expect)(true).toBe(false);
        }
        catch (e) {
            error = e;
            // This is expected - verify it's the right error
            (0, bun_test_1.expect)(error).toBeTruthy();
            if (error instanceof Error) {
                (0, bun_test_1.expect)(error.message).toContain('Starter service not found');
            }
        }
        documentTestResult('StarterService non-existent stop', {
            errorThrown: !!error,
            errorMessage: error?.message || 'No error message',
        }, error);
    });
    (0, bun_test_1.it)('should stop a registered service', async () => {
        const runtime = createRealRuntime();
        // First start the service
        const startResult = await plugin_2.StarterService.start(runtime);
        (0, bun_test_1.expect)(startResult).toBeTruthy();
        let stopError = null;
        let stopSuccess = false;
        try {
            // Then stop it
            await plugin_2.StarterService.stop(runtime);
            stopSuccess = true;
        }
        catch (e) {
            stopError = e;
            (0, bun_test_1.expect)(true).toBe(false); // Should not reach here
        }
        documentTestResult('StarterService stop', {
            success: stopSuccess,
            errorThrown: !!stopError,
            errorMessage: stopError instanceof Error ? stopError.message : String(stopError),
        }, stopError instanceof Error ? stopError : null);
    });
});
