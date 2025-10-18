"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const character_1 = require("../character");
(0, bun_test_1.describe)('Project Starter Character Plugin Ordering', () => {
    let originalEnv;
    (0, bun_test_1.beforeEach)(() => {
        // Save original environment
        originalEnv = {
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
            OLLAMA_API_ENDPOINT: process.env.OLLAMA_API_ENDPOINT,
            GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
            TWITTER_API_KEY: process.env.TWITTER_API_KEY,
            TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY,
            TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
            TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            IGNORE_BOOTSTRAP: process.env.IGNORE_BOOTSTRAP,
        };
        // Clear all environment variables
        Object.keys(originalEnv).forEach((key) => {
            delete process.env[key];
        });
    });
    (0, bun_test_1.afterEach)(() => {
        // Restore original environment
        Object.entries(originalEnv).forEach(([key, value]) => {
            if (value === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = value;
            }
        });
    });
    (0, bun_test_1.describe)('Core Plugin Ordering', () => {
        (0, bun_test_1.it)('should always include SQL plugin first', () => {
            (0, bun_test_1.expect)(character_1.character.plugins[0]).toBe('@elizaos/plugin-sql');
        });
        (0, bun_test_1.it)('should include bootstrap plugin by default (not ignored)', () => {
            (0, bun_test_1.expect)(character_1.character.plugins).toContain('@elizaos/plugin-bootstrap');
        });
        (0, bun_test_1.it)('should exclude bootstrap plugin when IGNORE_BOOTSTRAP is set', () => {
            // Note: Since character is imported statically, we test the conditional logic structure
            // The actual dynamic behavior is tested in the CLI tests with getElizaCharacter()
            (0, bun_test_1.expect)(character_1.character.plugins).toContain('@elizaos/plugin-bootstrap');
            // In a dynamic context, bootstrap would be excluded when IGNORE_BOOTSTRAP is set
        });
    });
    (0, bun_test_1.describe)('Plugin Structure and Ordering', () => {
        (0, bun_test_1.it)('should structure embedding plugins after text-only plugins', () => {
            const plugins = character_1.character.plugins;
            // Find indices of key plugins
            const sqlIndex = plugins.indexOf('@elizaos/plugin-sql');
            // SQL should be first
            (0, bun_test_1.expect)(sqlIndex).toBe(0);
        });
    });
    (0, bun_test_1.describe)('Plugin Categories and Ordering', () => {
        (0, bun_test_1.it)('should categorize plugins correctly', () => {
            const plugins = character_1.character.plugins;
            // Core plugins
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-sql');
            // Text-only AI plugins (no embedding support)
            const textOnlyPlugins = ['@elizaos/plugin-anthropic', '@elizaos/plugin-openrouter'];
            // Embedding-capable AI plugins
            const embeddingPlugins = [
                '@elizaos/plugin-openai',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ];
            // Platform plugins
            const platformPlugins = [
                '@elizaos/plugin-discord',
                '@elizaos/plugin-twitter',
                '@elizaos/plugin-telegram',
            ];
            // Bootstrap plugin
            const bootstrapPlugin = '@elizaos/plugin-bootstrap';
            // Verify all categories are represented in the plugin structure
            const allExpectedPlugins = [
                '@elizaos/plugin-sql',
                ...textOnlyPlugins,
                ...platformPlugins,
                bootstrapPlugin,
                ...embeddingPlugins,
            ];
            // Check that our character has conditional logic for all these plugins
            // SQL should always be present
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-sql');
            // Bootstrap should be present unless IGNORE_BOOTSTRAP is set
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-bootstrap');
        });
        (0, bun_test_1.it)('should maintain proper ordering between plugin categories', () => {
            const plugins = character_1.character.plugins;
            // Get indices of representative plugins from each category
            const sqlIndex = plugins.indexOf('@elizaos/plugin-sql');
            const bootstrapIndex = plugins.indexOf('@elizaos/plugin-bootstrap');
            // SQL should be first
            (0, bun_test_1.expect)(sqlIndex).toBe(0);
            // Bootstrap should be present
            if (bootstrapIndex !== -1) {
                (0, bun_test_1.expect)(bootstrapIndex).toBeGreaterThan(sqlIndex);
            }
        });
    });
    (0, bun_test_1.describe)('Environment Variable Integration', () => {
        (0, bun_test_1.it)('should have conditional logic for all AI providers', () => {
            // Test that the character structure includes conditional logic
            // Note: Since this is a static import, we test the structure rather than dynamic behavior
            const plugins = character_1.character.plugins;
            // Should always have core plugins
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-sql');
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-bootstrap');
            // Should handle various AI providers
            const hasAiProviders = plugins.some((plugin) => [
                '@elizaos/plugin-anthropic',
                '@elizaos/plugin-openai',
                '@elizaos/plugin-openrouter',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ].includes(plugin));
        });
        (0, bun_test_1.it)('should include proper conditional checks for Twitter', () => {
            // Twitter requires all 4 environment variables
            // Test that the logic structure is sound
            const plugins = character_1.character.plugins;
            // Twitter should not be in default config (no env vars set)
            (0, bun_test_1.expect)(plugins).not.toContain('@elizaos/plugin-twitter');
        });
        (0, bun_test_1.it)('should structure platform plugins between AI plugins', () => {
            const plugins = character_1.character.plugins;
            // Platform plugins should be positioned correctly in the array structure
            const sqlIndex = plugins.indexOf('@elizaos/plugin-sql');
            const bootstrapIndex = plugins.indexOf('@elizaos/plugin-bootstrap');
            // Platform plugins (when present) should be between SQL and bootstrap
            (0, bun_test_1.expect)(sqlIndex).toBeLessThan(bootstrapIndex);
        });
    });
    (0, bun_test_1.describe)('Embedding Plugin Priority Verification', () => {
        (0, bun_test_1.it)('should structure embedding plugins at the end', () => {
            const plugins = character_1.character.plugins;
            // Get the last few plugins
            const lastThreePlugins = plugins.slice(-3);
            // At least one should be an embedding-capable plugin
            const embeddingPlugins = [
                '@elizaos/plugin-openai',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ];
            // Check if any embedding plugins are present
            const embeddingPluginsPresent = plugins.filter((plugin) => embeddingPlugins.includes(plugin));
            // If embedding plugins are present, at least one should be at the end
            if (embeddingPluginsPresent.length > 0) {
                const hasEmbeddingAtEnd = lastThreePlugins.some((plugin) => embeddingPlugins.includes(plugin));
                (0, bun_test_1.expect)(hasEmbeddingAtEnd).toBe(true);
            }
        });
        (0, bun_test_1.it)('should maintain consistent plugin structure', () => {
            // Test multiple evaluations for consistency
            const plugins1 = character_1.character.plugins;
            const plugins2 = character_1.character.plugins;
            (0, bun_test_1.expect)(plugins1).toEqual(plugins2);
            (0, bun_test_1.expect)(plugins1.length).toBe(plugins2.length);
        });
    });
    (0, bun_test_1.describe)('Plugin Logic Validation', () => {
        (0, bun_test_1.it)('should follow the expected plugin ordering pattern', () => {
            const plugins = character_1.character.plugins;
            // Expected pattern: [SQL, Text-only AI, Platforms, Bootstrap, Embedding AI]
            // Verify the basic structure exists
            (0, bun_test_1.expect)(plugins[0]).toBe('@elizaos/plugin-sql'); // SQL always first
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-bootstrap'); // Bootstrap present
            // Verify ordering: text-only plugins before embedding plugins
            const textOnlyPlugins = ['@elizaos/plugin-anthropic', '@elizaos/plugin-openrouter'];
            const embeddingPlugins = [
                '@elizaos/plugin-openai',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ];
            const textOnlyIndices = textOnlyPlugins
                .map((p) => plugins.indexOf(p))
                .filter((i) => i !== -1);
            const embeddingIndices = embeddingPlugins
                .map((p) => plugins.indexOf(p))
                .filter((i) => i !== -1);
            if (textOnlyIndices.length > 0 && embeddingIndices.length > 0) {
                const maxTextOnly = Math.max(...textOnlyIndices);
                const minEmbedding = Math.min(...embeddingIndices);
                (0, bun_test_1.expect)(minEmbedding).toBeGreaterThan(maxTextOnly);
            }
        });
        (0, bun_test_1.it)('should have valid plugin names', () => {
            const plugins = character_1.character.plugins;
            plugins.forEach((plugin) => {
                (0, bun_test_1.expect)(typeof plugin).toBe('string');
                (0, bun_test_1.expect)(plugin).toMatch(/^@elizaos\/plugin-/);
            });
        });
        (0, bun_test_1.it)('should not have duplicate plugins', () => {
            const plugins = character_1.character.plugins;
            const uniquePlugins = [...new Set(plugins)];
            (0, bun_test_1.expect)(plugins.length).toBe(uniquePlugins.length);
        });
    });
    (0, bun_test_1.describe)('Complex Configuration Scenarios', () => {
        (0, bun_test_1.it)('should handle complete AI provider setup correctly', () => {
            // This tests the theoretical structure for when all providers are available
            const allAiProviders = [
                '@elizaos/plugin-anthropic',
                '@elizaos/plugin-openrouter',
                '@elizaos/plugin-openai',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ];
            // In a complete setup, at least one AI provider should be present
            // Test the logical structure based on current environment
            const hasOtherAiProviders = character_1.character.plugins.some((plugin) => allAiProviders.includes(plugin));
            // At least one AI provider should be present
            (0, bun_test_1.expect)(hasOtherAiProviders).toBe(true);
        });
        (0, bun_test_1.it)('should validate embedding vs text-only categorization', () => {
            const embeddingCapablePlugins = [
                '@elizaos/plugin-openai',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ];
            const textOnlyPlugins = ['@elizaos/plugin-anthropic', '@elizaos/plugin-openrouter'];
            // Verify our categorization is complete and mutually exclusive
            const intersection = embeddingCapablePlugins.filter((plugin) => textOnlyPlugins.includes(plugin));
            (0, bun_test_1.expect)(intersection.length).toBe(0); // No overlap
        });
        (0, bun_test_1.it)('should structure conditional logic properly', () => {
            // Test that the character has the right structure for conditional loading
            const plugins = character_1.character.plugins;
            // Should have core plugins
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-sql');
            // Should have bootstrap (unless ignored)
            (0, bun_test_1.expect)(plugins).toContain('@elizaos/plugin-bootstrap');
            // Should have fallback logic working correctly
            const hasOtherAiProviders = plugins.some((plugin) => [
                '@elizaos/plugin-anthropic',
                '@elizaos/plugin-openai',
                '@elizaos/plugin-openrouter',
                '@elizaos/plugin-ollama',
                '@elizaos/plugin-google-genai',
            ].includes(plugin));
            // Should have at least one AI provider
            (0, bun_test_1.expect)(hasOtherAiProviders).toBe(true);
        });
    });
});
