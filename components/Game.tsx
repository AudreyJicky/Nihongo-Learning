
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, Language } from '../types';
import { Gamepad2, Award, CheckCircle, XCircle, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

interface GameProps {
    language: Language;
    onXpGain: (amount: number) => void;
}

const Game: React.FC<GameProps> = ({ language, onXpGain }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FINISHED'>('START');
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const startGame = async () => {
        setLoading(true);
        try {
            const quizData = await generateQuiz(language);
            if (quizData.length > 0) {
                setQuestions(quizData);
                setCurrentIndex(0);
                setScore(0);
                setGameState('PLAYING');
                setIsAnswered(false);
                setSelectedOption(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);

        if (option === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 10);
            onXpGain(10);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            setGameState('FINISHED');
        }
    };

    if (gameState === 'START') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Gamepad2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Python Arcade</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Test your knowledge with a quick, AI-generated quiz. Earn XP for every correct answer!
                </p>
                <button 
                    onClick={startGame}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center mx-auto"
                >
                    {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Quiz...</> : 'Start Game'}
                </button>
            </div>
        );
    }

    if (gameState === 'FINISHED') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                    <Award className="w-20 h-20 text-yellow-500 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Game Over!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">You scored <span className="font-bold text-purple-600 dark:text-purple-400">{score} XP</span></p>
                
                <button 
                    onClick={startGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center mx-auto"
                >
                    <RefreshCw className="w-5 h-5 mr-2" /> Play Again
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    Question {currentIndex + 1}/{questions.length}
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">Score: {score}</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-purple-200 dark:hover:border-purple-500 text-slate-700 dark:text-slate-200";
                        if (isAnswered) {
                            if (option === currentQuestion.correctAnswer) {
                                btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
                            } else if (option === selectedOption) {
                                btnClass = "bg-red-50 dark:bg-red-900/30 border-red-300 text-red-800 dark:text-red-300";
                            } else {
                                btnClass = "opacity-50 border-slate-200 dark:border-slate-700 dark:text-slate-500";
                            }
                        } else if (selectedOption === option) {
                            btnClass = "bg-purple-50 dark:bg-purple-900/30 border-purple-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`w-full p-4 text-left border-2 rounded-xl font-medium transition-all flex justify-between items-center ${btnClass}`}
                            >
                                <span>{option}</span>
                                {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                                {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-xl text-sm leading-relaxed border border-blue-100 dark:border-blue-900">
                        <span className="font-bold block mb-1">Explanation:</span>
                        {currentQuestion.explanation}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={nextQuestion}
                    disabled={!isAnswered}
                    className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default Game;
