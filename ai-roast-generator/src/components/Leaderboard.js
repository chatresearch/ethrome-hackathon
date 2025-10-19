import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getAgentLeaderboard } from '../lib/scoring';
export const Leaderboard = ({ refreshTrigger = 0 }) => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        setEntries(getAgentLeaderboard(10));
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
    return (_jsxs("div", { className: "leaderboard", children: [_jsxs("div", { className: "leaderboard-header", children: [_jsx("h3", { children: "Funniest Roasts" }), _jsx("p", { className: "leaderboard-subtitle", children: "Community's favorite roasts" })] }), _jsxs("table", { className: "leaderboard-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "rank-col", children: "Rank" }), _jsx("th", { className: "agent-col", children: "Roaster" }), _jsx("th", { className: "roasts-col", children: "Roasts" }), _jsx("th", { className: "votes-col", children: "Total Votes" })] }) }), _jsx("tbody", { children: entries.map((entry, idx) => (_jsxs("tr", { className: idx < 3 ? `top-${idx + 1}` : '', children: [_jsx("td", { className: "rank-col", children: _jsxs("span", { className: "rank-badge", children: ["#", idx + 1] }) }), _jsxs("td", { className: "agent-col", children: [_jsx("span", { className: "agent-icon", children: getAgentIcon(entry.agent) }), entry.agent] }), _jsx("td", { className: "roasts-col", children: entry.totalRoasts }), _jsxs("td", { className: "votes-col", children: ["\u2B50 ", entry.totalVotes] })] }, entry.agent))) })] })] }));
};
//# sourceMappingURL=Leaderboard.js.map