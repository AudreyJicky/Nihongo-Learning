import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard, Language } from '../types';
import { RotateCcw, Plus, ChevronLeft, ChevronRight, Loader2, Volume2 } from 'lucide-react';

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

    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        window.speechSynthesis.speak(utterance);
    };

    if (mode === 'SETUP') {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Plus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Create New Deck</h2>
                    </div>
                    
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Topic of Interest</label>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Travel, Food, Anime, Business"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setLevel(l)}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium border ${
                                            level === l 
                                            ? 'bg-indigo-600 text-white border-indigo-600' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-500 border border-slate-200">
                            Current Language: <span className="font-semibold text-slate-700">{language}</span>. Cards will be translated to this language.
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-70"
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
                 <button onClick={() => setMode('SETUP')} className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Setup
                 </button>
                 <span className="text-slate-400 font-mono text-sm">
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
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
                        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Japanese</span>
                        <h3 className="text-6xl font-bold text-slate-800 japanese-text mb-4">{currentCard.kanji}</h3>
                        <p className="text-2xl text-slate-500 japanese-text">{currentCard.reading}</p>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); playAudio(currentCard.kanji); }}
                            className="mt-8 p-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                        
                        <p className="absolute bottom-6 text-sm text-slate-400">Tap to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
                        <span className="text-xs font-bold tracking-wider text-indigo-200 uppercase mb-4">{language}</span>
                        <h3 className="text-3xl font-bold mb-2">{currentCard.translation}</h3>
                        <p className="text-indigo-200 mb-6 font-mono text-sm">{currentCard.romaji}</p>
                        
                        <div className="w-full border-t border-indigo-500/50 pt-6 mt-2">
                             <p className="text-sm text-indigo-100 opacity-80 mb-1">Example</p>
                             <p className="text-lg japanese-text">{currentCard.exampleSentence}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-8 mt-10">
                <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button 
                    onClick={() => { setIsFlipped(false); setCurrentIndex(0); }}
                    className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300 shadow-sm transition-all"
                    title="Restart Deck"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button 
                    onClick={handleNext} 
                    disabled={currentIndex === cards.length - 1}
                    className="p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default Flashcards;