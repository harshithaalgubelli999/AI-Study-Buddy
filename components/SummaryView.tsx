import React from 'react';
import type { SummaryItem } from '../types';

interface SummaryViewProps {
  summaries: SummaryItem[];
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summaries }) => {
  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
      {summaries.map((item, index) => (
        <div key={index} className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-brand-accent mb-2">{item.topic}</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{item.summary}</p>
        </div>
      ))}
    </div>
  );
};
