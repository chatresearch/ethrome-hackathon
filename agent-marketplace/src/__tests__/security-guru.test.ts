import { describe, expect, it } from 'bun:test';
import { securityGuru } from '../security-guru';

describe('Security Guru Agent', () => {
  it('should have correct name', () => {
    expect(securityGuru.name).toBe('security-guru');
  });

  it('should have all required character fields', () => {
    expect(securityGuru).toHaveProperty('name');
    expect(securityGuru).toHaveProperty('bio');
    expect(securityGuru).toHaveProperty('plugins');
    expect(securityGuru).toHaveProperty('system');
    expect(securityGuru).toHaveProperty('messageExamples');
    expect(securityGuru).toHaveProperty('topics');
    expect(securityGuru).toHaveProperty('style');
  });

  it('should have security-focused system prompt', () => {
    expect(securityGuru.system).toContain('security');
    expect(securityGuru.system).toContain('smart contract');
    expect(securityGuru.system).toMatch(/vulnerab/i);
  });

  it('should have security-related bio entries', () => {
    expect(Array.isArray(securityGuru.bio)).toBe(true);
    expect(securityGuru.bio.length).toBeGreaterThan(0);
    
    const bioCombined = securityGuru.bio.join(' ');
    expect(bioCombined).toMatch(/security|audit|vulnerab|exploit/i);
  });

  it('should have security-specific topics', () => {
    expect(Array.isArray(securityGuru.topics)).toBe(true);
    const topicsIncludeSecurity = securityGuru.topics.some(topic => 
      topic.toLowerCase().includes('security') || 
      topic.toLowerCase().includes('audit') ||
      topic.toLowerCase().includes('vulnerability')
    );
    expect(topicsIncludeSecurity).toBe(true);
  });

  it('should cover multiple vulnerability types', () => {
    const topicsLower = securityGuru.topics.map(t => t.toLowerCase()).join(' ');
    expect(topicsLower).toMatch(/reentrancy|overflow|access|audit/i);
  });

  it('should have required plugins', () => {
    expect(securityGuru.plugins).toContain('@elizaos/plugin-sql');
    if (process.env.OPENAI_API_KEY) {
      expect(securityGuru.plugins).toContain('@elizaos/plugin-openai');
    }
  });

  it('should have bootstrap plugin included', () => {
    if (!process.env.IGNORE_BOOTSTRAP) {
      expect(securityGuru.plugins).toContain('@elizaos/plugin-bootstrap');
    }
  });

  it('should have message examples with security content', () => {
    expect(Array.isArray(securityGuru.messageExamples)).toBe(true);
    expect(securityGuru.messageExamples.length).toBeGreaterThan(0);

    // Check first example has proper structure
    const firstExample = securityGuru.messageExamples[0];
    expect(Array.isArray(firstExample)).toBe(true);
    expect(firstExample.length).toBeGreaterThan(1);

    // Verify at least one example mentions security concepts
    const exampleText = firstExample
      .map(msg => msg.content?.text || '')
      .join(' ')
      .toLowerCase();
    
    expect(exampleText).toMatch(/audit|security|vulnerab|contract|deploy/i);
  });

  it('should demonstrate reentrancy attack knowledge', () => {
    const examplesText = securityGuru.messageExamples
      .map(example => 
        example.map(msg => msg.content?.text || '').join(' ')
      )
      .join(' ')
      .toLowerCase();
    
    expect(examplesText).toMatch(/reentrancy|reentrant/i);
  });

  it('should mention best practices', () => {
    expect(securityGuru.system).toMatch(/best practice|audit|security|recommend/i);
  });

  it('should have conversational style guidelines', () => {
    expect(securityGuru.style).toHaveProperty('all');
    expect(securityGuru.style).toHaveProperty('chat');
    expect(Array.isArray(securityGuru.style.all)).toBe(true);
    expect(Array.isArray(securityGuru.style.chat)).toBe(true);
  });

  it('should include technical depth in style', () => {
    const styleText = [
      ...securityGuru.style.all,
      ...securityGuru.style.chat,
    ].join(' ').toLowerCase();
    
    expect(styleText).toMatch(/technical|thorough|precise/i);
  });

  it('should have avatar configured', () => {
    expect(securityGuru.settings).toHaveProperty('avatar');
    expect(typeof securityGuru.settings.avatar).toBe('string');
    expect(securityGuru.settings.avatar.length).toBeGreaterThan(0);
  });

  it('should have flash loan attack knowledge', () => {
    const examplesText = securityGuru.messageExamples
      .map(example => 
        example.map(msg => msg.content?.text || '').join(' ')
      )
      .join(' ')
      .toLowerCase();
    
    expect(examplesText).toMatch(/flash|oracle|price/i);
  });
});
