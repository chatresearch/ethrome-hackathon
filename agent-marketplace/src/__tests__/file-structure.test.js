"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const core_1 = require("@elizaos/core");
// Helper function to check if a file exists
function fileExists(filePath) {
    return node_fs_1.default.existsSync(filePath);
}
// Helper function to check if a directory exists
function directoryExists(dirPath) {
    return node_fs_1.default.existsSync(dirPath) && node_fs_1.default.statSync(dirPath).isDirectory();
}
(0, bun_test_1.describe)('Project Structure Validation', () => {
    const rootDir = node_path_1.default.resolve(__dirname, '../..');
    (0, bun_test_1.describe)('Directory Structure', () => {
        (0, bun_test_1.it)('should have the expected directory structure', () => {
            (0, bun_test_1.expect)(directoryExists(node_path_1.default.join(rootDir, 'src'))).toBe(true);
            (0, bun_test_1.expect)(directoryExists(node_path_1.default.join(rootDir, 'src', '__tests__'))).toBe(true);
        });
        (0, bun_test_1.it)('should have a dist directory after building', () => {
            // This test assumes the build has been run before testing
            (0, bun_test_1.expect)(directoryExists(node_path_1.default.join(rootDir, 'dist'))).toBe(true);
        });
    });
    (0, bun_test_1.describe)('Source Files', () => {
        (0, bun_test_1.it)('should contain the required source files', () => {
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'src', 'index.ts'))).toBe(true);
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'src', 'plugin.ts'))).toBe(true);
        });
        (0, bun_test_1.it)('should have properly structured main files', () => {
            // Check index.ts contains character definition
            const indexContent = node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'src', 'index.ts'), 'utf8');
            (0, bun_test_1.expect)(indexContent).toContain('character');
            (0, bun_test_1.expect)(indexContent).toContain('plugin');
            // Check plugin.ts contains plugin definition
            const pluginContent = node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'src', 'plugin.ts'), 'utf8');
            (0, bun_test_1.expect)(pluginContent).toContain('export default');
            (0, bun_test_1.expect)(pluginContent).toContain('actions');
        });
    });
    (0, bun_test_1.describe)('Configuration Files', () => {
        (0, bun_test_1.it)('should have the required configuration files', () => {
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'package.json'))).toBe(true);
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'tsconfig.json'))).toBe(true);
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'tsconfig.build.json'))).toBe(true);
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'tsup.config.ts'))).toBe(true);
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'bunfig.toml'))).toBe(true);
        });
        (0, bun_test_1.it)('should have the correct package.json configuration', () => {
            const packageJson = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'package.json'), 'utf8'));
            // Check package name exists and is valid
            (0, bun_test_1.expect)(packageJson.name).toBeTruthy();
            (0, bun_test_1.expect)(typeof packageJson.name).toBe('string');
            // Check scripts
            (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('build');
            (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('test');
            (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('test:coverage');
            // Check dependencies
            (0, bun_test_1.expect)(packageJson.dependencies).toHaveProperty('@elizaos/core');
            // Check dev dependencies - adjusted for actual dev dependencies
            (0, bun_test_1.expect)(packageJson.devDependencies).toBeTruthy();
            // bun test is built-in, no external test framework dependency needed
            (0, bun_test_1.expect)(packageJson.devDependencies).toHaveProperty('tsup');
        });
        (0, bun_test_1.it)('should have proper TypeScript configuration', () => {
            const tsConfig = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'tsconfig.json'), 'utf8'));
            // Check essential compiler options
            (0, bun_test_1.expect)(tsConfig).toHaveProperty('compilerOptions');
            (0, bun_test_1.expect)(tsConfig.compilerOptions).toHaveProperty('target');
            (0, bun_test_1.expect)(tsConfig.compilerOptions).toHaveProperty('module');
            // Check paths inclusion
            (0, bun_test_1.expect)(tsConfig).toHaveProperty('include');
        });
    });
    (0, bun_test_1.describe)('Build Output', () => {
        (0, bun_test_1.it)('should check for expected build output structure', () => {
            // Instead of checking specific files, check that the dist directory exists
            // and contains at least some files
            if (directoryExists(node_path_1.default.join(rootDir, 'dist'))) {
                const files = node_fs_1.default.readdirSync(node_path_1.default.join(rootDir, 'dist'));
                (0, bun_test_1.expect)(files.length).toBeGreaterThan(0);
                // Check for common output patterns rather than specific files
                const hasJsFiles = files.some((file) => file.endsWith('.js'));
                (0, bun_test_1.expect)(hasJsFiles).toBe(true);
            }
            else {
                // Skip test if dist directory doesn't exist yet
                core_1.logger.warn('Dist directory not found, skipping build output tests');
            }
        });
        (0, bun_test_1.it)('should verify the build process can be executed', () => {
            // Check that the build script exists in package.json
            const packageJson = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'package.json'), 'utf8'));
            (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('build');
            // Check that tsup.config.ts exists and contains proper configuration
            const tsupConfig = node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'tsup.config.ts'), 'utf8');
            (0, bun_test_1.expect)(tsupConfig).toContain('export default');
            (0, bun_test_1.expect)(tsupConfig).toContain('entry');
        });
    });
    (0, bun_test_1.describe)('Documentation', () => {
        (0, bun_test_1.it)('should have README files', () => {
            (0, bun_test_1.expect)(fileExists(node_path_1.default.join(rootDir, 'README.md'))).toBe(true);
        });
        (0, bun_test_1.it)('should have appropriate documentation content', () => {
            const readmeContent = node_fs_1.default.readFileSync(node_path_1.default.join(rootDir, 'README.md'), 'utf8');
            (0, bun_test_1.expect)(readmeContent).toContain('Project Starter');
            // Testing key sections exist without requiring specific keywords
            (0, bun_test_1.expect)(readmeContent).toContain('Development');
            (0, bun_test_1.expect)(readmeContent).toContain('Testing');
        });
    });
});
