// Test direct agent message endpoint

const ELIZAOS_PORT = 3002;
const AGENT_ID = 'adb273ad-5c79-06a3-bd62-266b870651e6'; // defi-wizard

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testDirectAgent() {
  console.log('\n🧪 Direct Agent Message Test\n');
  
  try {
    // Try 1: POST to /api/agents/{agentId}/message
    console.log('📤 [1] Trying POST /api/agents/{agentId}/message');
    const resp1 = await fetch(`http://localhost:${ELIZAOS_PORT}/api/agents/${AGENT_ID}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'What is yield farming?',
        userId: generateUUID(),
      }),
    });
    console.log(`   Status: ${resp1.status}`);
    if (resp1.ok) {
      const data = await resp1.json();
      console.log(`   ✅ Response: ${JSON.stringify(data).substring(0, 150)}...\n`);
    } else {
      console.log(`   ❌ Failed\n`);
    }

    // Try 2: POST to /api/agents/{agentId}/act
    console.log('📤 [2] Trying POST /api/agents/{agentId}/act');
    const resp2 = await fetch(`http://localhost:${ELIZAOS_PORT}/api/agents/${AGENT_ID}/act`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'What is yield farming?',
        userId: generateUUID(),
      }),
    });
    console.log(`   Status: ${resp2.status}`);
    if (resp2.ok) {
      const data = await resp2.json();
      console.log(`   ✅ Response: ${JSON.stringify(data).substring(0, 150)}...\n`);
    } else {
      console.log(`   ❌ Failed\n`);
    }

    // Try 3: Check messaging endpoints
    console.log('📋 [3] Listing all messaging endpoints');
    console.log('   GET /api/messaging/servers');
    const serversResp = await fetch(`http://localhost:${ELIZAOS_PORT}/api/messaging/servers`);
    console.log(`   Status: ${serversResp.status}\n`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error}`);
  }
}

testDirectAgent().catch(console.error);
