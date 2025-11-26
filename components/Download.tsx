
import React from 'react';
import { Smartphone, Monitor, Globe, Apple, Play } from 'lucide-react';

const Download: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-10 text-center">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Take PyFlow Everywhere</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">
                Learn Python on the go. Sync your progress across all your devices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* iOS */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                    <Apple className="w-16 h-16 mx-auto mb-6 text-slate-800 dark:text-white group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">iOS</h3>
                    <p className="text-slate-400 text-sm mb-6">For iPhone & iPad</p>
                    <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors">
                        App Store
                    </button>
                </div>

                {/* Android */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                    <Smartphone className="w-16 h-16 mx-auto mb-6 text-green-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Android</h3>
                    <p className="text-slate-400 text-sm mb-6">For Phones & Tablets</p>
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Play Store
                    </button>
                </div>

                {/* Windows/Mac */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                    <Monitor className="w-16 h-16 mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Desktop</h3>
                    <p className="text-slate-400 text-sm mb-6">Windows, macOS, Linux</p>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Download
                    </button>
                </div>

                {/* Web */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                    <Globe className="w-16 h-16 mx-auto mb-6 text-purple-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Web</h3>
                    <p className="text-slate-400 text-sm mb-6">Browser Access</p>
                    <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                        Launch
                    </button>
                </div>
            </div>

            <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white text-left relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h3 className="text-2xl font-bold mb-4">Join the beta testing group</h3>
                    <p className="text-slate-300 mb-6">Get early access to new features like the "Advanced Python" course and help us shape the future of PyFlow.</p>
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                        Join Beta Program
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Download;
