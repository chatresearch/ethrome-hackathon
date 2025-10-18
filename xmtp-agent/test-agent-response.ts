import * as http from 'http';

// Test harness to debug getting actual responses from ElizaOS agents
const ELIZAOS_PORT = 3002;
const AGENT_ID = 'adb273ad-5c79-06a3-bd62-266b870651e6'; // defi-wizard

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testAgentResponses() {
  console.log('\n🧪 ElizaOS Agent Response Test Harness\n');
  
  try {
    // Step 1: Get agent details first
    console.log('📋 [1] Getting agent details...');
    const agentResp = await fetch(`http://localhost:${ELIZAOS_PORT}/api/agents/${AGENT_ID}`);
    
    if (!agentResp.ok) {
      console.log(`   ⚠️  Agent details not available (${agentResp.status})`);
    } else {
      const agentData = await agentResp.json();
      console.log(`   ✅ Agent: ${agentData.data?.character?.name || 'Unknown'}`);
      console.log(`   System: ${agentData.data?.character?.system?.substring(0, 100)}...\n`);
    }

    // Step 2: Create session
    console.log('📝 [2] Creating session...');
    const sessionResp = await fetch(`http://localhost:${ELIZAOS_PORT}/api/messaging/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: AGENT_ID,
        userId: generateUUID(),
      }),
    });

    if (!sessionResp.ok) {
      const error = await sessionResp.text();
      throw new Error(`Session creation failed (${sessionResp.status}): ${error}`);
    }

    const sessionData = await sessionResp.json() as { sessionId?: string; id?: string };
    const sessionId = sessionData.sessionId || sessionData.id;
    
    if (!sessionId) {
      throw new Error('No session ID returned');
    }
    
    console.log(`✅ Session created: ${sessionId}\n`);

    // Step 3: Send messages with different approaches
    const testMessages = [
      {
        name: 'Simple question',
        content: 'What is yield farming?',
      },
      {
        name: 'Complex question',
        content: 'How should I diversify my yield farming portfolio across different protocols?',
      },
      {
        name: 'With metadata',
        content: 'Analyze this: What is yield farming?',
        metadata: { type: 'analysis' },
      },
    ];

    for (const msg of testMessages) {
      console.log(`📤 Testing: ${msg.name}`);
      console.log(`   Message: "${msg.content}"`);
      
      const body: any = { content: msg.content, userId: generateUUID() };
      if (msg.metadata) body.metadata = msg.metadata;
      
      const messageResp = await fetch(
        `http://localhost:${ELIZAOS_PORT}/api/messaging/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!messageResp.ok) {
        const error = await messageResp.text();
        console.log(`   ❌ FAILED (${messageResp.status})`);
        try {
          const parsed = JSON.parse(error);
          console.log(`   Error: ${parsed.error?.message}\n`);
        } catch {
          console.log(`   Error: ${error.substring(0, 100)}...\n`);
        }
      } else {
        const result = await messageResp.json();
        console.log(`   ✅ Response received`);
        console.log(`   Response type: ${typeof result}`);
        console.log(`   Response keys: ${Object.keys(result).join(', ')}`);
        
        // Try different ways to extract the actual response
        const responses = [];
        if (result.text) responses.push(['text', result.text]);
        if (result.response) responses.push(['response', result.response]);
        if (result.content) responses.push(['content', result.content]);
        if (result.message) responses.push(['message', result.message]);
        if (result.messages?.[0]) responses.push(['messages[0]', JSON.stringify(result.messages[0])]);
        if (result.data?.text) responses.push(['data.text', result.data.text]);
        if (result.data?.response) responses.push(['data.response', result.data.response]);
        
        if (responses.length > 0) {
          console.log(`   Extracted responses:`);
          responses.forEach(([key, value]) => {
            const preview = String(value).substring(0, 80);
            console.log(`     - ${key}: "${preview}${String(value).length > 80 ? '...' : ''}"`);
          });
        } else {
          console.log(`   Full response: ${JSON.stringify(result).substring(0, 200)}...`);
        }
        console.log('');
      }
    }

    // Step 4: Try getting session messages
    console.log('📋 [3] Getting session messages...');
    const messagesResp = await fetch(
      `http://localhost:${ELIZAOS_PORT}/api/messaging/sessions/${sessionId}/messages`,
      { method: 'GET' }
    );

    if (messagesResp.ok) {
      const messages = await messagesResp.json();
      console.log(`✅ Got ${messages.messages?.length || 0} messages from session`);
      if (messages.messages && messages.messages.length > 0) {
        console.log(`   Latest message: ${JSON.stringify(messages.messages[messages.messages.length - 1]).substring(0, 200)}...\n`);
        
        // Look for agent responses
        console.log('📋 [4] Looking for agent responses...');
        const agentMessages = messages.messages.filter((m: any) => m.isAgent === true);
        if (agentMessages.length > 0) {
          console.log(`✅ Found ${agentMessages.length} agent message(s):`);
          agentMessages.forEach((m: any, idx: number) => {
            console.log(`   Agent message ${idx + 1}: "${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}"`);
          });
        } else {
          console.log(`⚠️  No agent responses yet. All messages:`);
          messages.messages.forEach((m: any, idx: number) => {
            console.log(`   Message ${idx + 1} (isAgent=${m.isAgent}): "${m.content.substring(0, 80)}..."`);
          });
          
          // Try polling
          console.log(`\n⏳ Polling for agent response (5 attempts with 1s delay)...`);
          for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const pollResp = await fetch(
              `http://localhost:${ELIZAOS_PORT}/api/messaging/sessions/${sessionId}/messages`,
              { method: 'GET' }
            );
            if (pollResp.ok) {
              const pollData = await pollResp.json();
              const agentMsgs = pollData.messages.filter((m: any) => m.isAgent === true);
              if (agentMsgs.length > 0) {
                console.log(`✅ Got agent response after ${i + 1} poll(s):`);
                agentMsgs.forEach((m: any) => {
                  console.log(`   Agent: "${m.content.substring(0, 150)}${m.content.length > 150 ? '...' : ''}"`);
                });
                break;
              } else {
                console.log(`   Poll ${i + 1}: ${pollData.messages.length} messages, still no agent response`);
              }
            }
          }
        }
      }
    } else {
      console.log(`⚠️  Could not fetch session messages (${messagesResp.status})\n`);
    }

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Test failed: ${msg}`);
    console.error(`\nMake sure ElizaOS is running on port ${ELIZAOS_PORT}:`);
    console.error(`   cd agent-marketplace && npm start`);
  }
}

testAgentResponses().catch(console.error);
