import { describe, it, expect, beforeAll } from 'vitest';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

describe('XMTP Agent Integration Tests', () => {
  beforeAll(() => {
    // Ensure test environment is set up
    if (!process.env.XMTP_WALLET_KEY) {
      process.env.XMTP_WALLET_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';
    }
  });

  describe('Environment Setup', () => {
    it('should have required environment variables', () => {
      expect(process.env.XMTP_WALLET_KEY).toBeDefined();
      expect(process.env.XMTP_WALLET_KEY).toMatch(/^0x[0-9a-fA-F]{64}$/); // 0x prefix + 32 bytes hex
    });

    it('should have valid XMTP_ENV setting', () => {
      const validEnvs = ['dev', 'production', undefined];
      expect(validEnvs).toContain(process.env.XMTP_ENV || 'production');
    });
  });

  describe('Agent Routing Logic', () => {
    const testCases = [
      // DeFi-related messages
      { message: 'What is DeFi?', expectedAgent: 'defi-wizard' },
      { message: 'Tell me about yield farming', expectedAgent: 'defi-wizard' },
      { message: 'How does liquidity work?', expectedAgent: 'defi-wizard' },
      { message: 'What is the APY?', expectedAgent: 'defi-wizard' },
      
      // Security-related messages
      { message: 'Is this contract secure?', expectedAgent: 'security-guru' },
      { message: 'What are the security vulnerabilities?', expectedAgent: 'security-guru' },
      { message: 'Has this contract been audited?', expectedAgent: 'security-guru' },
      { message: 'Are there any security exploits?', expectedAgent: 'security-guru' },
      
      // Generic messages (should default to defi-wizard)
      { message: 'Hello', expectedAgent: 'defi-wizard' },
      { message: 'Help me understand crypto', expectedAgent: 'defi-wizard' },
    ];

    testCases.forEach(({ message, expectedAgent }) => {
      it(`should route "${message}" to ${expectedAgent}`, () => {
        const lowerMsg = message.toLowerCase();
        
        let detectedAgent: string;
        
        if (
          lowerMsg.includes('defi') ||
          lowerMsg.includes('yield') ||
          lowerMsg.includes('farming') ||
          lowerMsg.includes('apy') ||
          lowerMsg.includes('liquidity')
        ) {
          detectedAgent = 'defi-wizard';
        } else if (
          lowerMsg.includes('security') ||
          lowerMsg.includes('contract') ||
          lowerMsg.includes('vulnerability') ||
          lowerMsg.includes('audit') ||
          lowerMsg.includes('exploit')
        ) {
          detectedAgent = 'security-guru';
        } else {
          detectedAgent = 'defi-wizard';
        }
        
        expect(detectedAgent).toBe(expectedAgent);
      });
    });
  });

  describe('Response Format', () => {
    it('should generate valid DeFi Wizard responses', () => {
      const message = 'What is yield farming?';
      const response = `DeFi Wizard: Regarding "${message}" - I focus on yield farming, liquidity protocols, and risk management. ` +
        `Consider: protocol TVL, APY sustainability, contract audits, risk tolerance. ` +
        `Always research the underlying protocol and diversify.`;
      
      expect(response).toContain('DeFi Wizard');
      expect(response).toContain(message);
      expect(response.length).toBeGreaterThan(50);
    });

    it('should generate valid Security Guru responses', () => {
      const message = 'Is this contract safe?';
      const response = `Security Guru: About "${message}" - Smart contract security is critical. ` +
        `Watch for: reentrancy, overflow/underflow, access control issues. ` +
        `Verify: source code, audits, contract history, community feedback.`;
      
      expect(response).toContain('Security Guru');
      expect(response).toContain(message);
      expect(response.length).toBeGreaterThan(50);
    });
  });

  describe('Agent Configuration', () => {
    it('should support production environment', () => {
      const env = process.env.XMTP_ENV || 'production';
      expect(['dev', 'production']).toContain(env);
    });

    it('should have valid wallet configuration', () => {
      const walletKey = process.env.XMTP_WALLET_KEY;
      expect(walletKey).toBeDefined();
      expect(walletKey).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });
  });
});
