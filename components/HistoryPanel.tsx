import React from 'react';
import type { PromptHistoryItem } from '../types';
import { HistoryItem } from './HistoryItem';

interface HistoryPanelProps {
  history: PromptHistoryItem[];
  onLoadHistory: (item: PromptHistoryItem) => void;
  onRemoveHistory: (id: number) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onLoadHistory, 
  onRemoveHistory, 
  onClearHistory 
}) => {
  return (
    <div className="mt-16 animate-fade-in-slide-up animation-delay-400">
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">History</h2>
                {history.length > 0 && (
                <button onClick={onClearHistory} className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-semibold">
                    Clear All
                </button>
                )}
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {history.length > 0 ? (
                history.map(item => (
                    <HistoryItem key={item.id} item={item} onLoad={onLoadHistory} onRemove={onRemoveHistory} />
                ))
                ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">Your generated prompts will be saved here.</p>
                )}
            </div>
        </div>
    </div>
  );
};
