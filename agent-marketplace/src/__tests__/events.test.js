"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
const core_1 = require("@elizaos/core");
(0, bun_test_1.describe)('Plugin Events', () => {
    // Use spyOn like all other tests in the codebase
    (0, bun_test_1.beforeAll)(() => {
        (0, bun_test_1.spyOn)(core_1.logger, 'info');
        (0, bun_test_1.spyOn)(core_1.logger, 'error');
        (0, bun_test_1.spyOn)(core_1.logger, 'warn');
        (0, bun_test_1.spyOn)(core_1.logger, 'debug');
    });
    (0, bun_test_1.it)('should have events defined', () => {
        (0, bun_test_1.expect)(plugin_1.default.events).toBeDefined();
        if (plugin_1.default.events) {
            (0, bun_test_1.expect)(Object.keys(plugin_1.default.events).length).toBeGreaterThan(0);
        }
    });
    (0, bun_test_1.it)('should handle MESSAGE_RECEIVED event', async () => {
        if (plugin_1.default.events && plugin_1.default.events.MESSAGE_RECEIVED) {
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.events.MESSAGE_RECEIVED)).toBe(true);
            (0, bun_test_1.expect)(plugin_1.default.events.MESSAGE_RECEIVED.length).toBeGreaterThan(0);
            const messageHandler = plugin_1.default.events.MESSAGE_RECEIVED[0];
            (0, bun_test_1.expect)(typeof messageHandler).toBe('function');
            // Use any type to bypass strict type checking for testing
            const mockParams = {
                message: {
                    id: 'test-id',
                    content: { text: 'Hello!' },
                },
                source: 'test',
                runtime: {},
            };
            // Call the event handler
            await messageHandler(mockParams);
            // Verify logger was called with correct Pino-style structured logging
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith('MESSAGE_RECEIVED event received');
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith({ keys: bun_test_1.expect.any(Array) }, 'MESSAGE_RECEIVED param keys');
        }
    });
    (0, bun_test_1.it)('should handle VOICE_MESSAGE_RECEIVED event', async () => {
        if (plugin_1.default.events && plugin_1.default.events.VOICE_MESSAGE_RECEIVED) {
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.events.VOICE_MESSAGE_RECEIVED)).toBe(true);
            (0, bun_test_1.expect)(plugin_1.default.events.VOICE_MESSAGE_RECEIVED.length).toBeGreaterThan(0);
            const voiceHandler = plugin_1.default.events.VOICE_MESSAGE_RECEIVED[0];
            (0, bun_test_1.expect)(typeof voiceHandler).toBe('function');
            // Use any type to bypass strict type checking for testing
            const mockParams = {
                message: {
                    id: 'test-id',
                    content: { text: 'Voice message!' },
                },
                source: 'test',
                runtime: {},
            };
            // Call the event handler
            await voiceHandler(mockParams);
            // Verify logger was called with correct Pino-style structured logging
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith('VOICE_MESSAGE_RECEIVED event received');
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith({ keys: bun_test_1.expect.any(Array) }, 'VOICE_MESSAGE_RECEIVED param keys');
        }
    });
    (0, bun_test_1.it)('should handle WORLD_CONNECTED event', async () => {
        if (plugin_1.default.events && plugin_1.default.events.WORLD_CONNECTED) {
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.events.WORLD_CONNECTED)).toBe(true);
            (0, bun_test_1.expect)(plugin_1.default.events.WORLD_CONNECTED.length).toBeGreaterThan(0);
            const connectedHandler = plugin_1.default.events.WORLD_CONNECTED[0];
            (0, bun_test_1.expect)(typeof connectedHandler).toBe('function');
            // Use any type to bypass strict type checking for testing
            const mockParams = {
                world: {
                    id: 'test-world-id',
                    name: 'Test World',
                },
                rooms: [],
                entities: [],
                source: 'test',
                runtime: {},
            };
            // Call the event handler
            await connectedHandler(mockParams);
            // Verify logger was called with correct Pino-style structured logging
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith('WORLD_CONNECTED event received');
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith({ keys: bun_test_1.expect.any(Array) }, 'WORLD_CONNECTED param keys');
        }
    });
    (0, bun_test_1.it)('should handle WORLD_JOINED event', async () => {
        if (plugin_1.default.events && plugin_1.default.events.WORLD_JOINED) {
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.events.WORLD_JOINED)).toBe(true);
            (0, bun_test_1.expect)(plugin_1.default.events.WORLD_JOINED.length).toBeGreaterThan(0);
            const joinedHandler = plugin_1.default.events.WORLD_JOINED[0];
            (0, bun_test_1.expect)(typeof joinedHandler).toBe('function');
            // Use any type to bypass strict type checking for testing
            const mockParams = {
                world: {
                    id: 'test-world-id',
                    name: 'Test World',
                },
                entity: {
                    id: 'test-entity-id',
                    name: 'Test Entity',
                },
                rooms: [],
                entities: [],
                source: 'test',
                runtime: {},
            };
            // Call the event handler
            await joinedHandler(mockParams);
            // Verify logger was called with correct Pino-style structured logging
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith('WORLD_JOINED event received');
            (0, bun_test_1.expect)(core_1.logger.info).toHaveBeenCalledWith({ keys: bun_test_1.expect.any(Array) }, 'WORLD_JOINED param keys');
        }
    });
});
