import React, { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { OutputPanel } from './components/OutputPanel';
import { generatePrompt, analyzePrompt, rewritePrompt } from './services/geminiService';
import type { PromptConfig, PromptHistoryItem, AnalysisResult, RewriteVariations, Theme } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DEFAULT_PROMPT_CONFIG } from './constants';
import { AnalysisModal } from './components/AnalysisModal';
import { RewriteModal } from './components/RewriteModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Features } from './components/Features';
import { HistoryPanel } from './components/HistoryPanel';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [promptConfig, setPromptConfig] = useState<PromptConfig>(DEFAULT_PROMPT_CONFIG);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  // State for AI-powered features
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteVariations, setRewriteVariations] = useState<RewriteVariations | null>(null);
  const [isRewriteModalOpen, setIsRewriteModalOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);
  
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const handleGeneratePrompt = useCallback(async () => {
    if (!promptConfig.instruction.trim()) {
      setError('Please enter a base instruction.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const result = await generatePrompt(promptConfig);
      setGeneratedPrompt(result);
      const newHistoryItem: PromptHistoryItem = {
        id: Date.now(),
        config: promptConfig,
        generatedPrompt: result,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep history to 20 items
    } catch (err: any) {
      setError(`Failed to generate prompt: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [promptConfig]);

  const handleConfigChange = useCallback((newConfig: Partial<PromptConfig>) => {
    setPromptConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  const loadFromHistory = useCallback((item: PromptHistoryItem) => {
    setPromptConfig(item.config);
    setGeneratedPrompt(item.generatedPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const removeFromHistory = useCallback((id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleAnalyze = async () => {
    if (!generatedPrompt) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePrompt(generatedPrompt);
      setAnalysisResult(result);
      setIsAnalysisModalOpen(true);
    } catch (err: any) {
      setError(`Failed to analyze prompt: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewrite = async () => {
    if (!generatedPrompt) return;
    setIsRewriting(true);
    setError(null);
    try {
      const result = await rewritePrompt(generatedPrompt);
      setRewriteVariations(result);
      setIsRewriteModalOpen(true);
    } catch (err: any) {
      setError(`Failed to rewrite prompt: ${err.message}`);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans flex flex-col bg-slate-50 dark:bg-slate-900">
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-3">
                      <SparklesIcon className="w-8 h-8 text-cyan-500" />
                      <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">
                          Tom Prompt Helper
                      </h1>
                  </div>
                  <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
              </div>
          </div>
        </header>

        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
            <div className="text-center pt-8 pb-12 md:pt-12 md:pb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Craft the Perfect AI Prompt, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Effortlessly</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Turn your rough ideas into detailed, effective instructions for any AI model. Define the tone, style, and format to get the perfect response every time.
              </p>
            </div>
            
            <Features />

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            <ControlPanel
              config={promptConfig}
              onConfigChange={handleConfigChange}
              onGenerate={handleGeneratePrompt}
              isLoading={isLoading}
            />
            <OutputPanel
              generatedPrompt={generatedPrompt}
              isLoading={isLoading}
              error={error}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onRewrite={handleRewrite}
              isRewriting={isRewriting}
            />
          </main>
          
          <HistoryPanel 
            history={history}
            onLoadHistory={loadFromHistory}
            onRemoveHistory={removeFromHistory}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
      {isAnalysisModalOpen && analysisResult && (
        <AnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          result={analysisResult}
        />
      )}
       {isRewriteModalOpen && rewriteVariations && (
        <RewriteModal
          isOpen={isRewriteModalOpen}
          onClose={() => setIsRewriteModalOpen(false)}
          variations={rewriteVariations}
          onSelect={(prompt) => {
            setGeneratedPrompt(prompt);
            setIsRewriteModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default App;