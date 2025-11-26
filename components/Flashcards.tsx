
import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard, Language } from '../types';
import { RotateCcw, Plus, ChevronLeft, ChevronRight, Loader2, Code2 } from 'lucide-react';

interface FlashcardsProps {
    language: Language;
}

const Flashcards: React.FC<FlashcardsProps> = ({ language }) => {
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'SETUP' | 'PRACTICE'>('SETUP');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        
        setLoading(true);
        try {
            const generatedCards = await generateFlashcards(topic, level, language);
            setCards(generatedCards);
            setCurrentIndex(0);
            setIsFlipped(false);
            setMode('PRACTICE');
        } catch (err) {
            alert('Failed to generate cards. Please check your API key and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    if (mode === 'SETUP') {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">New Python Deck</h2>
                    </div>
                    
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic (e.g., Loops, Lists, Functions)</label>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a Python topic..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setLevel(l)}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                                            level === l 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                            Current Language: <span className="font-semibold text-slate-700 dark:text-slate-200">{language}</span>. Explanations will be in this language.
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-70"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating...</> : 'Generate Cards'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // PRACTICE MODE
    const currentCard = cards[currentIndex];

    return (
        <div className="max-w-xl mx-auto flex flex-col h-[calc(100vh-140px)] justify-center">
            <div className="flex justify-between items-center mb-6">
                 <button onClick={() => setMode('SETUP')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Setup
                 </button>
                 <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">
                    {currentIndex + 1} / {cards.length}
                 </span>
            </div>

            {/* Flip Card Container */}
            <div 
                className="group relative w-full h-96 perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`w-full h-full relative transform-style-3d transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center transition-colors">
                        <span className="text-xs font-bold tracking-wider text-blue-500 dark:text-blue-400 uppercase mb-4">{currentCard.category}</span>
                        <h3 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">{currentCard.concept}</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300">{currentCard.definition}</p>
                        
                        <p className="absolute bottom-6 text-sm text-slate-400 dark:text-slate-500">Tap to see code</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
                        <span className="text-xs font-bold tracking-wider text-blue-400 uppercase mb-4">Syntax & Example</span>
                        
                        <div className="w-full bg-black/30 rounded-lg p-3 mb-4 text-left">
                            <p className="text-xs text-slate-400 mb-1">Syntax:</p>
                            <code className="font-mono text-sm text-yellow-300">{currentCard.syntax}</code>
                        </div>

                        <div className="w-full bg-slate-800 rounded-lg p-4 text-left border border-slate-700">
                             <p className="text-xs text-slate-400 mb-2">Example:</p>
                             <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{currentCard.exampleCode}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-8 mt-10">
                <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button 
                    onClick={() => { setIsFlipped(false); setCurrentIndex(0); }}
                    className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
                    title="Restart Deck"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button 
                    onClick={handleNext} 
                    disabled={currentIndex === cards.length - 1}
                    className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
