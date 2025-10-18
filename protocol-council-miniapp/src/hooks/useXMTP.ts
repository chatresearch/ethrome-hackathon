import { useCallback, useState } from 'react';

interface XMTPMessage {
  sender: string;
  content: string;
  timestamp: number;
  agentType?: string;
}

export function useXMTP() {
  const [messages, setMessages] = useState<XMTPMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          content,
          timestamp: Date.now(),
        },
      ]);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    }
  }, []);

  const addAgentResponse = useCallback((response: XMTPMessage) => {
    setMessages((prev) => [...prev, response]);
  }, []);

  return {
    messages,
    error,
    sendMessage,
    addAgentResponse,
  };
}


