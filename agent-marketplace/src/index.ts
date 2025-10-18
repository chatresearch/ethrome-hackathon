import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import { defiWizard } from './defi-wizard.ts';
import { securityGuru } from './security-guru.ts';

// DeFi Wizard agent
const defiWizardAgent: ProjectAgent = {
  character: defiWizard,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing DeFi Wizard');
    logger.info({ name: defiWizard.name }, 'Name:');
  },
};

// Security Guru agent
const securityGuruAgent: ProjectAgent = {
  character: securityGuru,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing Security Guru');
    logger.info({ name: securityGuru.name }, 'Name:');
  },
};

const project: Project = {
  agents: [defiWizardAgent, securityGuruAgent],
};

export default project;
