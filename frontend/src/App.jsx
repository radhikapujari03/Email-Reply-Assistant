import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EmailInput from './components/EmailInput';
import ResultsSection from './components/ResultsSection';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { generateReplies, checkBackendHealth } from './services/api';
import { AlertCircle, Key, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [inputEmail, setInputEmail] = useState('');
  const [replies, setReplies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    api_key_configured: false,
  });

  // Verify backend health on startup
  const refreshHealth = async () => {
    const health = await checkBackendHealth();
    setBackendStatus(health);
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  // Handle Generate Replies
  const handleGenerate = async () => {
    // Step 1: Input Validation
    if (!inputEmail || !inputEmail.trim()) {
      setValidationError('Please paste an email into the box before generating replies.');
      return;
    }

    if (inputEmail.trim().length < 10) {
      setValidationError('Please provide a slightly more descriptive email (at least 10 characters) so the AI can understand its context.');
      return;
    }

    setValidationError('');
    setApiError(null);
    setIsLoading(true);

    try {
      // Step 2: AI Processing via Flask backend
      const resultReplies = await generateReplies(inputEmail);
      setReplies(resultReplies);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error generating replies:', err);
      setApiError({
        message: err.message || 'Failed to generate replies. Please try again.',
        isAuthError: err.isAuthError,
      });

      if (err.isAuthError) {
        setIsSettingsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Clear
  const handleClear = () => {
    setInputEmail('');
    setReplies(null);
    setValidationError('');
    setApiError(null);
  };

  // Handle Copy Success Callback
  const handleCopySuccess = (toneTitle) => {
    setToast({
      type: 'success',
      title: 'Copied Successfully!',
      message: `${toneTitle} is ready to paste into your email client.`,
    });
  };

  // Handle Copy Error Callback
  const handleCopyError = (errMsg) => {
    setToast({
      type: 'error',
      title: 'Copy Failed',
      message: errMsg,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] bg-grid-pattern text-[#F1F7FF] flex flex-col justify-between selection:bg-[#16BFD0]/30 selection:text-[#16BFD0]">
      {/* Top Navigation */}
      <div>
        <Navbar
          backendStatus={backendStatus}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="max-w-7xl mx-auto py-4">
          {/* Hero Section */}
          <Hero />

          {/* Global API / Connection Error Notice if any */}
          {apiError && (
            <div className="max-w-4xl mx-auto px-4 mb-6">
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-200">
                      {apiError.isAuthError ? 'Gemini API Key Required' : 'Generation Request Failed'}
                    </h4>
                    <p className="text-xs text-red-300/80 mt-0.5">
                      {apiError.message}
                    </p>
                  </div>
                </div>

                {apiError.isAuthError && (
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-xs font-semibold text-white border border-red-500/50 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Enter API Key</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Email Input Section */}
          <EmailInput
            inputEmail={inputEmail}
            setInputEmail={setInputEmail}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
            validationError={validationError}
            setValidationError={setValidationError}
          />

          {/* Generated Results Section (Formal, Friendly, Short) */}
          <ResultsSection
            replies={replies}
            isLoading={isLoading}
            onCopySuccess={handleCopySuccess}
            onCopyError={handleCopyError}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#263B58] bg-[#0B1220]/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6C7E99]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#A9B8CC]">Email Reply Assistant</span>
            <span>•</span>
            <span className="flex items-center text-[#16BFD0]">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Google Gemini
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero data retention • Private by design</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Settings / API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendStatus={backendStatus}
        onKeyUpdated={(health) => {
          setBackendStatus(health);
          setApiError(null);
        }}
      />

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
