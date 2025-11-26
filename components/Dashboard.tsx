import React, { useEffect, useState } from 'react';
import { getDailyPhrase } from '../services/geminiService';
import { DailyPhrase, Language } from '../types';
import { Sparkles, Calendar, ArrowRight, BookOpen, Trophy } from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: any) => void;
    language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, language }) => {
    const [phrase, setPhrase] = useState<DailyPhrase | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhrase = async () => {
            setLoading(true);
            try {
                const data = await getDailyPhrase(language);
                setPhrase(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPhrase();
    }, [language]);

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Konbanwa, Student! 👋</h2>
                <p className="text-slate-500">Ready to continue your journey to fluency?</p>
            </header>

            {/* Daily Phrase Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32 text-rose-500" />
                </div>
                <div className="p-6 md:p-8 relative z-10">
                    <div className="flex items-center space-x-2 text-rose-500 font-semibold text-sm uppercase tracking-wider mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Phrase of the Day</span>
                    </div>
                    
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                            <div className="h-16 bg-slate-200 rounded w-full"></div>
                        </div>
                    ) : phrase ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 japanese-text mb-2">
                                    {phrase.japanese}
                                </h3>
                                <p className="text-lg text-slate-500 font-medium">{phrase.reading}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xl font-medium text-slate-800 mb-1">{phrase.translation}</p>
                                <p className="text-sm text-slate-500 italic">{phrase.context}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Failed to load phrase.</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Action 1 */}
                 <button 
                    onClick={() => onNavigate('FLASHCARDS')}
                    className="group flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-200"
                 >
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Vocabulary Practice</h3>
                    <p className="text-sm text-slate-500 text-left mb-4">Master new words with AI-generated flashcards tailored to your interests.</p>
                    <div className="mt-auto flex items-center text-sm font-semibold text-indigo-600">
                        Start Session <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </button>

                 {/* Action 2 */}
                 <button 
                    onClick={() => onNavigate('CHAT')}
                    className="group flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-200"
                 >
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Chat with Sensei</h3>
                    <p className="text-sm text-slate-500 text-left mb-4">Practice real conversations with an AI tutor who corrects your grammar.</p>
                    <div className="mt-auto flex items-center text-sm font-semibold text-emerald-600">
                        Start Chatting <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </button>

                 {/* Action 3 */}
                 <button 
                     onClick={() => onNavigate('ANALYZER')}
                    className="group flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-amber-200"
                 >
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Sentence Analyzer</h3>
                    <p className="text-sm text-slate-500 text-left mb-4">Confused by a sentence? Break it down into parts and understand the grammar.</p>
                    <div className="mt-auto flex items-center text-sm font-semibold text-amber-600">
                        Analyze Text <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </button>
            </div>
        </div>
    );
};

export default Dashboard;