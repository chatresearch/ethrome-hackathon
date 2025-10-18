"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCoreActionTests = exports.documentTestResult = void 0;
exports.createMockRuntime = createMockRuntime;
exports.createMockMessage = createMockMessage;
exports.createMockState = createMockState;
exports.setupTest = setupTest;
exports.setupLoggerSpies = setupLoggerSpies;
const bun_test_1 = require("bun:test");
const core_1 = require("@elizaos/core");
const core_test_utils_1 = require("./utils/core-test-utils");
Object.defineProperty(exports, "documentTestResult", { enumerable: true, get: function () { return core_test_utils_1.documentTestResult; } });
Object.defineProperty(exports, "runCoreActionTests", { enumerable: true, get: function () { return core_test_utils_1.runCoreActionTests; } });
const index_1 = require("../index");
const plugin_1 = __importDefault(require("../plugin"));
/**
 * Creates an enhanced mock runtime for testing that includes the project's
 * character and plugin
 *
 * @param overrides - Optional overrides for the default mock methods and properties
 * @returns A mock runtime for testing
 */
function createMockRuntime(overrides = {}) {
    // Create base mock runtime with default core utilities
    const baseRuntime = (0, core_test_utils_1.createMockRuntime)();
    // Enhance with project-specific configuration
    const mockRuntime = {
        ...baseRuntime,
        character: index_1.character,
        plugins: [plugin_1.default],
        registerPlugin: (0, bun_test_1.mock)(),
        initialize: (0, bun_test_1.mock)(),
        getService: (0, bun_test_1.mock)(),
        getSetting: (0, bun_test_1.mock)().mockReturnValue(null),
        useModel: (0, bun_test_1.mock)().mockResolvedValue('Test model response'),
        getProviderResults: (0, bun_test_1.mock)().mockResolvedValue([]),
        evaluateProviders: (0, bun_test_1.mock)().mockResolvedValue([]),
        evaluate: (0, bun_test_1.mock)().mockResolvedValue([]),
        ...overrides,
    };
    return mockRuntime;
}
/**
 * Creates a mock Message object for testing
 *
 * @param text - The message text
 * @param overrides - Optional overrides for the default memory properties
 * @returns A mock memory object
 */
function createMockMessage(text, overrides = {}) {
    const baseMessage = (0, core_test_utils_1.createMockMessage)(text);
    return {
        ...baseMessage,
        ...overrides,
    };
}
/**
 * Creates a mock State object for testing
 *
 * @param overrides - Optional overrides for the default state properties
 * @returns A mock state object
 */
function createMockState(overrides = {}) {
    const baseState = (0, core_test_utils_1.createMockState)();
    return {
        ...baseState,
        ...overrides,
    };
}
/**
 * Creates a standardized setup for testing with consistent mock objects
 *
 * @param overrides - Optional overrides for default mock implementations
 * @returns An object containing mockRuntime, mockMessage, mockState, and callbackFn
 */
function setupTest(options = {}) {
    // Create mock callback function
    const callbackFn = (0, bun_test_1.mock)();
    // Create a message
    const mockMessage = createMockMessage(options.messageText || 'Test message', options.messageOverrides || {});
    // Create a state object
    const mockState = createMockState(options.stateOverrides || {});
    // Create a mock runtime
    const mockRuntime = createMockRuntime(options.runtimeOverrides || {});
    return {
        mockRuntime,
        mockMessage,
        mockState,
        callbackFn,
    };
}
// Add spy on logger for common usage in tests
function setupLoggerSpies() {
    (0, bun_test_1.spyOn)(core_1.logger, 'info').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'error').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'warn').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'debug').mockImplementation(() => { });
    // allow tests to restore originals
    return () => bun_test_1.mock.restore();
}
