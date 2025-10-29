export interface PromptConfig {
  instruction: string;
  promptType: string;
  tone: string;
  writingStyle: string;
  audience: string;
  outputFormat: string;
  detailLevel: 'simple' | 'moderate' | 'advanced';
  context: string;
  keywords: string;
  language: string;
  optimizationMode: 'none' | 'clarity' | 'creativity' | 'precision';
}

export interface PromptHistoryItem {
  id: number;
  config: PromptConfig;
  generatedPrompt: string;
  timestamp: string;
}

export interface AnalysisResult {
  clarity: number;
  specificity: number;
  context: number;
  bias: number;
  suggestions: string[];
}

export interface RewriteVariations {
  creative: string;
  concise: string;
  technical: string;
}

export type Theme = 'light' | 'dark';
