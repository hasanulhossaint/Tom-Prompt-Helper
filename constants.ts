import type { PromptConfig } from './types';

export const PROMPT_TYPES = [
  'Chat / Conversation', 'Image Generation', 'Coding', 'Writing / Blog / Story',
  'Marketing Copy', 'Academic / Research', 'Custom Template'
];

export const TONES = [
  'Friendly', 'Professional', 'Persuasive', 'Creative', 'Humorous', 
  'Technical', 'Formal', 'Casual', 'Empathetic', 'Assertive'
];

export const WRITING_STYLES = [
  'Storytelling', 'Explanatory', 'Conversational', 'Analytical', 
  'Concise', 'Poetic', 'Descriptive', 'Journalistic'
];

export const AUDIENCE_TYPES = [
  'General Public', 'Students', 'Experts', 'Customers', 
  'Developers', 'Children', 'Executives', 'Scientists'
];

export const OUTPUT_FORMATS = [
  'Text / Paragraph', 'List / Bullet Points', 'Code Snippet', 'Dialogue / Script',
  'Summary', 'Step-by-step Guide', 'Table', 'JSON'
];

export const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)', 
  'Japanese', 'Russian', 'Hindi', 'Bangla', 'Arabic', 'Portuguese'
];

export const DETAIL_LEVELS = {
  simple: 'Short & Simple',
  moderate: 'Moderately Detailed',
  advanced: 'Highly Specific / Advanced'
};

export const OPTIMIZATION_MODES = {
  none: 'None',
  clarity: 'Clarity',
  creativity: 'Creativity',
  precision: 'Precision',
};

export const DEFAULT_PROMPT_CONFIG: PromptConfig = {
  instruction: 'Write an email to a client about a late payment.',
  promptType: 'Writing / Blog / Story',
  tone: 'Professional',
  writingStyle: 'Concise',
  audience: 'Customers',
  outputFormat: 'Text / Paragraph',
  detailLevel: 'moderate',
  context: 'Act as a professional but friendly account manager.',
  keywords: 'late payment, invoice, due date',
  language: 'English',
  optimizationMode: 'none',
};
