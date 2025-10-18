import { useCallback, useState } from 'react';
export function useXMTP() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const sendMessage = useCallback(async (content) => {
        try {
            setError(null);
            // Detect environment: Vercel has VITE_REACT_APP_XMTP_API, local dev uses localhost
            // @ts-ignore
            const isVercel = !!import.meta.env.VITE_REACT_APP_XMTP_API;
            // @ts-ignore
            const apiUrl = isVercel
                // @ts-ignore
                ? import.meta.env.VITE_REACT_APP_XMTP_API
                : 'http://127.0.0.1:3003';
            // Try to reach XMTP agent with 8 second timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            try {
                const response = await fetch(`${apiUrl}/api/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: content }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }
                const data = await response.json();
                console.log('[useXMTP] Response received:', data);
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'user',
                        content,
                        timestamp: Date.now(),
                    },
                ]);
                return data;
            }
            catch (err) {
                clearTimeout(timeoutId);
                console.error('[useXMTP] Error:', err);
                // NO FALLBACK - fail hard
                const errorMsg = err instanceof Error
                    ? err.message
                    : 'Failed to connect to XMTP agent';
                throw new Error(`❌ XMTP Agent Error: ${errorMsg}\n\nMake sure XMTP agent is running on http://localhost:3003`);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
            throw err;
        }
    }, []);
    const addAgentResponse = useCallback((response) => {
        setMessages((prev) => [...prev, response]);
    }, []);
    return {
        messages,
        error,
        sendMessage,
        addAgentResponse,
    };
}
//# sourceMappingURL=useXMTP.js.map