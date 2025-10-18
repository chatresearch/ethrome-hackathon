"use strict";
// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can change the location of this file or turn off processing using the
// 'supportFile' config option.
// ***********************************************************
Object.defineProperty(exports, "__esModule", { value: true });
// Import commands.js using ES2015 syntax:
require("./commands");
// Import Testing Library Cypress commands
require("@testing-library/cypress/add-commands");
// Import styles
require("../../../frontend/index.css");
// Import React mount function
const react_1 = require("@cypress/react");
// Make mount available globally
Cypress.Commands.add('mount', react_1.mount);
