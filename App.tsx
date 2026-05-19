import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { readTextFromFile } from './utils/fileReader';
import { generateAllContent } from './services/geminiService';
import type { GeneratedContent } from './types';

enum AppState {
  IDLE,
  PARSING,
  GENERATING,
  SUCCESS,
  ERROR,
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    setAppState(AppState.PARSING);
    setError(null);
    setGeneratedContent(null);
    setFileName(file.name);

    try {
      const text = await readTextFromFile(file);
      
      setAppState(AppState.GENERATING);
      const content = await generateAllContent(text);
      setGeneratedContent(content);
      setAppState(AppState.SUCCESS);

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to process your file. ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setGeneratedContent(null);
    setError(null);
    setFileName('');
  };

  const getLoadingMessage = () => {
    switch (appState) {
      case AppState.PARSING:
        return `Reading "${fileName}"...`;
      case AppState.GENERATING:
        return 'AI is analyzing your document... This may take a moment.';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-brand-primary/50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">
            StudyWise AI
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Turn your study materials into interactive learning tools.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-brand-primary/10 border border-slate-700 p-6 transition-all duration-500">
          {appState === AppState.IDLE && (
            <FileUpload onFileChange={handleFileChange} />
          )}

          {(appState === AppState.PARSING || appState === AppState.GENERATING) && (
            <Loader message={getLoadingMessage()} />
          )}

          {appState === AppState.ERROR && (
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {appState === AppState.SUCCESS && generatedContent && (
             <ResultsDisplay content={generatedContent} fileName={fileName} onReset={handleReset} />
          )}
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} StudyWise AI. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
