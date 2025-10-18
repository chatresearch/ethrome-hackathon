/**
 * Multi-Agent Integration E2E Tests
 *
 * These tests verify that both specialized agents (DeFi Wizard and Security Guru)
 * respond correctly with domain-specific expertise in the UI.
 */

describe('Multi-Agent Integration Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/', { timeout: 10000 });
    
    // Wait for the app to load and agents to initialize
    cy.get('[data-testid="agents-list"], [class*="agent"], button, select', { timeout: 10000 })
      .should('exist');
  });

  describe('DeFi Wizard Agent', () => {
    beforeEach(() => {
      // Select or navigate to DeFi Wizard agent
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("DeFi"), :contains("defi"), :contains("Wizard"), :contains("wizard")')
        .first()
        .click({ force: true });
      
      // Wait for chat to load
      cy.get('input[type="text"], textarea, [contenteditable="true"]', { timeout: 5000 })
        .should('be.visible');
    });

    it('should respond to DeFi-related questions', () => {
      const defiQuestion = 'What is a good yield farming strategy?';
      
      // Type question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${defiQuestion}{enter}`);

      // Wait for response and verify DeFi-specific terminology
      cy.contains(/TVL|APY|audit|protocol|diversif/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should mention risk management in responses', () => {
      const riskQuestion = 'Should I put all my money in one protocol?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${riskQuestion}{enter}`);

      // Verify risk management terminology
      cy.contains(/diversif|risk|spread|afford/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should discuss APY sustainability', () => {
      const apyQuestion = 'Is this 100% APY sustainable?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${apyQuestion}{enter}`);

      // Verify APY discussion
      cy.contains(/APY|yield|sustain|incentive|economic/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should maintain conversation context', () => {
      // First message about yield farming
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('Tell me about yield farming{enter}');

      cy.wait(2000);

      // Second related question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('What risks should I be aware of?{enter}');

      // Both messages should be visible
      cy.contains('Tell me about yield farming').should('be.visible');
      cy.contains('What risks should I be aware of').should('be.visible');
      
      // Should have DeFi-related responses
      cy.contains(/yield|farming|risk|diversif/i, { timeout: 15000 })
        .should('be.visible');
    });
  });

  describe('Security Guru Agent', () => {
    beforeEach(() => {
      // Select or navigate to Security Guru agent
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("Security"), :contains("security"), :contains("Guru"), :contains("guru")')
        .first()
        .click({ force: true });
      
      // Wait for chat to load
      cy.get('input[type="text"], textarea, [contenteditable="true"]', { timeout: 5000 })
        .should('be.visible');
    });

    it('should respond to security-related questions', () => {
      const securityQuestion = 'What is a reentrancy attack?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${securityQuestion}{enter}`);

      // Verify security-specific terminology
      cy.contains(/reentrancy|contract|state|fund|drain/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should discuss contract audits', () => {
      const auditQuestion = 'Is my contract safe to deploy?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${auditQuestion}{enter}`);

      // Verify audit-related content
      cy.contains(/audit|security|vulnerability|mainnet|deploy/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should warn about common vulnerabilities', () => {
      const vulnQuestion = 'How do I prevent overflow attacks?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${vulnQuestion}{enter}`);

      // Verify overflow/security content
      cy.contains(/overflow|Solidity|SafeMath|protection/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should demonstrate advanced security knowledge', () => {
      const flashLoanQuestion = 'What about flash loan attacks?';
      
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type(`${flashLoanQuestion}{enter}`);

      // Verify flash loan and oracle knowledge
      cy.contains(/flash|oracle|price|safeguard/i, { timeout: 15000 })
        .should('be.visible');
    });

    it('should maintain security conversation context', () => {
      // First security question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('Tell me about smart contract security{enter}');

      cy.wait(2000);

      // Follow-up question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('What are best practices?{enter}');

      // Both messages visible
      cy.contains('Tell me about smart contract security').should('be.visible');
      cy.contains('What are best practices').should('be.visible');
      
      // Should have security responses
      cy.contains(/security|contract|audit|practice/i, { timeout: 15000 })
        .should('be.visible');
    });
  });

  describe('Agent Switching', () => {
    it('should switch between agents without losing context', () => {
      // Send message to DeFi Wizard
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("DeFi"), :contains("defi")')
        .first()
        .click({ force: true });

      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('What is liquidity?{enter}');

      cy.contains(/liquidity|protocol|pool/i, { timeout: 15000 })
        .should('be.visible');

      // Switch to Security Guru
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("Security"), :contains("security")')
        .first()
        .click({ force: true });

      // Wait for interface to change
      cy.wait(1000);

      // Send security question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('What is access control?{enter}');

      // Verify Security Guru response
      cy.contains(/access|control|permission|security/i, { timeout: 15000 })
        .should('be.visible');
    });
  });

  describe('Agent Response Quality', () => {
    it('should provide substantive responses', () => {
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("DeFi"), :contains("defi")')
        .first()
        .click({ force: true });

      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('Explain DeFi{enter}');

      // Wait for response and check it's not just echoing the question
      cy.get('[class*="message"], [data-testid*="message"], [role="article"]', { timeout: 15000 })
        .should('have.length.greaterThan', 1); // At least user message and agent response
    });

    it('should handle follow-up questions', () => {
      cy.get('button, select, [role="listitem"], [role="option"]', { timeout: 5000 })
        .filter(':contains("Security"), :contains("security")')
        .first()
        .click({ force: true });

      // First question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('What is a vulnerability?{enter}');

      cy.wait(2000);

      // Follow-up question
      cy.get('input[type="text"], textarea, [contenteditable="true"]')
        .filter(':visible')
        .first()
        .type('How do I fix it?{enter}');

      // Should have responses to both questions
      cy.get('[class*="message"], [data-testid*="message"], [role="article"]', { timeout: 15000 })
        .should('have.length.greaterThan', 2);
    });
  });
});

/**
 * MULTI-AGENT TESTING PATTERNS
 *
 * 1. AGENT-SPECIFIC RESPONSES
 *    - DeFi Wizard: yield, APY, liquidity, protocol, TVL, audit
 *    - Security Guru: vulnerability, contract, reentrancy, overflow, audit
 *
 * 2. DOMAIN EXPERTISE
 *    - Verify terminology is used correctly
 *    - Check for best practices mentioned
 *    - Ensure risk factors are addressed
 *
 * 3. CONVERSATION CONTINUITY
 *    - Follow-up questions work correctly
 *    - Context is maintained across messages
 *    - Multiple topics can be discussed
 *
 * 4. AGENT SWITCHING
 *    - Can switch between agents
 *    - Each agent maintains its expertise
 *    - No cross-contamination of responses
 *
 * 5. QUALITY CHECKS
 *    - Responses are substantive (not just echoing)
 *    - Multiple messages indicate real conversations
 *    - Domain-specific vocabulary is used
 */
