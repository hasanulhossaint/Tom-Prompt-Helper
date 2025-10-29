import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { WandIcon } from './icons/WandIcon';

interface OutputPanelProps {
  generatedPrompt: string;
  isLoading: boolean;
  error: string | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onRewrite: () => void;
  isRewriting: boolean;
}

const AIToolButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
        {disabled ? (
            <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </>
        ) : (
            children
        )}
    </button>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
  generatedPrompt, isLoading, error, 
  onAnalyze, isAnalyzing, onRewrite, isRewriting 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="animate-fade-in-slide-up animation-delay-200">
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl h-full flex flex-col min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">2. Your Generated Prompt</h2>
        <div className="relative flex-grow bg-slate-50 dark:bg-slate-900/70 rounded-md p-4 border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="relative flex-grow">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 rounded-md z-10">
                <div className="text-center">
                  <svg className="animate-spin mx-auto h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">Generating...</p>
                </div>
              </div>
            )}
            {error && <div className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/30 rounded-md">{error}</div>}
            {!isLoading && !error && !generatedPrompt && (
              <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                Your generated prompt will appear here.
              </div>
            )}
            {generatedPrompt && (
              <pre className="whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200 h-full overflow-y-auto pr-2">{generatedPrompt}</pre>
            )}
            {generatedPrompt && (
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Copy prompt"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            )}
            {copied && (
               <div className="absolute bottom-4 right-4 bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full animate-fade-in">Copied!</div>
            )}
          </div>
          {generatedPrompt && !isLoading && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2 text-center">AI-Powered Tools</h3>
              <div className="flex gap-3">
                  <AIToolButton onClick={onAnalyze} disabled={isAnalyzing || isRewriting}>
                      <WandIcon className="w-5 h-5" /> Analyze Prompt
                  </AIToolButton>
                  <AIToolButton onClick={onRewrite} disabled={isAnalyzing || isRewriting}>
                     <WandIcon className="w-5 h-5" /> Rewrite Prompt
                  </AIToolButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};