"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const plugin_1 = __importDefault(require("../plugin"));
(0, bun_test_1.describe)('Plugin Routes', () => {
    (0, bun_test_1.it)('should have routes defined', () => {
        (0, bun_test_1.expect)(plugin_1.default.routes).toBeDefined();
        if (plugin_1.default.routes) {
            (0, bun_test_1.expect)(Array.isArray(plugin_1.default.routes)).toBe(true);
            (0, bun_test_1.expect)(plugin_1.default.routes.length).toBeGreaterThan(0);
        }
    });
    (0, bun_test_1.it)('should have a route for /helloworld', () => {
        if (plugin_1.default.routes) {
            const helloWorldRoute = plugin_1.default.routes.find((route) => route.path === '/helloworld');
            (0, bun_test_1.expect)(helloWorldRoute).toBeDefined();
            if (helloWorldRoute) {
                (0, bun_test_1.expect)(helloWorldRoute.type).toBe('GET');
                (0, bun_test_1.expect)(typeof helloWorldRoute.handler).toBe('function');
            }
        }
    });
    (0, bun_test_1.it)('should handle route requests correctly', async () => {
        if (plugin_1.default.routes) {
            const helloWorldRoute = plugin_1.default.routes.find((route) => route.path === '/helloworld');
            if (helloWorldRoute && helloWorldRoute.handler) {
                // Create mock request and response objects
                const mockReq = {};
                const mockRes = {
                    json: (0, bun_test_1.mock)(),
                };
                // Mock runtime object as third parameter
                const mockRuntime = {};
                // Call the route handler
                await helloWorldRoute.handler(mockReq, mockRes, mockRuntime);
                // Verify response
                (0, bun_test_1.expect)(mockRes.json).toHaveBeenCalledTimes(1);
                (0, bun_test_1.expect)(mockRes.json).toHaveBeenCalledWith({
                    message: 'Hello World!',
                });
            }
        }
    });
    (0, bun_test_1.it)('should validate route structure', () => {
        if (plugin_1.default.routes) {
            // Validate each route
            plugin_1.default.routes.forEach((route) => {
                (0, bun_test_1.expect)(route).toHaveProperty('path');
                (0, bun_test_1.expect)(route).toHaveProperty('type');
                (0, bun_test_1.expect)(route).toHaveProperty('handler');
                // Path should be a string starting with /
                (0, bun_test_1.expect)(typeof route.path).toBe('string');
                (0, bun_test_1.expect)(route.path.startsWith('/')).toBe(true);
                // Type should be a valid HTTP method
                (0, bun_test_1.expect)(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).toContain(route.type);
                // Handler should be a function
                (0, bun_test_1.expect)(typeof route.handler).toBe('function');
            });
        }
    });
    (0, bun_test_1.it)('should have unique route paths', () => {
        if (plugin_1.default.routes) {
            const paths = plugin_1.default.routes.map((route) => route.path);
            const uniquePaths = new Set(paths);
            (0, bun_test_1.expect)(paths.length).toBe(uniquePaths.size);
        }
    });
});
