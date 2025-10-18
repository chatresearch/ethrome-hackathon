import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ResultsDisplay = ({ results }) => {
    if (results.length === 0) {
        return _jsx("div", { className: "results-empty", children: "Submit a protocol to see agent analysis" });
    }
    return (_jsx("div", { className: "results-display", children: results.map((result, idx) => (_jsxs("div", { className: "result-card", children: [_jsxs("div", { className: "agent-header", children: [_jsx("h3", { children: result.agent.toUpperCase() }), _jsx("div", { className: "capabilities", children: result.capabilities.map((cap, i) => (_jsx("span", { className: "capability-badge", children: cap }, i))) })] }), _jsx("p", { className: "response-text", children: result.response }), _jsx("div", { className: "timestamp", children: new Date(result.timestamp).toLocaleTimeString() })] }, idx))) }));
};
//# sourceMappingURL=ResultsDisplay.js.map