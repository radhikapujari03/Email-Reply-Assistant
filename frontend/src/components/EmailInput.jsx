import React, { useRef, useEffect } from 'react';
import { Sparkles, Trash2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import SampleSelector from './SampleSelector';

export default function EmailInput({
  inputEmail,
  setInputEmail,
  onGenerate,
  onClear,
  isLoading,
  validationError,
  setValidationError
}) {
  const textareaRef = useRef(null);

  // Auto-resize or focus when needed
  const wordCount = inputEmail.trim() ? inputEmail.trim().split(/\s+/).length : 0;
  const charCount = inputEmail.length;

  const handleChange = (e) => {
    setInputEmail(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError('');
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleSelectSample = (text) => {
    setInputEmail(text);
    setValidationError('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Sample presets */}
      <SampleSelector onSelectSample={handleSelectSample} disabled={isLoading} />

      {/* Main Input Card */}
      <div className={`relative rounded-2xl bg-[#152238] border transition-all duration-300 shadow-xl ${
        validationError 
          ? 'border-red-500/70 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]' 
          : 'border-[#263B58] focus-within:border-[#16BFD0]/70 focus-within:shadow-glow-cyan'
      }`}>
        {/* Card Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#263B58]/60 bg-[#1B2C45]/50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16BFD0]/60 inline-block" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A9B8CC]">
              Received Email Input
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-[#A9B8CC]">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Textarea Area */}
        <div className="p-4 sm:p-5">
          <textarea
            ref={textareaRef}
            rows={7}
            disabled={isLoading}
            value={inputEmail}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste your received email here..."
            className="w-full bg-transparent resize-y text-sm sm:text-base text-[#F1F7FF] placeholder-[#6C7E99] focus:outline-none leading-relaxed transition-all disabled:opacity-50"
          />
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="mx-4 sm:mx-5 mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{validationError}</p>
              <p className="text-red-300/80 text-xs mt-0.5">
                Paste an incoming email or choose one of the quick test presets above.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-[#263B58]/60 bg-[#152238] rounded-b-2xl">
          <div className="flex items-center text-xs text-[#6C7E99]">
            <span className="hidden sm:inline">Tip: Press <kbd className="px-1.5 py-0.5 bg-[#1B2C45] text-[#A9B8CC] rounded border border-[#263B58] text-[10px] font-mono">Ctrl + Enter</kbd> to generate</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {/* Clear Button */}
            <button
              type="button"
              disabled={isLoading || !inputEmail}
              onClick={onClear}
              className="flex items-center space-x-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl bg-[#1B2C45] hover:bg-[#1F3452] text-[#A9B8CC] hover:text-[#F1F7FF] border border-[#263B58] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#263B58]"
            >
              <Trash2 className="w-4 h-4 text-[#A9B8CC]" />
              <span>Clear</span>
            </button>

            {/* Generate Replies Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={onGenerate}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-[#0B1220] bg-gradient-to-r from-[#16BFD0] to-[#6FA8FF] hover:from-[#18d3e6] hover:to-[#84b5ff] active:scale-[0.98] transition-all duration-200 shadow-glow-cyan hover:shadow-glow-cyan-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1220]" />
                  <span>Analyzing & Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0B1220]" />
                  <span>Generate Replies</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
