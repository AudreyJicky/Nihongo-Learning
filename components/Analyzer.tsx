import React, { useState } from 'react';
import { analyzeSentence } from '../services/geminiService';
import { AnalysisResult, Language } from '../types';
import { Search, ArrowRight, Book, Quote, AlertCircle } from 'lucide-react';

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
            const data = await analyzeSentence(input, language);
            setResult(data);
        } catch (err) {
            setError('Could not analyze the sentence. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Sentence Analyzer</h2>
                <p className="text-slate-500">Break down complex sentences into easy parts. Translating to <span className="font-semibold text-rose-500">{language}</span>.</p>
            </div>

            {/* Input Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleAnalyze} className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste a Japanese sentence here (e.g. 私は日本語を勉強しています)"
                        className="w-full h-32 p-4 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none japanese-text"
                    />
                    <div className="absolute bottom-4 right-4">
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all flex items-center disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : <>Analyze <Search className="w-4 h-4 ml-2" /></>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-6 animate-fade-in">
                    {/* Translation Card */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                             <div className="flex items-center">
                                <Quote className="w-5 h-5 text-slate-400 mr-2" />
                                <h3 className="font-semibold text-slate-700">Translation</h3>
                             </div>
                             <span className="text-xs text-slate-400 font-medium">{language}</span>
                        </div>
                        <div className="p-6">
                            <p className="text-xl md:text-2xl font-medium text-slate-800 japanese-text mb-4 leading-relaxed">
                                {result.original}
                            </p>
                            <div className="flex items-start text-slate-600">
                                <ArrowRight className="w-5 h-5 mt-1 mr-3 text-amber-500 flex-shrink-0" />
                                <p className="text-lg">{result.translation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Token Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.tokens.map((token, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-2xl font-bold text-slate-800 japanese-text">{token.word}</span>
                                    <span className="text-xs font-mono px-2 py-1 bg-slate-100 text-slate-500 rounded">{token.partOfSpeech}</span>
                                </div>
                                <p className="text-sm text-amber-600 mb-1 font-medium">{token.reading}</p>
                                <p className="text-slate-600 text-sm">{token.meaning}</p>
                            </div>
                        ))}
                    </div>

                    {/* Grammar Notes */}
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <div className="flex items-center mb-4 text-amber-800">
                            <Book className="w-5 h-5 mr-2" />
                            <h3 className="font-bold">Grammar Notes</h3>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {result.grammarNotes}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analyzer;