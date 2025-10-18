"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarterService = void 0;
const core_1 = require("@elizaos/core");
const zod_1 = require("zod");
/**
 * Define the configuration schema for the plugin with the following properties:
 *
 * @param {string} EXAMPLE_PLUGIN_VARIABLE - The name of the plugin (min length of 1, optional)
 * @returns {object} - The configured schema object
 */
const configSchema = zod_1.z.object({
    EXAMPLE_PLUGIN_VARIABLE: zod_1.z
        .string()
        .min(1, 'Example plugin variable is not provided')
        .optional()
        .transform((val) => {
        if (!val) {
            console.warn('Warning: Example plugin variable is not provided');
        }
        return val;
    }),
});
/**
 * Example HelloWorld action
 * This demonstrates the simplest possible action structure
 */
/**
 * Represents an action that responds with a simple hello world message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
const helloWorldAction = {
    name: 'HELLO_WORLD',
    similes: ['GREET', 'SAY_HELLO'],
    description: 'Responds with a simple hello world message',
    validate: async (_runtime, _message, _state) => {
        // Always valid
        return true;
    },
    handler: async (_runtime, message, _state, _options, callback, _responses) => {
        try {
            core_1.logger.info('Handling HELLO_WORLD action');
            // Simple response content
            const responseContent = {
                text: 'hello world!',
                actions: ['HELLO_WORLD'],
                source: message.content.source,
            };
            // Call back with the hello world message
            await callback(responseContent);
            return {
                text: 'Sent hello world greeting',
                values: {
                    success: true,
                    greeted: true,
                },
                data: {
                    actionName: 'HELLO_WORLD',
                    messageId: message.id,
                    timestamp: Date.now(),
                },
                success: true,
            };
        }
        catch (error) {
            core_1.logger.error({ error }, 'Error in HELLO_WORLD action:');
            return {
                text: 'Failed to send hello world greeting',
                values: {
                    success: false,
                    error: 'GREETING_FAILED',
                },
                data: {
                    actionName: 'HELLO_WORLD',
                    error: error instanceof Error ? error.message : String(error),
                },
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },
    examples: [
        [
            {
                name: '{{name1}}',
                content: {
                    text: 'Can you say hello?',
                },
            },
            {
                name: '{{name2}}',
                content: {
                    text: 'hello world!',
                    actions: ['HELLO_WORLD'],
                },
            },
        ],
    ],
};
/**
 * Example Hello World Provider
 * This demonstrates the simplest possible provider implementation
 */
const helloWorldProvider = {
    name: 'HELLO_WORLD_PROVIDER',
    description: 'A simple example provider',
    get: async (_runtime, _message, _state) => {
        return {
            text: 'I am a provider',
            values: {},
            data: {},
        };
    },
};
class StarterService extends core_1.Service {
    constructor(runtime) {
        super(runtime);
        this.capabilityDescription = 'This is a starter service which is attached to the agent through the starter plugin.';
    }
    static async start(runtime) {
        core_1.logger.info('*** Starting starter service ***');
        const service = new StarterService(runtime);
        return service;
    }
    static async stop(runtime) {
        core_1.logger.info('*** Stopping starter service ***');
        // get the service from the runtime
        const service = runtime.getService(StarterService.serviceType);
        if (!service) {
            throw new Error('Starter service not found');
        }
        service.stop();
    }
    async stop() {
        core_1.logger.info('*** Stopping starter service instance ***');
    }
}
exports.StarterService = StarterService;
StarterService.serviceType = 'starter';
const plugin = {
    name: 'starter',
    description: 'A starter plugin for Eliza',
    // Set lowest priority so real models take precedence
    priority: -1000,
    config: {
        EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
    },
    async init(config) {
        core_1.logger.info('*** Initializing starter plugin ***');
        try {
            const validatedConfig = await configSchema.parseAsync(config);
            // Set all environment variables at once
            for (const [key, value] of Object.entries(validatedConfig)) {
                if (value)
                    process.env[key] = value;
            }
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                throw new Error(`Invalid plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`);
            }
            throw error;
        }
    },
    models: {
        [core_1.ModelType.TEXT_SMALL]: async (_runtime, { prompt, stopSequences = [] }) => {
            return 'Never gonna give you up, never gonna let you down, never gonna run around and desert you...';
        },
        [core_1.ModelType.TEXT_LARGE]: async (_runtime, { prompt, stopSequences = [], maxTokens = 8192, temperature = 0.7, frequencyPenalty = 0.7, presencePenalty = 0.7, }) => {
            return 'Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...';
        },
    },
    routes: [
        {
            name: 'helloworld',
            path: '/helloworld',
            type: 'GET',
            handler: async (_req, res) => {
                // send a response
                res.json({
                    message: 'Hello World!',
                });
            },
        },
    ],
    events: {
        MESSAGE_RECEIVED: [
            async (params) => {
                core_1.logger.info('MESSAGE_RECEIVED event received');
                // print the keys
                core_1.logger.info({ keys: Object.keys(params) }, 'MESSAGE_RECEIVED param keys');
            },
        ],
        VOICE_MESSAGE_RECEIVED: [
            async (params) => {
                core_1.logger.info('VOICE_MESSAGE_RECEIVED event received');
                // print the keys
                core_1.logger.info({ keys: Object.keys(params) }, 'VOICE_MESSAGE_RECEIVED param keys');
            },
        ],
        WORLD_CONNECTED: [
            async (params) => {
                core_1.logger.info('WORLD_CONNECTED event received');
                // print the keys
                core_1.logger.info({ keys: Object.keys(params) }, 'WORLD_CONNECTED param keys');
            },
        ],
        WORLD_JOINED: [
            async (params) => {
                core_1.logger.info('WORLD_JOINED event received');
                // print the keys
                core_1.logger.info({ keys: Object.keys(params) }, 'WORLD_JOINED param keys');
            },
        ],
    },
    services: [StarterService],
    actions: [helloWorldAction],
    providers: [helloWorldProvider],
};
exports.default = plugin;
