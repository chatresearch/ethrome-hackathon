import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false, availableAgents = [
    { name: 'profile-roaster', description: 'Dating Profile Roast' },
    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
], agentAvatars = {}, agentPrices = {} }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showAgentMenu, setShowAgentMenu] = useState(false);
    const fileInputRef = useRef(null);
    const getAgentDisplay = (agentName) => {
        const price = agentPrices[agentName] ? ` - ${agentPrices[agentName]} ETH` : '';
        const agent = availableAgents.find(a => a.name === agentName);
        const description = agent?.description || agentName;
        return `${description}${price}`;
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
            await onSubmit(preview, selectedAgent || undefined);
            // Don't clear preview, let user see what was roasted
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsx("div", { className: "query-controls", children: _jsxs("div", { className: "agent-selector-wrapper", children: [_jsx("label", { className: "agent-label", children: "Choose Roaster (optional):" }), _jsxs("div", { className: "custom-agent-selector", children: [_jsx("button", { type: "button", className: "agent-selector-btn", onClick: () => setShowAgentMenu(!showAgentMenu), disabled: isLoading, children: selectedAgent ? (_jsxs("div", { className: "selected-agent-display", children: [agentAvatars[selectedAgent] && (_jsx("img", { src: agentAvatars[selectedAgent], alt: selectedAgent, className: "agent-icon-img" })), _jsx("span", { children: getAgentDisplay(selectedAgent) })] })) : (_jsx("span", { children: "\uD83C\uDFB2 Let me roast all of them" })) }), showAgentMenu && (_jsxs("div", { className: "agent-menu", children: [_jsxs("div", { className: "agent-menu-item", onClick: () => {
                                                setSelectedAgent(null);
                                                setShowAgentMenu(false);
                                            }, children: [_jsx("span", { className: "agent-menu-emoji", children: "\uD83C\uDFB2" }), _jsx("div", { className: "agent-menu-text", children: _jsx("div", { className: "agent-name", children: "Let me roast all of them" }) })] }), availableAgents.map((agent) => (_jsxs("div", { className: `agent-menu-item ${selectedAgent === agent.name ? 'active' : ''}`, onClick: () => {
                                                setSelectedAgent(agent.name);
                                                setShowAgentMenu(false);
                                            }, children: [agentAvatars[agent.name] && (_jsx("img", { src: agentAvatars[agent.name], alt: agent.name, className: "agent-menu-avatar" })), _jsxs("div", { className: "agent-menu-text", children: [_jsx("div", { className: "agent-name", children: agent.description }), agentPrices[agent.name] && (_jsxs("div", { className: "agent-price", children: ["\uD83D\uDCB0 ", agentPrices[agent.name], " ETH"] }))] })] }, agent.name)))] }))] })] }) }), _jsxs("div", { className: "query-input", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange, disabled: isLoading, className: "file-input", style: { display: 'none' } }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: isLoading, className: "upload-btn", children: preview ? '📷 Change Image' : '📸 Upload Selfie' }), preview && (_jsx("button", { type: "submit", disabled: isLoading, className: "submit-btn", children: isLoading ? 'Getting Roasted...' : 'Roast Me! 🔥' }))] }), preview && (_jsxs("div", { className: "preview-container", children: [_jsx("img", { src: preview, alt: "Preview", className: "preview-thumbnail" }), _jsx("p", { className: "preview-info", children: "Ready to be roasted?" })] })), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map