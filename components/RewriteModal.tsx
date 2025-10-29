import React, { useState } from 'react';
import type { RewriteVariations } from '../types';
import { CopyIcon } from './icons/CopyIcon';

interface RewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  variations: RewriteVariations;
  onSelect: (prompt: string) => void;
}

const VariationCard: React.FC<{ title: string; content: string; onSelect: () => void }> = ({ title, content, onSelect }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-md font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{title}</h4>
            <pre className="text-sm whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300 max-h-32 overflow-y-auto mb-3 pr-2">{content}</pre>
            <div className="flex gap-2">
                <button 
                    onClick={onSelect}
                    className="flex-1 bg-indigo-600 text-white text-sm font-bold py-1.5 px-3 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Use this version
                </button>
                <button 
                    onClick={handleCopy}
                    className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative"
                    aria-label="Copy prompt"
                >
                    <CopyIcon className="w-4 h-4" />
                    {copied && (
                        <span className="absolute -top-6 -right-1.5 bg-green-600 text-white text-xs font-bold py-0.5 px-2 rounded-full animate-fade-in">Copied!</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export const RewriteModal: React.FC<RewriteModalProps> = ({ isOpen, onClose, variations, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">Rewrite Prompt</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose a rewritten version below or close to keep the original.</p>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <VariationCard title="Creative" content={variations.creative} onSelect={() => onSelect(variations.creative)} />
            <VariationCard title="Concise" content={variations.concise} onSelect={() => onSelect(variations.concise)} />
            <VariationCard title="Technical" content={variations.technical} onSelect={() => onSelect(variations.technical)} />
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg text-right border-t border-slate-200 dark:border-slate-700">
            <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-500/50">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};