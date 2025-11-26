import React from 'react';
import { AppView, Language } from '../types';
import { LayoutDashboard, Layers, MessageCircle, ScanSearch, Menu, X, Flower2, Languages } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, language, onLanguageChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.FLASHCARDS, label: 'Flashcards', icon: Layers },
    { id: AppView.CHAT, label: 'Chat Sensei', icon: MessageCircle },
    { id: AppView.ANALYZER, label: 'Analyzer', icon: ScanSearch },
  ];

  const languages: Language[] = ['English', 'Chinese (Simplified)', 'Malay'];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-rose-400 p-1.5 rounded-lg">
             <Flower2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">NihongoFlow</h1>
        </div>
        
        <div className="p-4">
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block flex items-center">
                    <Languages className="w-3 h-3 mr-1" /> Native Language
                </label>
                <select 
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-2 outline-none"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
             </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-rose-50 text-rose-600 font-medium shadow-sm ring-1 ring-rose-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-xs opacity-80 mb-1">Weekly Goal</p>
                <div className="flex justify-between items-end mb-2">
                    <span className="text-lg font-bold">12/50 XP</span>
                    <span className="text-xs">24%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-white rounded-full h-1.5 w-[24%]"></div>
                </div>
            </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-2">
           <Flower2 className="w-6 h-6 text-rose-500" />
           <span className="font-bold text-lg text-slate-800">NihongoFlow</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute right-0 top-16 bottom-0 w-64 bg-white p-4 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
             <div className="mb-6">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                    Learning Language
                </label>
                <select 
                    value={language}
                    onChange={(e) => {
                        onLanguageChange(e.target.value as Language);
                        setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-2"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
             </div>
             <nav className="space-y-2">
               {navItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleNavClick(item.id)}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                     currentView === item.id ? 'bg-rose-50 text-rose-600' : 'text-slate-600'
                   }`}
                 >
                   <item.icon className="w-5 h-5" />
                   <span>{item.label}</span>
                 </button>
               ))}
             </nav>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-slate-50">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;