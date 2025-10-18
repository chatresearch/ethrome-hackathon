import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false }) => {
    const [protocolName, setProtocolName] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!protocolName.trim()) {
            setError('Please enter a protocol name');
            return;
        }
        try {
            await onSubmit(`Analyze the protocol: ${protocolName}`);
            setProtocolName('');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsxs("div", { className: "query-input", children: [_jsx("input", { type: "text", value: protocolName, onChange: (e) => setProtocolName(e.target.value), placeholder: "Enter protocol name (e.g., Aave, Uniswap, Lido)", disabled: isLoading, className: "protocol-input" }), _jsx("button", { type: "submit", disabled: isLoading, className: "submit-btn", children: isLoading ? 'Analyzing...' : 'Analyze Protocol' })] }), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map