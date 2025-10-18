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
exports.getViteOutDir = getViteOutDir;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
/**
 * Extracts the Vite build.outDir from vite.config.ts
 * Handles both relative and absolute paths, accounting for Vite's root directory
 */
async function getViteOutDir(packageRoot) {
    const viteConfigPath = node_path_1.default.join(packageRoot, 'vite.config.ts');
    if (!node_fs_1.default.existsSync(viteConfigPath)) {
        throw new Error(`vite.config.ts not found at ${viteConfigPath}`);
    }
    // Import the vite config dynamically
    const configModule = await Promise.resolve(`${viteConfigPath}`).then(s => __importStar(require(s)));
    const config = typeof configModule.default === 'function'
        ? configModule.default({ command: 'build', mode: 'production' })
        : configModule.default;
    let outDir = config.build?.outDir || 'dist';
    const viteRoot = config.root || '.';
    // If outDir is relative, resolve it relative to the vite root
    if (!node_path_1.default.isAbsolute(outDir)) {
        const viteRootAbsolute = node_path_1.default.resolve(packageRoot, viteRoot);
        outDir = node_path_1.default.resolve(viteRootAbsolute, outDir);
    }
    // Ensure the path is relative to packageRoot for consistency
    return node_path_1.default.relative(packageRoot, outDir);
}
