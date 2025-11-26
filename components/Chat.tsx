import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { Send, User, Bot, Sparkles, RefreshCw } from 'lucide-react';
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
                text: `Konnichiwa! I am Sakura-sensei. I can explain things in ${language}. How can I help you today?`, 
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
            const responseText = result.text || "Sumimasen, I didn't catch that.";
            
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
                text: "Sumimasen! I'm having trouble connecting right now. Please try again.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        chatSessionRef.current = createChatSession([], language);
        setMessages([{ id: '1', role: 'model', text: `Konnichiwa! I am Sakura-sensei. I can explain things in ${language}. How can I help you today?`, timestamp: Date.now() }]);
    }

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-rose-50 p-4 border-b border-rose-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                         <Bot className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Sakura Sensei</h3>
                        <div className="flex items-center text-xs text-rose-600 font-medium">
                            <span className="w-2 h-2 bg-rose-500 rounded-full mr-1.5 animate-pulse"></span>
                            Online ({language})
                        </div>
                    </div>
                </div>
                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Reset Chat">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                                msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'
                            }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="flex max-w-[80%] space-x-3">
                             <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex-shrink-0 flex items-center justify-center mt-1">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center space-x-2">
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSend} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message or ask for a translation..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl shadow-md transition-all flex items-center justify-center w-12"
                    >
                        {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatTutor;