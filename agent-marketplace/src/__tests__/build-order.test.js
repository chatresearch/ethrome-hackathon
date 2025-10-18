"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const bun_1 = require("bun");
const vite_config_utils_1 = require("./vite-config-utils");
(0, bun_test_1.describe)('Build Order Integration Test', () => {
    const rootDir = node_path_1.default.resolve(__dirname, '../..');
    const distDir = node_path_1.default.join(rootDir, 'dist');
    let viteBuildDir;
    const tsupBuildMarker = node_path_1.default.join(distDir, 'index.js'); // TSup creates this
    (0, bun_test_1.beforeAll)(async () => {
        // Get the actual vite build directory from config
        const viteOutDirRelative = await (0, vite_config_utils_1.getViteOutDir)(rootDir);
        viteBuildDir = node_path_1.default.join(rootDir, viteOutDirRelative);
        // Clean dist directory before test
        if (node_fs_1.default.existsSync(distDir)) {
            await node_fs_1.default.promises.rm(distDir, { recursive: true, force: true });
        }
    });
    (0, bun_test_1.afterAll)(async () => {
        // Clean up after test
        if (node_fs_1.default.existsSync(distDir)) {
            await node_fs_1.default.promises.rm(distDir, { recursive: true, force: true });
        }
    });
    (0, bun_test_1.it)('should ensure vite build outputs persist after tsup build', async () => {
        // Run the full build process
        await (0, bun_1.$) `cd ${rootDir} && bun run build`;
        // Check that both vite and tsup outputs exist
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(viteBuildDir)).toBe(true);
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(tsupBuildMarker)).toBe(true);
        // Check vite built frontend files
        const frontendFiles = node_fs_1.default.readdirSync(viteBuildDir);
        (0, bun_test_1.expect)(frontendFiles.length).toBeGreaterThan(0);
        // Should have HTML entry point
        (0, bun_test_1.expect)(frontendFiles.some((file) => file.endsWith('.html'))).toBe(true);
        // Should have assets directory (CSS/JS files are in assets/)
        (0, bun_test_1.expect)(frontendFiles.includes('assets')).toBe(true);
        // Verify tsup also produced its expected outputs
        const distFiles = node_fs_1.default.readdirSync(distDir);
        // Should have tsup outputs (index.js)
        (0, bun_test_1.expect)(distFiles.some((file) => file === 'index.js')).toBe(true);
        // Should still have vite build directory
        const viteBuildDirName = node_path_1.default.basename(viteBuildDir);
        (0, bun_test_1.expect)(distFiles.includes(viteBuildDirName)).toBe(true);
    }, 30000); // 30 second timeout for build process
});
