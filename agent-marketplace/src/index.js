"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.character = exports.projectAgent = void 0;
const core_1 = require("@elizaos/core");
const character_ts_1 = require("./character.ts");
const initCharacter = ({ runtime }) => {
    core_1.logger.info('Initializing character');
    core_1.logger.info({ name: character_ts_1.character.name }, 'Name:');
};
exports.projectAgent = {
    character: character_ts_1.character,
    init: async (runtime) => await initCharacter({ runtime }),
    // plugins: [starterPlugin], <-- Import custom plugins here
};
const project = {
    agents: [exports.projectAgent],
};
var character_ts_2 = require("./character.ts");
Object.defineProperty(exports, "character", { enumerable: true, get: function () { return character_ts_2.character; } });
exports.default = project;
