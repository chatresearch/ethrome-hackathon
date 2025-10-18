"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@elizaos/core");
const fs = __importStar(require("node:fs"));
const os = __importStar(require("node:os"));
const path = __importStar(require("node:path"));
const bun_test_1 = require("bun:test");
const index_1 = require("../index");
const plugin_1 = __importDefault(require("../plugin"));
// Set up spies on logger
(0, bun_test_1.beforeAll)(() => {
    (0, bun_test_1.spyOn)(core_1.logger, 'info').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'error').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'warn').mockImplementation(() => { });
    (0, bun_test_1.spyOn)(core_1.logger, 'debug').mockImplementation(() => { });
});
(0, bun_test_1.afterAll)(() => {
    // No global restore needed in bun:test;
});
// Skip in CI environments or when running automated tests without interaction
const isCI = Boolean(process.env.CI);
/**
 * Integration tests demonstrate how multiple components of the project work together.
 * Unlike unit tests that test individual functions in isolation, integration tests
 * examine how components interact with each other.
 */
(0, bun_test_1.describe)('Integration: Project Structure and Components', () => {
    (0, bun_test_1.it)('should have a valid package structure', () => {
        const srcDir = path.join(process.cwd(), 'src');
        (0, bun_test_1.expect)(fs.existsSync(srcDir)).toBe(true);
        // Check for required source files - only checking core files
        const srcFiles = [path.join(srcDir, 'index.ts'), path.join(srcDir, 'plugin.ts')];
        srcFiles.forEach((file) => {
            (0, bun_test_1.expect)(fs.existsSync(file)).toBe(true);
        });
    });
    (0, bun_test_1.it)('should have dist directory for build outputs', () => {
        const distDir = path.join(process.cwd(), 'dist');
        // Skip directory content validation if dist doesn't exist yet
        if (!fs.existsSync(distDir)) {
            core_1.logger.warn('Dist directory does not exist yet. Build the project first.');
            return;
        }
        (0, bun_test_1.expect)(fs.existsSync(distDir)).toBe(true);
    });
});
(0, bun_test_1.describe)('Integration: Character and Plugin', () => {
    (0, bun_test_1.it)('should have character with required properties', () => {
        // Verify character has required properties
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('name');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('plugins');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('bio');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('system');
        (0, bun_test_1.expect)(index_1.character).toHaveProperty('messageExamples');
        // Verify plugins is an array
        (0, bun_test_1.expect)(Array.isArray(index_1.character.plugins)).toBe(true);
    });
    (0, bun_test_1.it)('should configure plugin correctly', () => {
        // Verify plugin has necessary components that character will use
        (0, bun_test_1.expect)(plugin_1.default).toHaveProperty('name');
        (0, bun_test_1.expect)(plugin_1.default).toHaveProperty('description');
        (0, bun_test_1.expect)(plugin_1.default).toHaveProperty('init');
        // Check if plugin has actions, models, providers, etc. that character might use
        const components = ['models', 'actions', 'providers', 'services', 'routes', 'events'];
        components.forEach((component) => {
            if (plugin_1.default[component]) {
                // Just verify if these exist, we don't need to test their functionality here
                // Those tests belong in plugin.test.ts, actions.test.ts, etc.
                (0, bun_test_1.expect)(Array.isArray(plugin_1.default[component]) ||
                    typeof plugin_1.default[component] === 'object').toBeTruthy();
            }
        });
    });
});
(0, bun_test_1.describe)('Integration: Runtime Initialization', () => {
    (0, bun_test_1.it)('should create a mock runtime with character and plugin', async () => {
        // Create a custom mock runtime for this test
        const customMockRuntime = {
            character: { ...index_1.character },
            plugins: [],
            registerPlugin: (0, bun_test_1.mock)().mockImplementation((plugin) => {
                // In a real runtime, registering the plugin would call its init method,
                // but since we're testing init itself, we just need to record the call
                return Promise.resolve();
            }),
            initialize: (0, bun_test_1.mock)(),
            getService: (0, bun_test_1.mock)(),
            getSetting: (0, bun_test_1.mock)().mockReturnValue(null),
            useModel: (0, bun_test_1.mock)().mockResolvedValue('Test model response'),
            getProviderResults: (0, bun_test_1.mock)().mockResolvedValue([]),
            evaluateProviders: (0, bun_test_1.mock)().mockResolvedValue([]),
            evaluate: (0, bun_test_1.mock)().mockResolvedValue([]),
        };
        // Ensure we're testing safely - to avoid parallel test race conditions
        const originalInit = plugin_1.default.init;
        let initCalled = false;
        // Mock the plugin.init method using mock instead of direct assignment
        if (plugin_1.default.init) {
            plugin_1.default.init = (0, bun_test_1.mock)(async (config, runtime) => {
                // Set flag to indicate our wrapper was called
                initCalled = true;
                // Call original if it exists
                if (originalInit) {
                    await originalInit(config, runtime);
                }
                // Register plugin
                await runtime.registerPlugin(plugin_1.default);
            });
        }
        try {
            // Initialize plugin in runtime
            if (plugin_1.default.init) {
                await plugin_1.default.init({ EXAMPLE_PLUGIN_VARIABLE: 'test-value' }, customMockRuntime);
            }
            // Verify our wrapper was called
            (0, bun_test_1.expect)(initCalled).toBe(true);
            // Check if registerPlugin was called
            (0, bun_test_1.expect)(customMockRuntime.registerPlugin).toHaveBeenCalled();
        }
        catch (error) {
            console.error('Error initializing plugin:', error);
            throw error;
        }
        finally {
            // Restore the original init method to avoid affecting other tests
            plugin_1.default.init = originalInit;
        }
    });
});
// Skip scaffolding tests in CI environments as they modify the filesystem
const describeScaffolding = isCI ? bun_test_1.describe.skip : bun_test_1.describe;
describeScaffolding('Integration: Project Scaffolding', () => {
    // Create a temp directory for testing the scaffolding
    const TEST_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'eliza-test-'));
    (0, bun_test_1.beforeAll)(() => {
        // Create test directory if it doesn't exist
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR, { recursive: true });
        }
    });
    (0, bun_test_1.afterAll)(() => {
        // Clean up test directory
        if (fs.existsSync(TEST_DIR)) {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        }
    });
    (0, bun_test_1.it)('should scaffold a new project correctly', () => {
        try {
            // This is a simple simulation of the scaffolding process
            // In a real scenario, you'd use the CLI or API to scaffold
            // Copy essential files to test directory
            const srcFiles = ['index.ts', 'plugin.ts', 'character.ts'];
            for (const file of srcFiles) {
                const sourceFilePath = path.join(process.cwd(), 'src', file);
                const targetFilePath = path.join(TEST_DIR, file);
                if (fs.existsSync(sourceFilePath)) {
                    fs.copyFileSync(sourceFilePath, targetFilePath);
                }
            }
            // Create package.json in test directory
            const packageJson = {
                name: 'test-project',
                version: '1.0.0',
                type: 'module',
                dependencies: {
                    '@elizaos/core': 'workspace:*',
                },
            };
            fs.writeFileSync(path.join(TEST_DIR, 'package.json'), JSON.stringify(packageJson, null, 2));
            // Verify files exist
            (0, bun_test_1.expect)(fs.existsSync(path.join(TEST_DIR, 'index.ts'))).toBe(true);
            (0, bun_test_1.expect)(fs.existsSync(path.join(TEST_DIR, 'plugin.ts'))).toBe(true);
            (0, bun_test_1.expect)(fs.existsSync(path.join(TEST_DIR, 'character.ts'))).toBe(true);
            (0, bun_test_1.expect)(fs.existsSync(path.join(TEST_DIR, 'package.json'))).toBe(true);
        }
        catch (error) {
            core_1.logger.error({ error }, 'Error in scaffolding test:');
            throw error;
        }
    });
});
