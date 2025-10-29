import React from 'react';
import type { AnalysisResult } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

const ProgressBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const width = `${score * 10}%`;
  const color = score > 7 ? 'bg-green-500' : score > 4 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className={`text-sm font-bold ${score > 7 ? 'text-green-600 dark:text-green-400' : score > 4 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{score}/10</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width }}></div>
      </div>
    </div>
  );
};


export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">Prompt Analysis</h2>
        </div>
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgressBar label="Clarity" score={result.clarity} />
                <ProgressBar label="Specificity" score={result.specificity} />
                <ProgressBar label="Context" score={result.context} />
                <ProgressBar label="Neutrality (Bias)" score={result.bias} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-300 mb-3">Suggestions for Improvement</h3>
                <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                    {result.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg text-right border-t border-slate-200 dark:border-slate-700">
            <button onClick={onClose} className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/50">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};