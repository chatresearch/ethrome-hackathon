import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function getAgentIcon(agentName) {
    if (agentName.includes('defi'))
        return '💰';
    if (agentName.includes('security'))
        return '🔒';
    if (agentName.includes('profile'))
        return '💕';
    if (agentName.includes('linkedin'))
        return '💼';
    if (agentName.includes('vibe'))
        return '✨';
    return '😈';
}
export default function RoastPage() {
    const [roastData, setRoastData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Parse query parameters
        const params = new URLSearchParams(window.location.search);
        const image = params.get('image') || undefined;
        const agent = params.get('agent') || 'AI Roaster';
        const text = params.get('text') || 'Got roasted!';
        setRoastData({ image, agent, text });
        // Set OG meta tags for social sharing
        document.title = `Roasted by ${agent} 🔥 | AI Roast Generator`;
        // Add OG meta tags
        const setMeta = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };
        setMeta('og:title', `Roasted by ${agent} 🔥`);
        setMeta('og:description', text.substring(0, 150));
        if (image) {
            setMeta('og:image', image);
            setMeta('og:image:width', '1200');
            setMeta('og:image:height', '630');
        }
        setMeta('og:type', 'website');
        setMeta('og:url', window.location.href);
        setIsLoading(false);
    }, []);
    if (isLoading) {
        return _jsx("div", { style: { textAlign: 'center', padding: '40px' }, children: "Loading roast..." });
    }
    const { image, agent, text } = roastData;
    const icon = agent ? getAgentIcon(agent) : '😈';
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsxs("div", { style: styles.header, children: [_jsx("span", { style: styles.icon, children: icon }), _jsx("h1", { style: styles.agentName, children: agent })] }), image && (_jsx("img", { src: image, alt: "Roasted image", style: styles.image, onError: (e) => {
                        e.currentTarget.style.display = 'none';
                    } })), _jsx("div", { style: styles.roastBox, children: _jsx("p", { style: styles.roastText, children: text }) }), _jsx("div", { style: styles.footer, children: _jsxs("p", { style: styles.footerText, children: ["Got roasted? Try the", ' ', _jsx("a", { href: "/", style: styles.link, children: "AI Roast Generator" }), ' ', "and get your own! \uD83D\uDD25"] }) })] }) }));
}
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '20px',
    },
    icon: {
        fontSize: '48px',
        marginRight: '10px',
    },
    agentName: {
        margin: '10px 0 0 0',
        fontSize: '28px',
        color: '#333',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        marginBottom: '30px',
        maxHeight: '400px',
        objectFit: 'cover',
    },
    roastBox: {
        background: '#f8f8f8',
        borderLeft: '4px solid #667eea',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
    },
    roastText: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#333',
        margin: '0',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
    },
    footerText: {
        color: '#666',
        fontSize: '14px',
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};
//# sourceMappingURL=roast.js.map