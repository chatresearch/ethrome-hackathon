import * as http from 'http';

// Test harness to debug ElizaOS Sessions API message format
const ELIZAOS_PORT = 3002;
const AGENT_ID = 'adb273ad-5c79-06a3-bd62-266b870651e6'; // defi-wizard

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testSessionsAPI() {
  console.log('\n🧪 ElizaOS Sessions API Test Harness\n');
  
  try {
    // Step 1: Create session
    console.log('📝 [1] Creating session...');
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

    // Step 2: Test different message formats
    const testFormats = [
      {
        name: 'Format 1: text + agentId + userId',
        body: {
          text: 'What is yield farming?',
          agentId: AGENT_ID,
          userId: generateUUID(),
        }
      },
      {
        name: 'Format 2: text + userId (no agentId)',
        body: {
          text: 'What is yield farming?',
          userId: generateUUID(),
        }
      },
      {
        name: 'Format 3: text only',
        body: {
          text: 'What is yield farming?',
        }
      },
      {
        name: 'Format 4: message property',
        body: {
          message: 'What is yield farming?',
          userId: generateUUID(),
        }
      },
      {
        name: 'Format 5: content property',
        body: {
          content: 'What is yield farming?',
          userId: generateUUID(),
        }
      },
      {
        name: 'Format 6: Complex with user/channel/source',
        body: {
          text: 'What is yield farming?',
          user: { id: generateUUID() },
          channel: { id: 'default' },
          source: 'REST',
        }
      },
      {
        name: 'Format 7: Nested author',
        body: {
          text: 'What is yield farming?',
          author: { id: generateUUID() },
        }
      },
    ];

    for (const format of testFormats) {
      console.log(`📤 Testing: ${format.name}`);
      console.log(`   Payload: ${JSON.stringify(format.body)}`);
      
      const messageResp = await fetch(
        `http://localhost:${ELIZAOS_PORT}/api/messaging/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(format.body),
        }
      );

      if (messageResp.ok) {
        const result = await messageResp.json();
        console.log(`   ✅ SUCCESS`);
        console.log(`   Response keys: ${Object.keys(result).join(', ')}\n`);
      } else {
        const error = await messageResp.text();
        try {
          const parsed = JSON.parse(error);
          console.log(`   ❌ FAILED (${messageResp.status})`);
          console.log(`   Error: ${parsed.error?.message || error}\n`);
        } catch {
          console.log(`   ❌ FAILED (${messageResp.status})`);
          console.log(`   Error: ${error.substring(0, 100)}...\n`);
        }
      }
    }

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Test failed: ${msg}`);
    console.error(`\nMake sure ElizaOS is running on port ${ELIZAOS_PORT}:`);
    console.error(`   cd agent-marketplace && npm start`);
  }
}

testSessionsAPI().catch(console.error);
