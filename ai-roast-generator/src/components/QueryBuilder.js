import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false, availableAgents = [
    { name: 'profile-roaster', description: 'Dating Profile Roast' },
    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
] }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const getAgentIcon = (agentName) => {
        switch (agentName) {
            case 'profile-roaster': return '💕';
            case 'linkedin-roaster': return '💼';
            case 'vibe-roaster': return '✨';
            default: return '😈';
        }
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsx("div", { className: "query-controls", children: _jsxs("div", { className: "agent-selector-wrapper", children: [_jsx("label", { htmlFor: "agent-select", className: "agent-label", children: "Choose Roaster (optional):" }), _jsxs("select", { id: "agent-select", value: selectedAgent || '', onChange: (e) => setSelectedAgent(e.target.value || null), disabled: isLoading, className: "agent-select", children: [_jsx("option", { value: "", children: "Let me roast all of them" }), availableAgents.map((agent) => (_jsxs("option", { value: agent.name, children: [getAgentIcon(agent.name), " ", agent.description] }, agent.name)))] })] }) }), _jsxs("div", { className: "query-input", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange, disabled: isLoading, className: "file-input", style: { display: 'none' } }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: isLoading, className: "upload-btn", children: preview ? '📷 Change Image' : '📸 Upload Selfie' }), preview && (_jsx("button", { type: "submit", disabled: isLoading, className: "submit-btn", children: isLoading ? 'Getting Roasted...' : 'Roast Me! 🔥' }))] }), preview && (_jsxs("div", { className: "preview-container", children: [_jsx("img", { src: preview, alt: "Preview", className: "preview-thumbnail" }), _jsx("p", { className: "preview-info", children: "Ready to be roasted?" })] })), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map