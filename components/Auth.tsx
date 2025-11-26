
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Terminal, Mail, Phone, ArrowRight, Github } from 'lucide-react';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [method, setMethod] = useState<'options' | 'email' | 'phone'>('options');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (type: string) => {
        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
            const mockUser: UserProfile = {
                name: type === 'google' ? 'Google User' : inputValue.split('@')[0] || 'New Coder',
                email: type === 'email' ? inputValue : 'user@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                theme: 'light',
                xp: parseInt(localStorage.getItem('pyflow-xp') || '0')
            };
            onLogin(mockUser);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30 transform rotate-3">
                    <Terminal className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">PyFlow</h1>
                <p className="text-slate-500">Master Python the fun way.</p>
            </div>

            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    {method === 'options' ? 'Get Started' : method === 'email' ? 'Email Login' : 'Phone Login'}
                </h2>

                {method === 'options' ? (
                    <div className="space-y-4">
                        <button 
                            onClick={() => handleLogin('google')}
                            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all font-medium text-slate-700"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                        
                        <button 
                            onClick={() => setMethod('email')}
                            className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all font-medium shadow-lg shadow-slate-200"
                        >
                            <Mail className="w-5 h-5" />
                            <span>Continue with Email</span>
                        </button>

                        <button 
                            onClick={() => setMethod('phone')}
                            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all font-medium text-slate-700"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Continue with Phone</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {method === 'email' ? 'Email Address' : 'Phone Number'}
                            </label>
                            <input 
                                type={method === 'email' ? 'email' : 'tel'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={method === 'email' ? 'you@example.com' : '+1 234 567 8900'}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        
                        <button 
                            onClick={() => handleLogin('email')}
                            disabled={!inputValue || loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>
                            )}
                        </button>

                        <button 
                            onClick={() => setMethod('options')}
                            className="w-full text-sm text-slate-500 hover:text-slate-800"
                        >
                            Back to options
                        </button>
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
};

export default Auth;
