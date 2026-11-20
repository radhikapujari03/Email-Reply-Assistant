import React, { useState } from 'react';
import { Copy, Check, Shield, HeartHandshake, Zap, Edit3, Eye } from 'lucide-react';

const TONE_CONFIGS = {
  formal: {
    title: 'Formal Reply',
    icon: Shield,
    accentColor: '#16BFD0',
    borderColor: 'border-[#16BFD0]/40',
    hoverBorder: 'hover:border-[#16BFD0]/80',
    glowClass: 'hover:shadow-glow-cyan',
    badgeBg: 'bg-[#16BFD0]/10 text-[#16BFD0] border-[#16BFD0]/30',
    btnBg: 'bg-[#16BFD0]/10 hover:bg-[#16BFD0]/20 text-[#16BFD0] border-[#16BFD0]/40',
    copiedBtnBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    targetAudience: 'Official communication, managers, clients & faculty',
    tagline: 'Professional & Respectful'
  },
  friendly: {
    title: 'Friendly Reply',
    icon: HeartHandshake,
    accentColor: '#6FA8FF',
    borderColor: 'border-[#6FA8FF]/40',
    hoverBorder: 'hover:border-[#6FA8FF]/80',
    glowClass: 'hover:shadow-glow-blue',
    badgeBg: 'bg-[#6FA8FF]/10 text-[#6FA8FF] border-[#6FA8FF]/30',
    btnBg: 'bg-[#6FA8FF]/10 hover:bg-[#6FA8FF]/20 text-[#6FA8FF] border-[#6FA8FF]/40',
    copiedBtnBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    targetAudience: 'Colleagues, teammates, classmates & contacts',
    tagline: 'Warm & Conversational'
  },
  short: {
    title: 'Short Reply',
    icon: Zap,
    accentColor: '#A78BFA',
    borderColor: 'border-[#A78BFA]/40',
    hoverBorder: 'hover:border-[#A78BFA]/80',
    glowClass: 'hover:shadow-glow-violet',
    badgeBg: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30',
    btnBg: 'bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]/40',
    copiedBtnBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    targetAudience: 'Quick mobile replies & essential acknowledgments',
    tagline: 'Concise & Direct'
  }
};

export default function ReplyCard({
  toneKey,
  content,
  onCopySuccess,
  onCopyError
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  // Sync if content changes
  React.useEffect(() => {
    setText(content);
    setCopied(false);
  }, [content]);

  const config = TONE_CONFIGS[toneKey] || TONE_CONFIGS.formal;
  const IconComponent = config.icon;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess(config.title);
      }

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
      if (onCopyError) {
        onCopyError('Failed to copy to clipboard. Please copy manually.');
      }
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-[#152238] border ${config.borderColor} ${config.hoverBorder} transition-all duration-300 shadow-lg ${config.glowClass} overflow-hidden group`}
    >
      {/* Top accent gradient bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${config.accentColor}, transparent)`
        }}
      />

      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${config.accentColor}1A`,
                color: config.accentColor
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F7FF] flex items-center space-x-2">
                <span>{config.title}</span>
              </h3>
              <p className="text-[11px] text-[#A9B8CC]">{config.tagline}</p>
            </div>
          </div>

          {/* Edit toggle button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? "Done editing" : "Edit draft"}
            className="p-1.5 rounded-lg text-[#A9B8CC] hover:text-[#F1F7FF] hover:bg-[#1B2C45] transition-colors"
          >
            {isEditing ? <Eye className="w-4 h-4 text-[#16BFD0]" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {/* Audience badge */}
        <div className="text-[11px] text-[#6C7E99] italic line-clamp-1">
          Best for: {config.targetAudience}
        </div>
      </div>

      {/* Card Body - Email Response Text */}
      <div className="px-5 py-2 flex-grow">
        {isEditing ? (
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full p-3 text-xs sm:text-sm text-[#F1F7FF] bg-[#1B2C45]/80 border border-[#263B58] rounded-xl focus:outline-none focus:border-[#16BFD0] leading-relaxed resize-none font-sans"
            placeholder="Edit your reply..."
          />
        ) : (
          <div className="p-3.5 rounded-xl bg-[#1B2C45]/40 border border-[#263B58]/60 text-xs sm:text-sm text-[#F1F7FF] leading-relaxed whitespace-pre-wrap select-text font-normal min-h-[160px] max-h-[300px] overflow-y-auto">
            {text}
          </div>
        )}
      </div>

      {/* Card Footer with Stats & Individual Copy Button */}
      <div className="p-5 pt-3 border-t border-[#263B58]/60 bg-[#152238] flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#6C7E99]">
          {wordCount} words
        </span>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 active:scale-95 shadow-sm ${
            copied ? config.copiedBtnBg : config.btnBg
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Reply</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
