import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };
  
  const calculateScore = () => {
      let score = 0;
      questions.forEach((q, index) => {
          if (selectedAnswers[index] === q.correctAnswer) {
              score++;
          }
      });
      return score;
  };
  
  const handleSubmit = () => {
      setShowResults(true);
  }

  const handleReset = () => {
      setSelectedAnswers({});
      setShowResults(false);
  }

  return (
    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
      {questions.map((q, index) => (
        <div key={index} className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
          <p className="font-semibold text-lg mb-4">
            <span className="text-brand-accent mr-2">{index + 1}.</span>{q.question}
          </p>
          <div className="space-y-3">
            {q.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[index] === option;
              let optionClasses = "w-full text-left p-3 rounded-lg border transition-colors duration-200 ";

              if (showResults) {
                const isCorrect = option === q.correctAnswer;
                if (isCorrect) {
                    optionClasses += "bg-green-500/20 border-green-500 text-white";
                } else if (isSelected && !isCorrect) {
                    optionClasses += "bg-red-500/20 border-red-500 text-white";
                } else {
                    optionClasses += "border-slate-600 text-slate-300";
                }
              } else {
                  optionClasses += isSelected 
                  ? "bg-brand-secondary/30 border-brand-secondary text-white" 
                  : "border-slate-600 hover:bg-slate-700/50 text-slate-300";
              }

              return (
                <button
                  key={optionIndex}
                  onClick={() => !showResults && handleSelectAnswer(index, option)}
                  disabled={showResults}
                  className={optionClasses}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-center pt-4 sticky bottom-0 bg-slate-800/50 backdrop-blur-sm pb-2">
      {showResults ? (
          <div className="text-center">
              <p className="text-2xl font-bold mb-4">
                  Your Score: {calculateScore()} / {questions.length}
              </p>
              <button
                onClick={handleReset}
                className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                Try Again
              </button>
          </div>
      ) : (
          <button
              onClick={handleSubmit}
              className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
              Submit Answers
          </button>
      )}
      </div>
    </div>
  );
};
