"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
// https://vite.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    root: 'src/frontend',
    build: {
        outDir: '../../dist/frontend',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path_1.default.resolve(__dirname, 'src/frontend/index.html'),
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@tanstack/react-query'],
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
            '@elizaos/core': path_1.default.resolve(__dirname, '../../core/src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
