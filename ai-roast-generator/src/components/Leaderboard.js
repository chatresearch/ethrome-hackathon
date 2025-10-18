import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getTopRoasts } from '../lib/scoring';
export const Leaderboard = ({ refreshTrigger = 0 }) => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        setEntries(getTopRoasts(10));
    }, [refreshTrigger]);
    if (entries.length === 0) {
        return (_jsx("div", { className: "leaderboard-empty", children: "No votes yet. Start voting to appear on the leaderboard!" }));
    }
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
    return (_jsx("div", { className: "leaderboard", children: _jsxs("table", { className: "leaderboard-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "rank-col", children: "Rank" }), _jsx("th", { className: "agent-col", children: "Agent" }), _jsx("th", { className: "roast-col", children: "Roast" }), _jsx("th", { className: "votes-col", children: "Votes" })] }) }), _jsx("tbody", { children: entries.map((entry, idx) => {
                        const shareableUrl = entry.imageUrl
                            ? `/api/roast?image=${encodeURIComponent(entry.imageUrl)}&agent=${encodeURIComponent(entry.agent)}&text=${encodeURIComponent(entry.roastText)}`
                            : '#';
                        return (_jsxs("tr", { className: idx < 3 ? `top-${idx + 1}` : '', children: [_jsx("td", { className: "rank-col", children: _jsxs("span", { className: "rank-badge", children: ["#", idx + 1] }) }), _jsxs("td", { className: "agent-col", children: [_jsx("span", { className: "agent-icon", children: getAgentIcon(entry.agent) }), entry.agent] }), _jsx("td", { className: "roast-col", children: _jsxs("a", { href: shareableUrl, target: "_blank", rel: "noopener noreferrer", className: "roast-link", children: [entry.roastText.substring(0, 50), "..."] }) }), _jsxs("td", { className: "votes-col", children: ["\u2B50 ", entry.votes] })] }, entry.id));
                    }) })] }) }));
};
//# sourceMappingURL=Leaderboard.js.map