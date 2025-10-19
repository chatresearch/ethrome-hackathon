import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
export const ResultsDisplay = ({ results, s3ImageUrl }) => {
    const [copiedIdx, setCopiedIdx] = useState(null);
    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };
    const handleShare = (agentName, roastText, idx) => {
        const cleanedText = cleanRoastText(roastText);
        const shortRoast = cleanedText.substring(0, 200);
        const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
        const fullShareUrl = `${window.location.origin}${shareableUrl}`;
        const shareText = `Just got roasted by ${agentName}! 🔥\n\n"${shortRoast}..."\n\n${fullShareUrl}`;
        handleCopy(shareText, idx);
    };
    const handleTwitterShare = (agentName, roastText) => {
        const cleanedText = cleanRoastText(roastText);
        const shortRoast = cleanedText.substring(0, 100);
        const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
        const fullShareUrl = `${window.location.origin}${shareableUrl}`;
        const text = `Just got roasted by ${agentName}! 🔥\n"${shortRoast}..."\n\nTry AI Roast Generator`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullShareUrl)}`;
        window.open(url, 'twitter-share', 'width=550,height=420');
    };
    const handleFarcasterShare = (agentName, roastText) => {
        const cleanedText = cleanRoastText(roastText);
        const shortRoast = cleanedText.substring(0, 100);
        const shareableUrl = `/roast?image=${encodeURIComponent(s3ImageUrl || '')}&agent=${encodeURIComponent(agentName)}&text=${encodeURIComponent(cleanedText)}`;
        const fullShareUrl = `${window.location.origin}${shareableUrl}`;
        const text = `Just got roasted by ${agentName}! 🔥\n"${shortRoast}..."\n\nTry AI Roast Generator at ${fullShareUrl}`;
        const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, 'farcaster-share', 'width=550,height=420');
    };
    const getAgentIcon = (agentName) => {
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
    };
    const cleanRoastText = (text) => {
        // Remove only the first line [AGENT-NAME] and the Capabilities line
        // Split by first double newline to separate header from content
        const lines = text.split('\n');
        // Find where the actual roast content starts (after capabilities line)
        let startIdx = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Capabilities:')) {
                startIdx = i + 1;
                // Skip empty lines after capabilities
                while (startIdx < lines.length && lines[startIdx].trim() === '') {
                    startIdx++;
                }
                break;
            }
        }
        return lines.slice(startIdx).join('\n').trim();
    };
    if (results.length === 0) {
        return _jsx("div", { className: "results-empty", children: "Submit a query to see agent analysis" });
    }
    return (_jsx("div", { className: "results-display", children: results.map((result, idx) => (_jsxs("div", { className: "result-card", style: { animation: `slideIn 0.3s ease-out ${idx * 50}ms both` }, children: [_jsxs("div", { className: "agent-header", children: [_jsxs("div", { className: "agent-title", children: [_jsx("span", { className: "agent-icon", children: getAgentIcon(result.agent) }), _jsx("h3", { children: result.agent.toUpperCase() })] }), _jsxs("div", { className: "result-actions", children: [_jsx("button", { className: "copy-btn", onClick: () => handleCopy(cleanRoastText(result.response), idx), title: "Copy response", "aria-label": "Copy response to clipboard", children: copiedIdx === idx ? '✓ Copied!' : '📋 Copy' }), s3ImageUrl && (_jsxs(_Fragment, { children: [_jsx("button", { className: "share-btn", onClick: () => handleTwitterShare(result.agent, cleanRoastText(result.response)), title: "Share on Twitter/X", "aria-label": "Share on Twitter", children: "\uD835\uDD4F Tweet" }), _jsx("button", { className: "share-btn", onClick: () => handleFarcasterShare(result.agent, cleanRoastText(result.response)), title: "Share on Farcaster", "aria-label": "Share on Farcaster", children: "\uD83C\uDFAD Cast" }), _jsx("button", { className: "share-btn", onClick: () => handleShare(result.agent, cleanRoastText(result.response), idx), title: "Copy shareable text", "aria-label": "Copy shareable text", children: copiedIdx === idx ? '✓ Copied!' : '🔗 Share' })] }))] })] }), _jsx("div", { className: "capabilities", children: result.capabilities.map((cap, capIdx) => (_jsx("span", { className: "capability-badge", children: cap }, capIdx))) }), _jsx("div", { className: "response-text", children: cleanRoastText(result.response) }), _jsx("div", { className: "response-container" }), _jsx("div", { className: "result-footer", children: _jsxs("time", { className: "timestamp", dateTime: new Date(result.timestamp).toISOString(), children: [new Date(result.timestamp).toLocaleTimeString(), " \u2022 ", new Date(result.timestamp).toLocaleDateString()] }) })] }, idx))) }));
};
//# sourceMappingURL=ResultsDisplay.js.map