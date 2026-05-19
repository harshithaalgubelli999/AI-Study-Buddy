import React, { useState } from 'react';
import type { Flashcard } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[];
}

const FlashcardComponent: React.FC<{ card: Flashcard }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full h-80 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <div
                className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                {/* Front of the card */}
                <div className="absolute w-full h-full backface-hidden bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center p-6">
                    <p className="text-2xl font-semibold text-center text-slate-100">{card.term}</p>
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full backface-hidden bg-brand-primary border border-brand-secondary rounded-xl flex items-center justify-center p-6 rotate-y-180">
                     <p className="text-lg text-center text-slate-100">{card.definition}</p>
                </div>
            </div>
        </div>
    );
};


export const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstCard = currentIndex === 0;
    const newIndex = isFirstCard ? flashcards.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastCard = currentIndex === flashcards.length - 1;
    const newIndex = isLastCard ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!flashcards || flashcards.length === 0) {
    return <p>No flashcards available.</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <FlashcardComponent key={currentIndex} card={flashcards[currentIndex]} />
      </div>
      <div className="flex items-center justify-between w-full max-w-2xl mt-6">
        <button
          onClick={goToPrevious}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
        >
          &larr; Previous
        </button>
        <p className="text-slate-300 font-medium">
          {currentIndex + 1} / {flashcards.length}
        </p>
        <button
          onClick={goToNext}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

// Add some CSS to make the 3D effect work
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);
