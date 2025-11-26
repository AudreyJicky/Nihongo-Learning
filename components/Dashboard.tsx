
import React, { useEffect, useState } from 'react';
import { getDailyTip } from '../services/geminiService';
import { DailyTip, Language, AppView } from '../types';
import { Sparkles, Code, ArrowRight, Layers, Terminal, BookOpen, Gamepad2, PenTool } from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: AppView) => void;
    language: Language;
    xp: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, language, xp }) => {
    const [tip, setTip] = useState<DailyTip | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            setLoading(true);
            try {
                const data = await getDailyTip(language);
                setTip(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [language]);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Hello, Coder! 👋</h2>
                    <p className="text-slate-500 dark:text-slate-400">Ready to level up your Python skills?</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">Daily XP</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{xp} / 100</div>
                    </div>
                    <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <AwardIcon />
                    </div>
                </div>
            </header>

            {/* Daily Tip Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Code className="w-48 h-48 text-blue-500" />
                </div>
                <div className="p-6 md:p-8 relative z-10">
                    <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Daily Python Tip</span>
                    </div>
                    
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        </div>
                    ) : tip ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {tip.topic}
                                </h3>
                                <div className="bg-slate-900 rounded-lg p-4 font-mono text-green-400 text-sm md:text-base overflow-x-auto shadow-inner border border-slate-700">
                                    <pre>{tip.codeSnippet}</pre>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 text-slate-700 dark:text-slate-300">
                                <p className="font-medium mb-2">{tip.explanation}</p>
                                <p className="text-sm text-blue-600 dark:text-blue-400 italic">💡 {tip.funFact}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Failed to load tip.</p>
                    )}
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <ActionCard 
                    title="Reference Book"
                    desc="Master the basics with simple guides."
                    icon={BookOpen}
                    color="amber"
                    onClick={() => onNavigate(AppView.REFERENCE)}
                 />
                 <ActionCard 
                    title="Python Arcade"
                    desc="Play quizzes and earn XP!"
                    icon={Gamepad2}
                    color="purple"
                    onClick={() => onNavigate(AppView.GAME)}
                 />
                 <ActionCard 
                    title="My Notebook"
                    desc="Save useful code snippets."
                    icon={PenTool}
                    color="pink"
                    onClick={() => onNavigate(AppView.NOTEBOOK)}
                 />
                 <ActionCard 
                    title="Concept Cards"
                    desc="Swipe to memorize syntax."
                    icon={Layers}
                    color="indigo"
                    onClick={() => onNavigate(AppView.FLASHCARDS)}
                 />
                 <ActionCard 
                    title="Ask Py-Sensei"
                    desc="Chat with your AI Tutor."
                    icon={Terminal}
                    color="emerald"
                    onClick={() => onNavigate(AppView.CHAT)}
                 />
                 <ActionCard 
                    title="Code Explainer"
                    desc="Paste code to understand it."
                    icon={Code}
                    color="cyan"
                    onClick={() => onNavigate(AppView.ANALYZER)}
                 />
            </div>
        </div>
    );
};

const ActionCard = ({ title, desc, icon: Icon, color, onClick }: any) => {
    const colorClasses: any = {
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:border-amber-300',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:border-purple-300',
        pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-800 hover:border-pink-300',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 hover:border-emerald-300',
        cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800 hover:border-cyan-300',
    };

    return (
        <button 
            onClick={onClick}
            className={`group flex flex-col items-start p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left`}
        >
            <div className={`p-3 rounded-xl mb-4 transition-colors ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{desc}</p>
            <div className={`mt-auto flex items-center text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity dark:text-slate-200`}>
                Open <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    )
}

const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
)

export default Dashboard;
