"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockState = exports.createMockMessage = exports.documentTestResult = exports.createMockRuntime = exports.runCoreActionTests = void 0;
const bun_test_1 = require("bun:test");
const core_1 = require("@elizaos/core");
const core_2 = require("@elizaos/core");
const uuid_1 = require("uuid");
/**
 * Utility functions for reusing core package tests in project-starter tests
 */
/**
 * Runs core package action tests against the provided actions
 * @param actions The actions to test
 */
const runCoreActionTests = (actions) => {
    // Validate action structure (similar to core tests)
    for (const action of actions) {
        if (!action.name) {
            throw new Error('Action missing name property');
        }
        if (!action.description) {
            throw new Error(`Action ${action.name} missing description property`);
        }
        if (!action.examples || !Array.isArray(action.examples)) {
            throw new Error(`Action ${action.name} missing examples array`);
        }
        if (!action.similes || !Array.isArray(action.similes)) {
            throw new Error(`Action ${action.name} missing similes array`);
        }
        if (typeof action.handler !== 'function') {
            throw new Error(`Action ${action.name} missing handler function`);
        }
        if (typeof action.validate !== 'function') {
            throw new Error(`Action ${action.name} missing validate function`);
        }
    }
    // Validate example structure
    for (const action of actions) {
        for (const example of action.examples ?? []) {
            for (const message of example) {
                if (!message.name) {
                    throw new Error(`Example message in action ${action.name} missing name property`);
                }
                if (!message.content) {
                    throw new Error(`Example message in action ${action.name} missing content property`);
                }
                if (!message.content.text) {
                    throw new Error(`Example message in action ${action.name} missing content.text property`);
                }
            }
        }
    }
    // Validate uniqueness of action names
    const names = actions.map((action) => action.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
        throw new Error('Duplicate action names found');
    }
    // Test action formatting
    const formattedNames = (0, core_1.formatActionNames)(actions);
    if (!formattedNames && actions.length > 0) {
        throw new Error('formatActionNames failed to produce output');
    }
    const formattedActions = (0, core_1.formatActions)(actions);
    if (!formattedActions && actions.length > 0) {
        throw new Error('formatActions failed to produce output');
    }
    const composedExamples = (0, core_1.composeActionExamples)(actions, 1);
    if (!composedExamples && actions.length > 0) {
        throw new Error('composeActionExamples failed to produce output');
    }
    return {
        formattedNames,
        formattedActions,
        composedExamples,
    };
};
exports.runCoreActionTests = runCoreActionTests;
/**
 * Creates a mock runtime for testing
 */
const createMockRuntime = () => {
    return {
        character: {
            name: 'Test Character',
            system: 'You are a helpful assistant for testing.',
        },
        getSetting: (key) => null,
        // Include real model functionality
        models: {},
        // Add real database functionality
        db: {
            get: async () => null,
            set: async () => true,
            delete: async () => true,
            getKeys: async () => [],
        },
        // Add real memory functionality
        memory: {
            add: async () => { },
            get: async () => null,
            getByEntityId: async () => [],
            getLatest: async () => null,
            getRecentMessages: async () => [],
            search: async () => [],
        },
        actions: [],
        providers: [],
        getService: (0, bun_test_1.mock)(),
        processActions: (0, bun_test_1.mock)(),
    };
};
exports.createMockRuntime = createMockRuntime;
/**
 * Documents test results for logging and debugging
 */
const documentTestResult = (testName, result, error = null) => {
    // Clean, useful test documentation for developers
    core_2.logger.info(`✓ Testing: ${testName}`);
    if (error) {
        core_2.logger.error(`✗ Error: ${error.message}`);
        if (error.stack) {
            core_2.logger.error(`Stack: ${error.stack}`);
        }
        return;
    }
    if (result) {
        if (typeof result === 'string') {
            if (result.trim() && result.length > 0) {
                const preview = result.length > 60 ? `${result.substring(0, 60)}...` : result;
                core_2.logger.info(`  → ${preview}`);
            }
        }
        else if (typeof result === 'object') {
            try {
                // Show key information in a clean format
                const keys = Object.keys(result);
                if (keys.length > 0) {
                    const preview = keys.slice(0, 3).join(', ');
                    const more = keys.length > 3 ? ` +${keys.length - 3} more` : '';
                    core_2.logger.info(`  → {${preview}${more}}`);
                }
            }
            catch (e) {
                core_2.logger.info(`  → [Complex object]`);
            }
        }
    }
};
exports.documentTestResult = documentTestResult;
/**
 * Creates a mock message for testing
 */
const createMockMessage = (text) => {
    return {
        entityId: (0, uuid_1.v4)(),
        roomId: (0, uuid_1.v4)(),
        content: {
            text,
            source: 'test',
        },
    };
};
exports.createMockMessage = createMockMessage;
/**
 * Creates a mock state for testing
 */
const createMockState = () => {
    return {
        values: {},
        data: {},
        text: '',
    };
};
exports.createMockState = createMockState;
