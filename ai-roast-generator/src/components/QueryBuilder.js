import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false, availableAgents = [
    { name: 'profile-roaster', description: 'Dating Profile Roast' },
    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
], agentAvatars = {}, agentPrices = {} }) => {
    const [selectedAgents, setSelectedAgents] = useState(new Set());
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const toggleAgent = (agentName) => {
        const newSelected = new Set(selectedAgents);
        if (newSelected.has(agentName)) {
            newSelected.delete(agentName);
        }
        else {
            newSelected.add(agentName);
        }
        setSelectedAgents(newSelected);
    };
    const calculateCost = () => {
        if (selectedAgents.size === 0)
            return '0.00000';
        let total = 0;
        selectedAgents.forEach(agent => {
            const price = agentPrices[agent];
            if (price) {
                total += parseFloat(price);
            }
        });
        return total.toFixed(5);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setError(null);
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }
        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result;
            setPreview(base64);
        };
        reader.onerror = () => {
            setError('Failed to read file');
        };
        reader.readAsDataURL(file);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!preview) {
            setError('Please upload an image first');
            return;
        }
        try {
            // Submit with all selected agents (comma-separated) or undefined for all
            const agentsParam = selectedAgents.size === 0 ? undefined : Array.from(selectedAgents).join(',');
            await onSubmit(preview, agentsParam);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    };
    const totalCost = calculateCost();
    const agentCount = selectedAgents.size;
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsx("div", { className: "query-controls", children: _jsxs("div", { className: "agent-selector-wrapper", children: [_jsx("label", { className: "agent-label", children: "Choose Roasters (select one or more):" }), _jsxs("div", { className: "agent-chooser", children: [_jsxs("div", { className: `agent-option ${agentCount === 0 ? 'active' : ''}`, onClick: () => setSelectedAgents(new Set()), title: "All roasters will roast your image", children: [_jsx("div", { className: "agent-option-icon", children: "\uD83C\uDFB2" }), _jsx("div", { className: "agent-option-text", children: "Random (All)" })] }), availableAgents.map((agent) => (_jsxs("div", { className: `agent-option ${selectedAgents.has(agent.name) ? 'active' : ''}`, onClick: () => toggleAgent(agent.name), title: agent.description, children: [agentAvatars[agent.name] ? (_jsx("img", { src: agentAvatars[agent.name], alt: agent.name, className: "agent-option-icon" })) : (_jsx("div", { className: "agent-option-icon", children: "\uD83D\uDD04" })), _jsx("div", { className: "agent-option-text", children: agent.description }), agentPrices[agent.name] && (_jsxs("div", { className: "agent-option-price", children: ["\uD83D\uDCB0 ", agentPrices[agent.name]] }))] }, agent.name)))] }), agentCount > 0 && (_jsx("div", { className: "cost-summary", children: _jsxs("p", { className: "cost-text", children: [agentCount, " ", agentCount === 1 ? 'roaster' : 'roasters', " \u00D7 0.00001 ETH = ", _jsxs("strong", { children: [totalCost, " ETH"] })] }) }))] }) }), _jsxs("div", { className: "query-input", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange, disabled: isLoading, className: "file-input", style: { display: 'none' } }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: isLoading, className: "upload-btn", children: preview ? '📷 Change Image' : '📸 Upload Selfie' }), preview && (_jsx("button", { type: "button", onClick: handleSubmit, disabled: isLoading, className: "submit-btn", children: isLoading ? 'Getting Roasted...' : agentCount > 0 ? `Roast me for $${(parseFloat(totalCost) * 1).toFixed(5)} 🔥` : 'Roast Me! 🔥' }))] }), preview && (_jsxs("div", { className: "preview-container", children: [_jsx("img", { src: preview, alt: "Preview", className: "preview-thumbnail" }), _jsx("p", { className: "preview-info", children: "Ready to be roasted?" })] })), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map