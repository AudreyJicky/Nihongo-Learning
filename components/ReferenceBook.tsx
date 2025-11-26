
import React, { useState } from 'react';
import { explainTopic } from '../services/geminiService';
import { ReferenceTopic, Language } from '../types';
import { Book, ChevronRight, Loader2 } from 'lucide-react';

const TOPICS: ReferenceTopic[] = [
    { id: '1', title: 'Variables', emoji: '📦', description: 'Storing data containers' },
    { id: '2', title: 'Data Types', emoji: '🔢', description: 'Strings, Integers, Booleans' },
    { id: '3', title: 'Lists', emoji: '📜', description: 'Collections of items' },
    { id: '4', title: 'Loops', emoji: '🔄', description: 'Repeating actions (for/while)' },
    { id: '5', title: 'Functions', emoji: '⚡', description: 'Reusable code blocks' },
    { id: '6', title: 'Conditionals', emoji: '🔀', description: 'If, Elif, Else logic' },
    { id: '7', title: 'Dictionaries', emoji: '📖', description: 'Key-value pairs' },
];

interface ReferenceBookProps {
    language: Language;
}

const ReferenceBook: React.FC<ReferenceBookProps> = ({ language }) => {
    const [selectedTopic, setSelectedTopic] = useState<ReferenceTopic | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleTopicClick = async (topic: ReferenceTopic) => {
        setSelectedTopic(topic);
        setLoading(true);
        setContent(''); // Clear previous
        try {
            const explanation = await explainTopic(topic.title, language);
            setContent(explanation);
        } catch (e) {
            setContent("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Table of Contents */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
                    <h2 className="text-lg font-bold text-amber-900 dark:text-amber-400 flex items-center">
                        <Book className="w-5 h-5 mr-2" /> Python Basics
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all ${
                                selectedTopic?.id === topic.id
                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{topic.emoji}</span>
                                <div>
                                    <div className="font-bold text-sm">{topic.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{topic.description}</div>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${selectedTopic?.id === topic.id ? 'text-amber-600 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden transition-colors">
                {selectedTopic ? (
                    <>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-3xl mr-3">{selectedTopic.emoji}</span>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTopic.title}</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    <p className="text-slate-400 dark:text-slate-500 text-sm">Writing your textbook...</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:text-green-400 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-headings:text-slate-800 dark:prose-headings:text-white">
                                    {/* Simple renderer for the markdown content */}
                                    {content.split('\n').map((line, idx) => {
                                        if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mb-4">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('```')) return null; // Skip code fences, handled by prev/next logic or simplify
                                        if (line.trim().startsWith('print') || line.includes('=') || line.includes('def ')) {
                                            // Heuristic for code lines if not in blocks
                                            return <div key={idx} className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-sm my-3 border border-slate-700">{line}</div>;
                                        }
                                        return <p key={idx} className="mb-3 text-slate-600 dark:text-slate-300 leading-relaxed">{line}</p>;
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <Book className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a topic to start reading!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferenceBook;
