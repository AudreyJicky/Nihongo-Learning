
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { Send, User, Bot, Sparkles, RefreshCw, Terminal } from 'lucide-react';
import { Chat } from "@google/genai";

interface ChatProps {
    language: Language;
}

const ChatTutor: React.FC<ChatProps> = ({ language }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize or reset chat session when language changes
    useEffect(() => {
        chatSessionRef.current = createChatSession([], language);
        setMessages([
            { 
                id: '1', 
                role: 'model', 
                text: `Hello! I am Py-Sensei 🐍. I make learning Python fun and easy! I can explain everything in ${language}. What do you want to build today?`, 
                timestamp: Date.now() 
            }
        ]);
    }, [language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatSessionRef.current) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const responseText = result.text || "Sorry, I encountered a bug in my system!";
            
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Connection error. Please check your internet or API key.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        chatSessionRef.current = createChatSession([], language);
        setMessages([{ id: '1', role: 'model', text: `Hello! I am Py-Sensei 🐍. I make learning Python fun and easy! I can explain everything in ${language}. What do you want to build today?`, timestamp: Date.now() }]);
    }

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            {/* Chat Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-900/50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                         <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Py-Sensei</h3>
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
                            Online ({language})
                        </div>
                    </div>
                </div>
                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Reset Chat">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                                msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                            }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-tl-none'
                            }`}>
                                {/* Basic markdown rendering for code blocks if present */}
                                {msg.text.split('```').map((part, index) => 
                                    index % 2 === 1 ? (
                                        <div key={index} className="bg-slate-800 text-green-400 font-mono p-2 rounded my-2 text-xs overflow-x-auto">
                                            {part}
                                        </div>
                                    ) : (
                                        <span key={index}>{part}</span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="flex max-w-[80%] space-x-3">
                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex-shrink-0 flex items-center justify-center mt-1">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-600 shadow-sm flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSend} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a Python concept..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl shadow-md transition-all flex items-center justify-center w-12"
                    >
                        {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatTutor;
