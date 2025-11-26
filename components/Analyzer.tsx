
import React, { useState } from 'react';
import { analyzeCode } from '../services/geminiService';
import { AnalysisResult, Language } from '../types';
import { Search, ArrowRight, Book, Code, AlertCircle, Lightbulb } from 'lucide-react';

interface AnalyzerProps {
    language: Language;
}

const Analyzer: React.FC<AnalyzerProps> = ({ language }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await analyzeCode(input, language);
            setResult(data);
        } catch (err) {
            setError('Could not analyze the code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Python Code Explainer</h2>
                <p className="text-slate-500 dark:text-slate-400">Paste Python code to understand how it works in <span className="font-semibold text-blue-500">{language}</span>.</p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <form onSubmit={handleAnalyze} className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste Python code here... (e.g. for i in range(5): print(i))"
                        className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-green-400 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                    <div className="absolute bottom-4 right-4">
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all flex items-center disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : <>Explain Code <Search className="w-4 h-4 ml-2" /></>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center border border-red-100 dark:border-red-900">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-6 animate-fade-in">
                    {/* Summary Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                             <div className="flex items-center">
                                <Code className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-2" />
                                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Code Summary</h3>
                             </div>
                             <span className="text-xs text-slate-400 font-medium">{language}</span>
                        </div>
                        <div className="p-6">
                            <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                                {result.summary}
                            </p>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white ml-1">Key Concepts Used</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.concepts.map((token, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <code className="text-sm font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-800 dark:text-slate-200">{token.segment}</code>
                                    <span className="text-xs font-mono px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded uppercase">{token.type}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{token.explanation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Best Practice / Tip */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-900/50 flex items-start">
                        <div className="bg-yellow-200 dark:bg-yellow-800/50 p-2 rounded-full mr-4 text-yellow-700 dark:text-yellow-400">
                             <Lightbulb className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-1">Pro Tip</h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {result.bestPracticeTip}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analyzer;
