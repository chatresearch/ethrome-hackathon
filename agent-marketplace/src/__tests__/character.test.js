"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const index_1 = require("../index");
(0, bun_test_1.describe)('Character Configuration', () => {
    (0, bun_test_1.it)('should have all required fields', () => {
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('name');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('bio');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('plugins');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('system');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('messageExamples');
    });
    (0, bun_test_1.it)('should have the correct name', () => {
        (0, bun_test_1.expect)(typeof index_1.character.name).toBe('string');
        (0, bun_test_1.expect)(index_1.character.name.length).toBeGreaterThan(0);
    });
    (0, bun_test_1.it)('should have plugins defined as an array', () => {
        (0, bun_test_1.expect)(Array.isArray(index_1.character.plugins)).toBe(true);
    });
    (0, bun_test_1.it)('should have conditionally included plugins based on environment variables', () => {
        // This test is a simple placeholder since we can't easily test dynamic imports in test environments
        // The actual functionality is tested at runtime by the starter test suite
        // Save the original env values
        const originalOpenAIKey = process.env.OPENAI_API_KEY;
        const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
        try {
            // Verify if plugins array includes the core plugin
            (0, bun_test_1.expect)(index_1.character.plugins).toContain('@elizaos/plugin-sql');
            // Plugins array should have conditional plugins based on environment variables
            if (process.env.OPENAI_API_KEY) {
                (0, bun_test_1.expect)(index_1.character.plugins).toContain('@elizaos/plugin-openai');
            }
            if (process.env.ANTHROPIC_API_KEY) {
                (0, bun_test_1.expect)(index_1.character.plugins).toContain('@elizaos/plugin-anthropic');
            }
        }
        finally {
            // Restore original env values
            process.env.OPENAI_API_KEY = originalOpenAIKey;
            process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
        }
    });
    (0, bun_test_1.it)('should have a non-empty system prompt', () => {
        (0, bun_test_1.expect)(index_1.character.system).toBeTruthy();
        if (index_1.character.system) {
            (0, bun_test_1.expect)(typeof index_1.character.system).toBe('string');
            (0, bun_test_1.expect)(index_1.character.system.length).toBeGreaterThan(0);
        }
    });
    (0, bun_test_1.it)('should have personality traits in bio array', () => {
        (0, bun_test_1.expect)(Array.isArray(index_1.character.bio)).toBe(true);
        if (index_1.character.bio && Array.isArray(index_1.character.bio)) {
            (0, bun_test_1.expect)(index_1.character.bio.length).toBeGreaterThan(0);
            // Check if bio entries are non-empty strings
            index_1.character.bio.forEach((trait) => {
                (0, bun_test_1.expect)(typeof trait).toBe('string');
                (0, bun_test_1.expect)(trait.length).toBeGreaterThan(0);
            });
        }
    });
    (0, bun_test_1.it)('should have message examples for training', () => {
        (0, bun_test_1.expect)(Array.isArray(index_1.character.messageExamples)).toBe(true);
        if (index_1.character.messageExamples && Array.isArray(index_1.character.messageExamples)) {
            (0, bun_test_1.expect)(index_1.character.messageExamples.length).toBeGreaterThan(0);
            // Check structure of first example
            const firstExample = index_1.character.messageExamples[0];
            (0, bun_test_1.expect)(Array.isArray(firstExample)).toBe(true);
            (0, bun_test_1.expect)(firstExample.length).toBeGreaterThan(1); // At least a user message and a response
            // Check that messages have name and content
            firstExample.forEach((message) => {
                (0, bun_test_1.expect)(message).toHaveProperty('name');
                (0, bun_test_1.expect)(message).toHaveProperty('content');
                (0, bun_test_1.expect)(message.content).toHaveProperty('text');
            });
        }
    });
});
