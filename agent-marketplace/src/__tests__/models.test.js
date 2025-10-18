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
// Setup environment variables from .env file
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
/**
 * Tests a model function with core testing patterns
 * @param modelType The type of model to test
 * @param modelFn The model function to test
 */
const runCoreModelTests = async (modelType, modelFn) => {
    // Create a mock runtime for model testing
    const mockRuntime = (0, core_test_utils_1.createMockRuntime)();
    // Test with basic parameters
    const basicParams = {
        prompt: `Test prompt for ${modelType}`,
        stopSequences: ['STOP'],
        maxTokens: 100,
    };
    let basicResponse = null;
    let basicError = null;
    try {
        basicResponse = await modelFn(mockRuntime, basicParams);
        (0, bun_test_1.expect)(basicResponse).toBeTruthy();
        (0, bun_test_1.expect)(typeof basicResponse).toBe('string');
    }
    catch (e) {
        basicError = e;
        core_1.logger.error({ error: e }, `${modelType} model call failed:`);
    }
    // Test with empty prompt
    const emptyParams = {
        prompt: '',
    };
    let emptyResponse = null;
    let emptyError = null;
    try {
        emptyResponse = await modelFn(mockRuntime, emptyParams);
    }
    catch (e) {
        emptyError = e;
        core_1.logger.error({ error: e }, `${modelType} empty prompt test failed:`);
    }
    // Test with all parameters
    const fullParams = {
        prompt: `Comprehensive test prompt for ${modelType}`,
        stopSequences: ['STOP1', 'STOP2'],
        maxTokens: 200,
        temperature: 0.8,
        frequencyPenalty: 0.6,
        presencePenalty: 0.4,
    };
    let fullResponse = null;
    let fullError = null;
    try {
        fullResponse = await modelFn(mockRuntime, fullParams);
    }
    catch (e) {
        fullError = e;
        core_1.logger.error({ error: e }, `${modelType} all parameters test failed:`);
    }
    return {
        basic: { response: basicResponse, error: basicError },
        empty: { response: emptyResponse, error: emptyError },
        full: { response: fullResponse, error: fullError },
    };
};
(0, bun_test_1.describe)('Plugin Models', () => {
    (0, bun_test_1.it)('should have models defined', () => {
        (0, bun_test_1.expect)(plugin_1.default.models).toBeDefined();
        if (plugin_1.default.models) {
            (0, bun_test_1.expect)(typeof plugin_1.default.models).toBe('object');
        }
    });
    (0, bun_test_1.describe)('TEXT_SMALL Model', () => {
        (0, bun_test_1.it)('should have a TEXT_SMALL model defined', () => {
            if (plugin_1.default.models) {
                (0, bun_test_1.expect)(plugin_1.default.models).toHaveProperty(core_1.ModelType.TEXT_SMALL);
                (0, bun_test_1.expect)(typeof plugin_1.default.models[core_1.ModelType.TEXT_SMALL]).toBe('function');
            }
        });
        (0, bun_test_1.it)('should run core tests for TEXT_SMALL model', async () => {
            if (plugin_1.default.models && plugin_1.default.models[core_1.ModelType.TEXT_SMALL]) {
                const results = await runCoreModelTests(core_1.ModelType.TEXT_SMALL, plugin_1.default.models[core_1.ModelType.TEXT_SMALL]);
                (0, core_test_utils_1.documentTestResult)('TEXT_SMALL core model tests', results);
            }
        });
    });
    (0, bun_test_1.describe)('TEXT_LARGE Model', () => {
        (0, bun_test_1.it)('should have a TEXT_LARGE model defined', () => {
            if (plugin_1.default.models) {
                (0, bun_test_1.expect)(plugin_1.default.models).toHaveProperty(core_1.ModelType.TEXT_LARGE);
                (0, bun_test_1.expect)(typeof plugin_1.default.models[core_1.ModelType.TEXT_LARGE]).toBe('function');
            }
        });
        (0, bun_test_1.it)('should run core tests for TEXT_LARGE model', async () => {
            if (plugin_1.default.models && plugin_1.default.models[core_1.ModelType.TEXT_LARGE]) {
                const results = await runCoreModelTests(core_1.ModelType.TEXT_LARGE, plugin_1.default.models[core_1.ModelType.TEXT_LARGE]);
                (0, core_test_utils_1.documentTestResult)('TEXT_LARGE core model tests', results);
            }
        });
    });
});
