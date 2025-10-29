import React from 'react';
import type { PromptHistoryItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryItemProps {
  item: PromptHistoryItem;
  onLoad: (item: PromptHistoryItem) => void;
  onRemove: (id: number) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onLoad, onRemove }) => {
  const formattedDate = new Date(item.timestamp).toLocaleString();

  return (
    <div className="group bg-white dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex justify-between items-center animate-fade-in">
      <button onClick={() => onLoad(item)} className="text-left flex-grow">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-4">{item.config.instruction}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{formattedDate}</p>
      </button>
      <div className="flex-shrink-0">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete history item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};