import React, { useState } from 'react';
import { Key, X, CheckCircle, ExternalLink, ShieldAlert, Loader2 } from 'lucide-react';
import { updateBackendApiKey, checkBackendHealth } from '../services/api';

export default function SettingsModal({
  isOpen,
  onClose,
  backendStatus,
  onKeyUpdated
}) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a valid Gemini API key.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await updateBackendApiKey(apiKeyInput.trim());
      if (res.success) {
        setFeedback({ type: 'success', message: 'API key configured and saved!' });
        setApiKeyInput('');
        const health = await checkBackendHealth();
        if (onKeyUpdated) {
          onKeyUpdated(health);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update key' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error updating API key' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#152238] border border-[#263B58] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A9B8CC] hover:text-[#F1F7FF] hover:bg-[#1B2C45] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#16BFD0]/10 text-[#16BFD0] border border-[#16BFD0]/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F1F7FF]">
              Gemini API Configuration
            </h3>
            <p className="text-xs text-[#A9B8CC]">
              Connect to Google AI Studio
            </p>
          </div>
        </div>

        {/* Current status pill */}
        <div className="mb-4 p-3 rounded-xl bg-[#1B2C45] border border-[#263B58] flex items-center justify-between text-xs">
          <span className="text-[#A9B8CC]">Current Status:</span>
          <span className={`font-semibold flex items-center space-x-1 ${
            backendStatus.api_key_configured ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <span>●</span>
            <span>{backendStatus.api_key_configured ? 'API Key Active' : 'Key Not Detected'}</span>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A9B8CC] mb-1.5">
              Enter Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1220] border border-[#263B58] focus:border-[#16BFD0] text-xs sm:text-sm text-[#F1F7FF] placeholder-[#6C7E99] focus:outline-none transition-all"
            />
            <p className="text-[11px] text-[#6C7E99] mt-1.5 flex items-center justify-between">
              <span>Saved in <code className="text-[#A9B8CC]">backend/.env</code></span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#16BFD0] hover:underline inline-flex items-center space-x-1"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {feedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950/40 text-red-300 border border-red-500/40'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#1B2C45] hover:bg-[#1F3452] text-[#A9B8CC] border border-[#263B58] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-[#16BFD0] hover:bg-[#18d3e6] text-[#0B1220] transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
