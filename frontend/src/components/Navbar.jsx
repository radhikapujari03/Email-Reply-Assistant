import React from 'react';
import { Mail, Sparkles, Key, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Navbar({ backendStatus, onOpenSettings }) {
  const isOnline = backendStatus.status === 'online';
  const isKeyConfigured = backendStatus.api_key_configured;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B1220]/80 border-b border-[#263B58]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16BFD0] to-[#6FA8FF] shadow-glow-cyan">
            <Mail className="w-5 h-5 text-[#0B1220]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16BFD0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16BFD0]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-[#F1F7FF]">
                Email Reply Assistant
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#16BFD0]/10 text-[#16BFD0] border border-[#16BFD0]/30 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-[#16BFD0]" />
                AI-Powered
              </span>
            </div>
            <span className="text-xs text-[#A9B8CC] hidden md:inline">
              Generative Response Drafts in 3 Distinct Tones
            </span>
          </div>
        </div>

        {/* Right side status and settings */}
        <div className="flex items-center space-x-3">
          {/* Backend / Key Status Indicator */}
          <div
            title={isOnline ? (isKeyConfigured ? "Backend online & API Key configured" : "Backend online, but API key missing") : "Backend offline"}
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#152238] border border-[#263B58] text-xs text-[#A9B8CC]"
          >
            <span className={`inline-block w-2 h-2 rounded-full ${
              !isOnline ? 'bg-red-500' : isKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
            }`} />
            <span>
              {!isOnline
                ? 'Backend Disconnected'
                : isKeyConfigured
                ? 'Gemini Ready'
                : 'API Key Missing'}
            </span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1B2C45] hover:bg-[#1F3452] text-[#F1F7FF] border border-[#263B58] transition-all hover:border-[#16BFD0]/50"
          >
            <Key className="w-3.5 h-3.5 text-[#16BFD0]" />
            <span className="hidden sm:inline">Configure API</span>
          </button>
        </div>
      </div>
    </header>
  );
}
