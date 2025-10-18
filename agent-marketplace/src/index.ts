import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import { defiWizard } from './defi-wizard.ts';
import { securityGuru } from './security-guru.ts';
import { profileRoaster } from './profile-roaster.ts';
import { linkedinRoaster } from './linkedin-roaster.ts';
import { vibeRoaster } from './vibe-roaster.ts';

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

// Profile Roaster agent
const profileRoasterAgent: ProjectAgent = {
  character: profileRoaster,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing Profile Roaster');
    logger.info({ name: profileRoaster.name }, 'Name:');
  },
};

// LinkedIn Roaster agent
const linkedinRoasterAgent: ProjectAgent = {
  character: linkedinRoaster,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing LinkedIn Roaster');
    logger.info({ name: linkedinRoaster.name }, 'Name:');
  },
};

// Vibe Roaster agent
const vibeRoasterAgent: ProjectAgent = {
  character: vibeRoaster,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing Vibe Roaster');
    logger.info({ name: vibeRoaster.name }, 'Name:');
  },
};

const project: Project = {
  agents: [defiWizardAgent, securityGuruAgent, profileRoasterAgent, linkedinRoasterAgent, vibeRoasterAgent],
};

export default project;
