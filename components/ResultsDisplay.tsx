import React, { useState } from 'react';
import type { GeneratedContent } from '../types';
import { SummaryView } from './SummaryView';
import { FlashcardView } from './FlashcardView';
import { QuizView } from './QuizView';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CardsIcon } from './icons/CardsIcon';
import { QuizIcon } from './icons/QuizIcon';

interface ResultsDisplayProps {
  content: GeneratedContent;
  fileName: string;
  onReset: () => void;
}

type Tab = 'summary' | 'flashcards' | 'quiz';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, fileName, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpenIcon },
    { id: 'flashcards', label: 'Flashcards', icon: CardsIcon },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon },
  ];

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                 <h2 className="text-2xl font-bold text-white">Your Study Kit</h2>
                 <p className="text-slate-400">Generated from <span className="font-semibold text-brand-accent">{fileName}</span></p>
            </div>
            <button
                onClick={onReset}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
                Upload New File
            </button>
        </div>
      
      <div className="mb-6 border-b border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-brand-secondary text-brand-accent'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'summary' && <SummaryView summaries={content.summaries} />}
        {activeTab === 'flashcards' && <FlashcardView flashcards={content.flashcards} />}
        {activeTab === 'quiz' && <QuizView questions={content.quiz} />}
      </div>
    </div>
  );
};
