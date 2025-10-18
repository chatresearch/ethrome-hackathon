import React, { useState, useRef } from 'react';

interface QueryBuilderProps {
  onSubmit: (imageBase64: string, agent?: string) => Promise<void>;
  isLoading?: boolean;
  availableAgents?: { name: string; description: string }[];
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ 
  onSubmit, 
  isLoading = false,
  availableAgents = [
    { name: 'profile-roaster', description: 'Dating Profile Roast' },
    { name: 'linkedin-roaster', description: 'LinkedIn Headshot Roast' },
    { name: 'vibe-roaster', description: 'Aesthetic & Vibe Roast' }
  ]
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAgentIcon = (agentName: string): string => {
    switch (agentName) {
      case 'profile-roaster': return '💕';
      case 'linkedin-roaster': return '💼';
      case 'vibe-roaster': return '✨';
      default: return '😈';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const base64 = event.target?.result as string;
      setPreview(base64);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!preview) {
      setError('Please upload an image first');
      return;
    }

    try {
      await onSubmit(preview, selectedAgent || undefined);
      // Don't clear preview, let user see what was roasted
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="query-builder">
      <div className="query-controls">
        <div className="agent-selector-wrapper">
          <label htmlFor="agent-select" className="agent-label">
            Choose Roaster (optional):
          </label>
          <select
            id="agent-select"
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value || null)}
            disabled={isLoading}
            className="agent-select"
          >
            <option value="">Let me roast all of them</option>
            {availableAgents.map((agent) => (
              <option key={agent.name} value={agent.name}>
                {getAgentIcon(agent.name)} {agent.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="query-input">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="file-input"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="upload-btn"
        >
          {preview ? '📷 Change Image' : '📸 Upload Selfie'}
        </button>
        
        {preview && (
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Getting Roasted...' : 'Roast Me! 🔥'}
          </button>
        )}
      </div>

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-thumbnail" />
          <p className="preview-info">Ready to be roasted?</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </form>
  );
};


