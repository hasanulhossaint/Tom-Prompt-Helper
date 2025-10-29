import React, { useState, useEffect, useRef } from 'react';
import type { PromptConfig } from '../types';
import { PROMPT_TYPES, TONES, WRITING_STYLES, AUDIENCE_TYPES, OUTPUT_FORMATS, LANGUAGES, DETAIL_LEVELS, OPTIMIZATION_MODES } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { InfoIcon } from './icons/InfoIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ControlPanelProps {
  config: PromptConfig;
  onConfigChange: (newConfig: Partial<PromptConfig>) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3 border-l-4 border-cyan-500 dark:border-cyan-400 pl-3">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SelectInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly string[] | Record<string, string>; tooltip?: string }> = ({ label, value, onChange, options, tooltip }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        {tooltip && (
            <div className="relative group flex items-center">
                <InfoIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-slate-200 text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-slate-700 shadow-lg">
                    {tooltip}
                </div>
            </div>
        )}
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    >
      {Array.isArray(options) 
        ? options.map(option => <option key={option} value={option}>{option}</option>)
        : Object.entries(options).map(([key, label]) => <option key={key} value={key}>{label}</option>)
      }
    </select>
  </div>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-slate-200 dark:border-slate-700 mt-6 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-cyan-600 dark:text-cyan-400"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid accordion-content ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                   <div className="pt-4 space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onConfigChange, onGenerate, isLoading }) => {
  const handleInputChange = <K extends keyof PromptConfig>(key: K, value: PromptConfig[K]) => {
    onConfigChange({ [key]: value });
  };
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const onConfigChangeRef = useRef(onConfigChange);
  onConfigChangeRef.current = onConfigChange;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onConfigChangeRef.current({ instruction: configRef.current.instruction + finalTranscript });
        }
      };
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl animate-fade-in-slide-up">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">1. Define Your Prompt</h2>
      
      <Section title="Core Idea">
        <div className="relative">
            <textarea
              placeholder="e.g., 'Write an email to a client about late payment'"
              value={config.instruction}
              onChange={(e) => handleInputChange('instruction', e.target.value)}
              className="w-full h-24 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-3 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y transition"
            />
            {recognitionRef.current && (
                <button 
                  onClick={toggleListening}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/80 text-white animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <MicrophoneIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        <SelectInput 
            label="Prompt Type" 
            value={config.promptType} 
            onChange={(e) => handleInputChange('promptType', e.target.value)} 
            options={PROMPT_TYPES}
            tooltip="Choose the primary goal of your prompt (e.g., generating an image, writing code, or having a conversation)."
        />
      </Section>

      <Section title="Tone & Style">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput 
            label="Tone" 
            value={config.tone} 
            onChange={(e) => handleInputChange('tone', e.target.value)} 
            options={TONES} 
            tooltip="Select the emotional style of the AI's response (e.g., friendly, professional, humorous)."
          />
          <SelectInput 
            label="Writing Style" 
            value={config.writingStyle} 
            onChange={(e) => handleInputChange('writingStyle', e.target.value)} 
            options={WRITING_STYLES} 
            tooltip="Define the structural style of the AI's writing (e.g., storytelling, concise, analytical)."
          />
          <SelectInput 
            label="Audience" 
            value={config.audience} 
            onChange={(e) => handleInputChange('audience', e.target.value)} 
            options={AUDIENCE_TYPES} 
            tooltip="Specify who the AI's response is for (e.g., experts, students, general public)."
          />
          <SelectInput 
            label="Output Format" 
            value={config.outputFormat} 
            onChange={(e) => handleInputChange('outputFormat', e.target.value)} 
            options={OUTPUT_FORMATS} 
            tooltip="Determine the structure of the final output (e.g., a list, a JSON object, a paragraph)."
          />
        </div>
      </Section>

      <Accordion title="Advanced Settings">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Detail Level</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-1">
            {Object.entries(DETAIL_LEVELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleInputChange('detailLevel', key as PromptConfig['detailLevel'])}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-semibold ${config.detailLevel === key ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
         <SelectInput 
            label="Optimization Mode" 
            value={config.optimizationMode} 
            onChange={(e) => handleInputChange('optimizationMode', e.target.value as PromptConfig['optimizationMode'])} 
            options={OPTIMIZATION_MODES}
            tooltip="Automatically refine the generated prompt for a specific goal."
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Context / System Role</label>
          <input
            type="text"
            placeholder="e.g., 'Act as a professional data analyst'"
            value={config.context}
            onChange={(e) => handleInputChange('context', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Keyword Emphasis (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g., 'invoice, due date, follow-up'"
            value={config.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <SelectInput label="Language" value={config.language} onChange={(e) => handleInputChange('language', e.target.value)} options={LANGUAGES} />
      </Accordion>
      
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Prompt
          </>
        )}
      </button>
    </div>
  );
};