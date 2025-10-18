import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getLeaderboard } from '../lib/scoring';
export const Leaderboard = ({ refreshTrigger = 0 }) => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        setEntries(getLeaderboard());
    }, [refreshTrigger]);
    if (entries.length === 0) {
        return (_jsx("div", { className: "leaderboard-empty", children: "No votes yet. Start voting to appear on the leaderboard!" }));
    }
    return (_jsx("div", { className: "leaderboard", children: _jsxs("table", { className: "leaderboard-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "rank-col", children: "Rank" }), _jsx("th", { className: "user-col", children: "User" }), _jsx("th", { className: "accuracy-col", children: "Accuracy" }), _jsx("th", { className: "votes-col", children: "Votes" })] }) }), _jsx("tbody", { children: entries.map((entry, idx) => (_jsxs("tr", { className: idx < 3 ? `top-${idx + 1}` : '', children: [_jsx("td", { className: "rank-col", children: _jsxs("span", { className: "rank-badge", children: ["#", entry.rank] }) }), _jsx("td", { className: "user-col", children: entry.userId }), _jsx("td", { className: "accuracy-col", children: _jsxs("span", { className: "accuracy-score", children: [entry.accuracyScore, "%"] }) }), _jsx("td", { className: "votes-col", children: entry.totalVotes })] }, entry.userId))) })] }) }));
};
//# sourceMappingURL=Leaderboard.js.map