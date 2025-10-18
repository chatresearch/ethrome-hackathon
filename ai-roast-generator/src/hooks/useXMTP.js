import { useCallback, useState } from 'react';
export function useXMTP() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const sendMessage = useCallback(async (content) => {
        try {
            setError(null);
            // Detect environment
            // @ts-ignore
            const envUrl = import.meta.env.VITE_REACT_APP_XMTP_API;
            // @ts-ignore
            const viteUrl = import.meta.env.VITE_XMTP_API;
            // On Vercel, use env var. On localhost, use localhost:3003
            const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            const apiUrl = isProduction && (envUrl || viteUrl)
                ? (envUrl || viteUrl)
                : 'http://127.0.0.1:3003';
            console.log(`[useXMTP] Using API URL: ${apiUrl}`);
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
                const helpText = isProduction
                    ? `Make sure ngrok tunnel is running and REACT_APP_XMTP_API is set on Vercel`
                    : `Make sure XMTP agent is running on http://localhost:3003`;
                throw new Error(`❌ XMTP Agent Error: ${errorMsg}\n\n${helpText}\nUsing URL: ${apiUrl}`);
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