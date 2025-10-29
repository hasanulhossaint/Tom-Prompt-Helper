import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { LanguageIcon } from './icons/LanguageIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { MoonIcon } from './icons/MoonIcon';

const features = [
  {
    icon: <BrainIcon className="w-8 h-8 text-indigo-500" />,
    title: 'AI-Powered Optimization',
    description: 'Refine your prompts for clarity, creativity, or precision with a single click.',
  },
  {
    icon: <PaintBrushIcon className="w-8 h-8 text-cyan-500" />,
    title: 'Customize Tone & Style',
    description: 'Tailor prompts to any audience by defining tone, writing style, and desired format.',
  },
  {
    icon: <CodeBracketIcon className="w-8 h-8 text-green-500" />,
    title: 'Multi-Purpose',
    description: 'Perfect for generating text, code, marketing copy, academic research, and more.',
  },
  {
    icon: <LanguageIcon className="w-8 h-8 text-amber-500" />,
    title: 'Multi-Language Support',
    description: 'Craft prompts in a wide variety of languages to suit your needs.',
  },
  {
    icon: <MicrophoneIcon className="w-8 h-8 text-rose-500" />,
    title: 'Voice Input',
    description: 'Use your voice to dictate your core ideas quickly and easily.',
  },
  {
    icon: <MoonIcon className="w-8 h-8 text-slate-500" />,
    title: 'Light & Dark Mode',
    description: 'A beautiful interface that looks great at any time of day.',
  },
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string, delay: number }> = ({ icon, title, description, delay }) => (
  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-slide-up" style={{animationDelay: `${delay}ms`}}>
    <div className="flex items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-900/70 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard key={feature.title} {...feature} delay={index * 100} />
      ))}
    </div>
  );
};
