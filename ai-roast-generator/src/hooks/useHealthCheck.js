import { useEffect, useState } from 'react';
export function useHealthCheck() {
    const [xmtpHealth, setXmtpHealth] = useState({
        status: 'checking',
        message: 'Checking XMTP agent...',
    });
    useEffect(() => {
        const checkHealth = async () => {
            try {
                // @ts-ignore
                const envUrl = import.meta.env.VITE_REACT_APP_XMTP_API;
                // @ts-ignore
                const viteUrl = import.meta.env.VITE_XMTP_API;
                const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
                const apiUrl = isProduction && (envUrl || viteUrl)
                    ? (envUrl || viteUrl)
                    : 'http://127.0.0.1:3003';
                console.log('[Health] Checking XMTP agent at:', apiUrl);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                try {
                    const response = await fetch(`${apiUrl}/api/health`, {
                        method: 'GET',
                        signal: controller.signal,
                    });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        console.log('[Health] ✅ XMTP agent is healthy');
                        setXmtpHealth({ status: 'healthy', message: '✅ Connected to XMTP agent' });
                    }
                    else {
                        console.log('[Health] ❌ XMTP agent returned:', response.status);
                        setXmtpHealth({ status: 'unhealthy', message: `❌ XMTP agent unhealthy (${response.status})` });
                    }
                }
                catch (err) {
                    clearTimeout(timeoutId);
                    const message = err instanceof Error ? err.message : 'Unknown error';
                    console.log('[Health] ❌ XMTP agent unreachable:', message);
                    setXmtpHealth({ status: 'unhealthy', message: `❌ Cannot reach XMTP agent at ${apiUrl}` });
                }
            }
            catch (err) {
                console.error('[Health] Check failed:', err);
                setXmtpHealth({ status: 'unhealthy', message: '❌ Health check failed' });
            }
        };
        checkHealth();
    }, []);
    return xmtpHealth;
}
//# sourceMappingURL=useHealthCheck.js.map