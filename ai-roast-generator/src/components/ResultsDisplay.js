import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const ResultsDisplay = ({ results, s3ImageUrl }) => {
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [expandedIdx, setExpandedIdx] = useState(new Set());
    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };
    const toggleExpand = (idx) => {
        const newExpanded = new Set(expandedIdx);
        if (newExpanded.has(idx)) {
            newExpanded.delete(idx);
        }
        else {
            newExpanded.add(idx);
        }
        setExpandedIdx(newExpanded);
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
    if (results.length === 0) {
        return _jsx("div", { className: "results-empty", children: "Submit a query to see agent analysis" });
    }
    return (_jsx("div", { className: "results-display", children: results.map((result, idx) => (_jsxs("div", { className: "result-card", style: { animation: `slideIn 0.3s ease-out ${idx * 50}ms both` }, children: [_jsxs("div", { className: "agent-header", children: [_jsxs("div", { className: "agent-title", children: [_jsx("span", { className: "agent-icon", children: getAgentIcon(result.agent) }), _jsx("h3", { children: result.agent.toUpperCase() })] }), _jsxs("div", { className: "result-actions", children: [_jsx("button", { className: "copy-btn", onClick: () => handleCopy(result.response, idx), title: "Copy response", "aria-label": "Copy response to clipboard", children: copiedIdx === idx ? '✓ Copied!' : '📋 Copy' }), s3ImageUrl && (_jsx("button", { className: "share-btn", onClick: () => {
                                        const shareText = `Check out this roast! 🔥 ${s3ImageUrl}`;
                                        navigator.clipboard.writeText(shareText);
                                        setCopiedIdx(idx);
                                        setTimeout(() => setCopiedIdx(null), 2000);
                                    }, title: "Copy shareable link", "aria-label": "Copy shareable link", children: copiedIdx === idx ? '✓ Copied!' : '🔗 Share' }))] })] }), _jsx("div", { className: "capabilities", children: result.capabilities.length > 0 ? (result.capabilities.map((cap, i) => (_jsx("span", { className: "capability-badge", children: cap }, i)))) : (_jsx("span", { className: "capability-badge", children: "General AI Analysis" })) }), _jsxs("div", { className: "response-container", children: [_jsx("p", { className: `response-text ${expandedIdx.has(idx) ? 'expanded' : 'collapsed'}`, children: result.response }), result.response.length > 300 && (_jsx("button", { className: "expand-btn", onClick: () => toggleExpand(idx), children: expandedIdx.has(idx) ? '↑ Show less' : '↓ Show more' }))] }), _jsx("div", { className: "result-footer", children: _jsxs("time", { className: "timestamp", dateTime: new Date(result.timestamp).toISOString(), children: [new Date(result.timestamp).toLocaleTimeString(), " \u2022 ", new Date(result.timestamp).toLocaleDateString()] }) })] }, idx))) }));
};
//# sourceMappingURL=ResultsDisplay.js.map