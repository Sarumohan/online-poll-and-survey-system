import React, { useState } from 'react';
import { X, Copy, Check, Code, Link2 } from 'lucide-react';

const EmbedModal = ({ surveyId, surveyTitle, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen || !surveyId) return null;

  const publicUrl = `${window.location.origin}/survey/${surveyId}`;
  const iframeSnippet = `<iframe src="${publicUrl}" width="100%" height="650" frameborder="0" marginheight="0" marginwidth="0">Loading survey...</iframe>`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Share & Embed Survey</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {surveyTitle || 'Survey'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', padding: '0.4rem', width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Share Link Section */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Link2 size={16} color="var(--accent-primary)" /> Shareable Direct Link
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" readOnly value={publicUrl} className="form-input" style={{ flex: 1 }} />
            <button
              onClick={() => copyToClipboard(publicUrl, 'link')}
              className="btn btn-primary btn-sm"
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Iframe Embed Section */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Code size={16} color="var(--accent-secondary)" /> Embed HTML Code (Iframe)
          </label>
          <div className="code-box" style={{ marginBottom: '0.75rem' }}>
            {iframeSnippet}
          </div>
          <button
            onClick={() => copyToClipboard(iframeSnippet, 'embed')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            {copiedEmbed ? <Check size={16} /> : <Copy size={16} />}
            {copiedEmbed ? 'Embed Code Copied!' : 'Copy Embed Code Snippet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedModal;
