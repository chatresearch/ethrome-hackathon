"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const bun_test_1 = require("bun:test");
(0, bun_test_1.describe)('Environment Setup', () => {
    (0, bun_test_1.it)('should verify configuration files exist', () => {
        const requiredFiles = [
            'package.json',
            'tsconfig.json',
            'tsconfig.build.json',
            'tsup.config.ts',
            'bunfig.toml',
        ];
        for (const file of requiredFiles) {
            const filePath = node_path_1.default.join(process.cwd(), file);
            (0, bun_test_1.expect)(node_fs_1.default.existsSync(filePath)).toBe(true);
        }
    });
    (0, bun_test_1.it)('should have proper src directory structure', () => {
        const srcDir = node_path_1.default.join(process.cwd(), 'src');
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(srcDir)).toBe(true);
        const requiredSrcFiles = ['index.ts', 'plugin.ts'];
        for (const file of requiredSrcFiles) {
            const filePath = node_path_1.default.join(srcDir, file);
            (0, bun_test_1.expect)(node_fs_1.default.existsSync(filePath)).toBe(true);
        }
    });
    (0, bun_test_1.it)('should have a valid package.json with required fields', () => {
        const packageJsonPath = node_path_1.default.join(process.cwd(), 'package.json');
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(packageJsonPath)).toBe(true);
        const packageJson = JSON.parse(node_fs_1.default.readFileSync(packageJsonPath, 'utf8'));
        (0, bun_test_1.expect)(packageJson).toHaveProperty('name');
        (0, bun_test_1.expect)(typeof packageJson.name).toBe('string');
        (0, bun_test_1.expect)(packageJson.name.length).toBeGreaterThan(0);
        (0, bun_test_1.expect)(packageJson).toHaveProperty('version');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('type', 'module');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('main');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('module');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('types');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('dependencies');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('devDependencies');
        (0, bun_test_1.expect)(packageJson).toHaveProperty('scripts');
        // Check for required dependencies
        (0, bun_test_1.expect)(packageJson.dependencies).toHaveProperty('@elizaos/core');
        // Check for required scripts
        (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('build');
        (0, bun_test_1.expect)(packageJson.scripts).toHaveProperty('test');
    });
    (0, bun_test_1.it)('should have a valid tsconfig.json with required configuration', () => {
        const tsconfigPath = node_path_1.default.join(process.cwd(), 'tsconfig.json');
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(tsconfigPath)).toBe(true);
        const tsconfig = JSON.parse(node_fs_1.default.readFileSync(tsconfigPath, 'utf8'));
        (0, bun_test_1.expect)(tsconfig).toHaveProperty('compilerOptions');
        // Check compiler options
        (0, bun_test_1.expect)(tsconfig.compilerOptions).toHaveProperty('target');
        (0, bun_test_1.expect)(tsconfig.compilerOptions).toHaveProperty('module');
        (0, bun_test_1.expect)(tsconfig.compilerOptions).toHaveProperty('moduleResolution');
        (0, bun_test_1.expect)(tsconfig.compilerOptions).toHaveProperty('esModuleInterop');
    });
    (0, bun_test_1.it)('should have a valid tsup.config.ts for building', () => {
        const tsupConfigPath = node_path_1.default.join(process.cwd(), 'tsup.config.ts');
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(tsupConfigPath)).toBe(true);
        const tsupConfig = node_fs_1.default.readFileSync(tsupConfigPath, 'utf8');
        (0, bun_test_1.expect)(tsupConfig).toContain('defineConfig');
        (0, bun_test_1.expect)(tsupConfig).toContain('entry:');
        (0, bun_test_1.expect)(tsupConfig).toContain('src/index.ts');
    });
    (0, bun_test_1.it)('should have a valid README.md file', () => {
        const readmePath = node_path_1.default.join(process.cwd(), 'README.md');
        (0, bun_test_1.expect)(node_fs_1.default.existsSync(readmePath)).toBe(true);
        const readme = node_fs_1.default.readFileSync(readmePath, 'utf8');
        (0, bun_test_1.expect)(readme).toContain('# Project Starter');
    });
});
