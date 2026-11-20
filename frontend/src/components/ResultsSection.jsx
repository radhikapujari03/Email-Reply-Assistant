import React from 'react';
import ReplyCard from './ReplyCard';
import { Sparkles, Layers, ArrowDown } from 'lucide-react';

export default function ResultsSection({
  replies,
  isLoading,
  onCopySuccess,
  onCopyError
}) {
  // If loading, display premium midnight/cyan skeleton cards
  if (isLoading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 mt-6 mb-16">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#16BFD0] animate-spin" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-[#16BFD0]">
            AI is analyzing context & generating 3 distinct drafts...
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#152238] border border-[#263B58] p-5 flex flex-col justify-between space-y-4 animate-pulse shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B2C45]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#1B2C45] rounded w-2/3" />
                  <div className="h-3 bg-[#1B2C45] rounded w-1/2" />
                </div>
              </div>

              <div className="space-y-2.5 py-4">
                <div className="h-3 bg-[#1B2C45] rounded w-full" />
                <div className="h-3 bg-[#1B2C45] rounded w-5/6" />
                <div className="h-3 bg-[#1B2C45] rounded w-4/5" />
                <div className="h-3 bg-[#1B2C45] rounded w-3/4" />
                <div className="h-3 bg-[#1B2C45] rounded w-2/3" />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#263B58]">
                <div className="h-3 bg-[#1B2C45] rounded w-16" />
                <div className="h-8 bg-[#1B2C45] rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no replies yet
  if (!replies || (!replies.formal && !replies.friendly && !replies.short)) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 mt-2 mb-16 text-center">
        <div className="p-8 rounded-2xl bg-[#152238]/40 border border-[#263B58]/40 backdrop-blur-sm">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-2xl bg-[#1B2C45] text-[#16BFD0]">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-[#F1F7FF] mb-1">
            Generated Drafts Will Appear Here
          </h3>
          <p className="text-xs sm:text-sm text-[#A9B8CC] max-w-md mx-auto">
            Paste an email above and click <span className="text-[#16BFD0] font-medium">Generate Replies</span>. Gemini will craft formal, friendly, and concise drafts ready to copy.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="w-full max-w-6xl mx-auto px-4 mt-4 mb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-6 border-b border-[#263B58]">
        <div className="flex items-center space-x-2.5 mb-2 sm:mb-0">
          <Sparkles className="w-5 h-5 text-[#16BFD0]" />
          <div>
            <h2 className="text-lg font-bold text-[#F1F7FF]">
              Generated Reply Drafts
            </h2>
            <p className="text-xs text-[#A9B8CC]">
              Choose the tone that best matches your communication scenario
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#1B2C45] text-[#16BFD0] border border-[#263B58]">
          3 Tone Variations Generated
        </span>
      </div>

      {/* 3 Tone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <ReplyCard
          toneKey="formal"
          content={replies.formal || 'No formal draft returned.'}
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />
        <ReplyCard
          toneKey="friendly"
          content={replies.friendly || 'No friendly draft returned.'}
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />
        <ReplyCard
          toneKey="short"
          content={replies.short || 'No short draft returned.'}
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />
      </div>
    </section>
  );
}
