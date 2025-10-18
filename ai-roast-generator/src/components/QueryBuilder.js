import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
export const QueryBuilder = ({ onSubmit, isLoading = false, availableAgents = [
    { name: 'profile-roaster', description: 'Dating Profile Roast' },
    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
], agentAvatars = {}, agentPrices = {} }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [testLoading, setTestLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const fileInputRef = useRef(null);
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
            setTestResult(null);
        };
        reader.onerror = () => {
            setError('Failed to read file');
        };
        reader.readAsDataURL(file);
    };
    const handleTestS3Upload = async () => {
        if (!preview) {
            setError('Please upload an image first');
            return;
        }
        setTestLoading(true);
        setTestResult(null);
        setError(null);
        try {
            console.log('[Test] Testing S3 upload before payment...');
            const response = await fetch('/api/test-s3-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: preview }),
            });
            if (!response.ok) {
                throw new Error(`Upload test failed: ${response.status}`);
            }
            const result = await response.json();
            console.log('[Test] Upload test successful:', result);
            setTestResult(`✅ ${result.message} (${result.imageSizeKB} KB)`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('[Test] Upload test failed:', message);
            setError(`Test failed: ${message}`);
            setTestResult(`❌ ${message}`);
        }
        finally {
            setTestLoading(false);
        }
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: "query-builder", children: [_jsx("div", { className: "query-controls", children: _jsxs("div", { className: "agent-selector-wrapper", children: [_jsx("label", { className: "agent-label", children: "Choose Roaster (optional):" }), _jsxs("div", { className: "agent-chooser", children: [_jsxs("div", { className: `agent-option ${selectedAgent === null ? 'active' : ''}`, onClick: () => setSelectedAgent(null), title: "All roasters will roast your image", children: [_jsx("div", { className: "agent-option-icon", children: "\uD83C\uDFB2" }), _jsx("div", { className: "agent-option-text", children: "All Roasters" })] }), availableAgents.map((agent) => (_jsxs("div", { className: `agent-option ${selectedAgent === agent.name ? 'active' : ''}`, onClick: () => setSelectedAgent(agent.name), title: agent.description, children: [agentAvatars[agent.name] ? (_jsx("img", { src: agentAvatars[agent.name], alt: agent.name, className: "agent-option-icon" })) : (_jsx("div", { className: "agent-option-icon", children: "\uD83D\uDD04" })), _jsx("div", { className: "agent-option-text", children: agent.description }), agentPrices[agent.name] && (_jsxs("div", { className: "agent-option-price", children: ["\uD83D\uDCB0 ", agentPrices[agent.name]] }))] }, agent.name)))] })] }) }), _jsxs("div", { className: "query-input", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange, disabled: isLoading || testLoading, className: "file-input", style: { display: 'none' } }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: isLoading || testLoading, className: "upload-btn", children: preview ? '📷 Change Image' : '📸 Upload Selfie' }), preview && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: handleTestS3Upload, disabled: isLoading || testLoading, className: "test-btn", title: "Test S3 upload before payment", children: testLoading ? '🧪 Testing...' : '🧪 Test Upload (no payment)' }), _jsx("button", { type: "button", onClick: handleSubmit, disabled: isLoading || testLoading, className: "submit-btn", children: isLoading ? 'Getting Roasted...' : 'Roast Me! 🔥' })] }))] }), preview && (_jsxs("div", { className: "preview-container", children: [_jsx("img", { src: preview, alt: "Preview", className: "preview-thumbnail" }), _jsx("p", { className: "preview-info", children: "Ready to be roasted?" })] })), testResult && (_jsx("div", { className: `test-result ${testResult.startsWith('✅') ? 'success' : 'error'}`, children: testResult })), error && _jsx("div", { className: "error", children: error })] }));
};
//# sourceMappingURL=QueryBuilder.js.map