# Integration Guide: XMTP Agent ↔ ElizaOS Agents

## Overview

Your XMTP agent currently returns mock responses. To integrate with your ElizaOS agents, follow these steps.

## Step 1: Ensure ElizaOS is Running

Make sure your ElizaOS agents are running on port 3002:

```bash
cd agent-marketplace
elizaos start --port 3002
```

You should see:
```
Started agent: defi-wizard
Started agent: security-guru
Started 2/2 project agents
```

## Step 2: Update the `callAgent()` Function

Edit `src/index.ts` and replace this section:

```typescript
async function callAgent(
  agent: Agent,
  message: string
): Promise<string> {
  // TODO: Replace with actual ElizaOS agent calls
  const responses: Record<Agent, string> = {
    "defi-wizard": `DeFi Wizard response...`,
    "security-guru": `Security Guru response...`,
  };
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return responses[agent];
}
```

With this:

```typescript
async function callAgent(
  agent: Agent,
  message: string
): Promise<string> {
  const agentIds: Record<Agent, string> = {
    "defi-wizard": "adb273ad-5c79-06a3-bd62-266b870651e6",
    "security-guru": "23296f74-bc2c-012b-bc06-d3a1b6f5e61b",
  };

  try {
    const response = await fetch(
      `http://localhost:3002/api/agents/${agentIds[agent]}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data?.text || data.message || "No response from agent";
  } catch (error) {
    console.error(`Error calling ${agent}:`, error);
    return `Sorry, I encountered an error processing your request.`;
  }
}
```

## Step 3: Test the Integration

1. Install dependencies:
```bash
npm install
```

2. Set up .env:
```bash
cp .env.example .env
# Add a PRIVATE_KEY for testing
```

3. Run the agent:
```bash
npm run dev
```

4. Send a test message via XMTP to your agent address

5. Check the console output and logs in both terminals

## Step 4: Troubleshooting

### Agent not responding
- Check if ElizaOS is running on port 3002
- Run: `curl http://localhost:3002/api/agents`
- Should see your agents listed

### Wrong agent IDs
The agent IDs in the code above are from our setup. If yours are different:
1. Run: `curl http://localhost:3002/api/agents | jq`
2. Copy the `id` values from the output
3. Update the `agentIds` object in the code

### Connection refused
- Make sure ElizaOS is running
- Check if port 3002 is open: `lsof -i :3002`

### Timeout errors
- ElizaOS agents might be slow to respond (first time)
- Try increasing the timeout in the fetch call
- Ensure your OPENAI_API_KEY is valid

## Step 5: Deploy for Production

Once tested locally:

1. Update ElizaOS host URL (replace `localhost:3002` with your deployed URL)
2. Get a permanent wallet/private key
3. Deploy the XMTP agent to a server (Heroku, Railway, AWS Lambda, etc.)
4. Submit to XMTP bounty!

## Example Conversation Flow

```
User (via XMTP):
"What's a good DeFi yield strategy?"

Your XMTP Agent:
1. Parses keywords → matches "DeFi"
2. Calls: POST http://localhost:3002/api/agents/adb273ad-.../...
3. Receives response from DeFi Wizard (running ElizaOS + OpenAI)
4. Sends response back via XMTP

User receives:
"DeFi Wizard response: [Agent response]"
```

## Next Steps

- [ ] Update `callAgent()` with actual ElizaOS endpoints
- [ ] Test with XMTP
- [ ] Deploy to persistent host
- [ ] Create Base mini app wrapper (optional $1,500 bounty)
- [ ] Submit to bounty

