"use strict";
// ***********************************************
// This file is where you can create custom Cypress commands
// and overwrite existing commands.
//
// For comprehensive examples, visit:
// https://on.cypress.io/custom-commands
// ***********************************************
Object.defineProperty(exports, "__esModule", { value: true });
// Custom command to check if element is in dark mode
Cypress.Commands.add('shouldBeDarkMode', () => {
    cy.get('html').should('have.class', 'dark');
});
// Custom command to set ELIZA_CONFIG
Cypress.Commands.add('setElizaConfig', (config) => {
    cy.window().then((win) => {
        win.ELIZA_CONFIG = config;
    });
});
