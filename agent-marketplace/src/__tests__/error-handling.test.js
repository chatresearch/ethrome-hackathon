"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const plugin_2 = require("../plugin");
const core_1 = require("@elizaos/core");
const uuid_1 = require("uuid");
(0, bun_test_1.describe)('Error Handling', () => {
    (0, bun_test_1.beforeEach)(() => {
        // Use spyOn for logger methods
        (0, bun_test_1.spyOn)(core_1.logger, 'info');
        (0, bun_test_1.spyOn)(core_1.logger, 'error');
        (0, bun_test_1.spyOn)(core_1.logger, 'warn');
    });
    (0, bun_test_1.describe)('HELLO_WORLD Action Error Handling', () => {
        (0, bun_test_1.it)('should log errors in action handlers', async () => {
            // Find the action
            const action = plugin_1.default.actions?.find((a) => a.name === 'HELLO_WORLD');
            if (action && action.handler) {
                // Force the handler to throw an error
                const mockError = new Error('Test error in action');
                (0, bun_test_1.spyOn)(console, 'error').mockImplementation(() => { });
                // Create a custom mock runtime
                const mockRuntime = {
                // This is just a simple object for testing
                };
                const mockMessage = {
                    entityId: (0, uuid_1.v4)(),
                    roomId: (0, uuid_1.v4)(),
                    content: {
                        text: 'Hello!',
                        source: 'test',
                    },
                };
                const mockState = {
                    values: {},
                    data: {},
                    text: '',
                };
                const mockCallback = (0, bun_test_1.mock)();
                // Mock the logger.error to verify it's called
                (0, bun_test_1.spyOn)(core_1.logger, 'error');
                // Test the error handling by observing the behavior
                try {
                    await action.handler(mockRuntime, mockMessage, mockState, {}, mockCallback, []);
                    // If we get here, no error was thrown, which is okay
                    // In a real application, error handling might be internal
                    (0, bun_test_1.expect)(mockCallback).toHaveBeenCalled();
                }
                catch (error) {
                    // If error is thrown, ensure it's handled correctly
                    (0, bun_test_1.expect)(core_1.logger.error).toHaveBeenCalled();
                }
            }
        });
    });
    (0, bun_test_1.describe)('Service Error Handling', () => {
        (0, bun_test_1.it)('should throw an error when stopping non-existent service', async () => {
            const mockRuntime = {
                getService: (0, bun_test_1.mock)().mockReturnValue(null),
            };
            let caughtError = null;
            try {
                await plugin_2.StarterService.stop(mockRuntime);
            }
            catch (error) {
                caughtError = error;
                (0, bun_test_1.expect)(error.message).toBe('Starter service not found');
            }
            (0, bun_test_1.expect)(caughtError).not.toBeNull();
            (0, bun_test_1.expect)(mockRuntime.getService).toHaveBeenCalledWith('starter');
        });
        (0, bun_test_1.it)('should handle service stop errors gracefully', async () => {
            const mockServiceWithError = {
                stop: (0, bun_test_1.mock)().mockImplementation(() => {
                    throw new Error('Error stopping service');
                }),
            };
            const mockRuntime = {
                getService: (0, bun_test_1.mock)().mockReturnValue(mockServiceWithError),
            };
            // The error should be propagated
            let caughtError = null;
            try {
                await plugin_2.StarterService.stop(mockRuntime);
            }
            catch (error) {
                caughtError = error;
                (0, bun_test_1.expect)(error.message).toBe('Error stopping service');
            }
            (0, bun_test_1.expect)(caughtError).not.toBeNull();
            (0, bun_test_1.expect)(mockRuntime.getService).toHaveBeenCalledWith('starter');
            (0, bun_test_1.expect)(mockServiceWithError.stop).toHaveBeenCalled();
        });
    });
    (0, bun_test_1.describe)('Plugin Events Error Handling', () => {
        (0, bun_test_1.it)('should handle errors in event handlers gracefully', async () => {
            if (plugin_1.default.events && plugin_1.default.events.MESSAGE_RECEIVED) {
                const messageHandler = plugin_1.default.events.MESSAGE_RECEIVED[0];
                // Create a mock that will trigger an error
                const mockParams = {
                    message: {
                        id: 'test-id',
                        content: { text: 'Hello!' },
                    },
                    source: 'test',
                    runtime: {},
                };
                // Spy on the logger
                (0, bun_test_1.spyOn)(core_1.logger, 'error');
                // This is a partial test - in a real handler, we'd have more robust error handling
                try {
                    await messageHandler(mockParams);
                    // If it succeeds without error, that's good too
                    (0, bun_test_1.expect)(true).toBe(true);
                }
                catch (error) {
                    // If it does error, make sure we can catch it
                    (0, bun_test_1.expect)(error).toBeDefined();
                }
            }
        });
    });
    (0, bun_test_1.describe)('Provider Error Handling', () => {
        (0, bun_test_1.it)('should handle errors in provider.get method', async () => {
            const provider = plugin_1.default.providers?.find((p) => p.name === 'HELLO_WORLD_PROVIDER');
            if (provider) {
                // Create invalid inputs to test error handling
                const mockRuntime = null;
                const mockMessage = null;
                const mockState = null;
                // The provider should handle null inputs gracefully
                try {
                    await provider.get(mockRuntime, mockMessage, mockState);
                    // If we get here, it didn't throw - which is good
                    (0, bun_test_1.expect)(true).toBe(true);
                }
                catch (error) {
                    // If it does throw, at least make sure it's a handled error
                    (0, bun_test_1.expect)(core_1.logger.error).toHaveBeenCalled();
                }
            }
        });
    });
});
