import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false, availableAgents = [
    { name: 'defi-wizard', description: 'DeFi Protocol Analysis' },
    { name: 'security-guru', description: 'Security Audit' }
] }) => {
    const [protocolName, setProtocolName] = useState('');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!protocolName.trim()) {
            setError('Please enter a protocol name or question');
            return;
        }
        try {
            const query = selectedAgent
                ? `[REQUEST TO ${selectedAgent.toUpperCase()}] ${protocolName}`
                : `Analyze the protocol: ${protocolName}`;
            await onSubmit(query, selectedAgent || undefined);
            setProtocolName('');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsx("div", { className: "query-controls", children: _jsxs("div", { className: "agent-selector-wrapper", children: [_jsx("label", { htmlFor: "agent-select", className: "agent-label", children: "Choose Agent (optional):" }), _jsxs("select", { id: "agent-select", value: selectedAgent || '', onChange: (e) => setSelectedAgent(e.target.value || null), disabled: isLoading, className: "agent-select", children: [_jsx("option", { value: "", children: "Auto-route by query" }), availableAgents.map((agent) => (_jsxs("option", { value: agent.name, children: [agent.name === 'defi-wizard' ? '💰' : '🔒', " ", agent.name] }, agent.name)))] })] }) }), _jsxs("div", { className: "query-input", children: [_jsx("input", { type: "text", value: protocolName, onChange: (e) => setProtocolName(e.target.value), placeholder: "Enter protocol name (e.g., Aave, Uniswap, Lido) or ask a question", disabled: isLoading, className: "protocol-input" }), _jsx("button", { type: "submit", disabled: isLoading, className: "submit-btn", children: isLoading ? 'Analyzing...' : 'Analyze' })] }), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map