import { describe, expect, it } from 'bun:test';
import { defiWizard } from '../defi-wizard';

describe('DeFi Wizard Agent', () => {
  it('should have correct name', () => {
    expect(defiWizard.name).toBe('defi-wizard');
  });

  it('should have all required character fields', () => {
    expect(defiWizard).toHaveProperty('name');
    expect(defiWizard).toHaveProperty('bio');
    expect(defiWizard).toHaveProperty('plugins');
    expect(defiWizard).toHaveProperty('system');
    expect(defiWizard).toHaveProperty('messageExamples');
    expect(defiWizard).toHaveProperty('topics');
    expect(defiWizard).toHaveProperty('style');
  });

  it('should have DeFi-focused system prompt', () => {
    expect(defiWizard.system).toContain('DeFi');
    expect(defiWizard.system).toContain('yield farming');
    expect(defiWizard.system).toContain('risk management');
  });

  it('should have DeFi-related bio entries', () => {
    expect(Array.isArray(defiWizard.bio)).toBe(true);
    expect(defiWizard.bio.length).toBeGreaterThan(0);
    
    const bioCombined = defiWizard.bio.join(' ');
    expect(bioCombined).toMatch(/DeFi|yield|liquidity|protocol/i);
  });

  it('should have DeFi-specific topics', () => {
    expect(Array.isArray(defiWizard.topics)).toBe(true);
    const topicsIncludeDeFi = defiWizard.topics.some(topic => 
      topic.toLowerCase().includes('yield') || 
      topic.toLowerCase().includes('liquidity') ||
      topic.toLowerCase().includes('defi')
    );
    expect(topicsIncludeDeFi).toBe(true);
  });

  it('should have required plugins', () => {
    expect(defiWizard.plugins).toContain('@elizaos/plugin-sql');
    if (process.env.OPENAI_API_KEY) {
      expect(defiWizard.plugins).toContain('@elizaos/plugin-openai');
    }
  });

  it('should have bootstrap plugin included', () => {
    if (!process.env.IGNORE_BOOTSTRAP) {
      expect(defiWizard.plugins).toContain('@elizaos/plugin-bootstrap');
    }
  });

  it('should have message examples with DeFi content', () => {
    expect(Array.isArray(defiWizard.messageExamples)).toBe(true);
    expect(defiWizard.messageExamples.length).toBeGreaterThan(0);

    // Check first example has proper structure
    const firstExample = defiWizard.messageExamples[0];
    expect(Array.isArray(firstExample)).toBe(true);
    expect(firstExample.length).toBeGreaterThan(1);

    // Verify at least one example mentions DeFi concepts
    const exampleText = firstExample
      .map(msg => msg.content?.text || '')
      .join(' ')
      .toLowerCase();
    
    expect(exampleText).toMatch(/yield|apy|protocol|liquidity|diversif/i);
  });

  it('should have conversational style guidelines', () => {
    expect(defiWizard.style).toHaveProperty('all');
    expect(defiWizard.style).toHaveProperty('chat');
    expect(Array.isArray(defiWizard.style.all)).toBe(true);
    expect(Array.isArray(defiWizard.style.chat)).toBe(true);
  });

  it('should have avatar configured', () => {
    expect(defiWizard.settings).toHaveProperty('avatar');
    expect(typeof defiWizard.settings.avatar).toBe('string');
    expect(defiWizard.settings.avatar.length).toBeGreaterThan(0);
  });
});
