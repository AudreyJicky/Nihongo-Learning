
import React, { useState } from 'react';
import { AppView, Language, UserProfile, ThemeMode } from '../types';
import { LayoutDashboard, Layers, MessageCircle, Code2, Menu, X, Terminal, Languages, BookOpen, PenTool, Gamepad2, Moon, Sun, LogOut, Camera, Trophy, Users, Download, Settings } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
  user: UserProfile;
  onLogout: () => void;
  onThemeChange: (mode: ThemeMode) => void;
  onAvatarChange: (url: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
    currentView, 
    onChangeView, 
    language, 
    onLanguageChange, 
    children, 
    user, 
    onLogout, 
    onThemeChange,
    onAvatarChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.REFERENCE, label: 'Reference Book', icon: BookOpen },
    { id: AppView.GAME, label: 'Arcade', icon: Gamepad2 },
    { id: AppView.LEADERBOARD, label: 'Rankings', icon: Trophy },
    { id: AppView.COMMUNITY, label: 'Study Groups', icon: Users },
    { id: AppView.NOTEBOOK, label: 'Notebook', icon: PenTool },
    { id: AppView.FLASHCARDS, label: 'Concept Cards', icon: Layers },
    { id: AppView.CHAT, label: 'Py-Sensei', icon: MessageCircle },
    { id: AppView.ANALYZER, label: 'Code Explainer', icon: Code2 },
    { id: AppView.DOWNLOAD, label: 'Download App', icon: Download },
  ];

  const languages: Language[] = [
    'English', 'Chinese (Simplified)', 'Malay', 'Japanese', 'Korean', 
    'Indonesian', 'Thai', 'Vietnamese', 'Myanmar', 'Arabic'
  ];

  const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Calvin',
      'https://api.dicebear.com/7.x/bottts/svg?seed=Robot',
      'https://api.dicebear.com/7.x/notionists/svg?seed=Coder',
  ];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  const maxXp = 100;
  const progress = Math.min((user.xp / maxXp) * 100, 100);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Avatar Modal */}
      {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAvatarModal(false)}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Choose Avatar</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                      {avatars.map((url, i) => (
                          <button 
                            key={i} 
                            onClick={() => { onAvatarChange(url); setShowAvatarModal(false); }}
                            className={`p-1 rounded-full border-2 ${user.avatar === url ? 'border-blue-500' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'}`}
                          >
                              <img src={url} alt="avatar" className="w-full h-full rounded-full" />
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowAvatarModal(false)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium">Cancel</button>
              </div>
          </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700">
          <div className="bg-blue-500 p-1.5 rounded-lg">
             <Terminal className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">PyFlow</h1>
        </div>
        
        {/* User Profile Snippet */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
             <div className="flex items-center space-x-3 mb-3">
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                    <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <button 
                    onClick={() => onChangeView(AppView.PROFILE)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Profile Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
             </div>
             
             {/* Mini XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-400 rounded-full h-1.5 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <span>Lvl 1</span>
                <span>{user.xp} XP</span>
            </div>
        </div>
        
        <div className="p-4">
             <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block flex items-center">
                    <Languages className="w-3 h-3 mr-1" /> Native Language
                </label>
                <select 
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 p-2 outline-none"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
             </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-2">
            <button 
                onClick={() => onThemeChange(user.theme === 'light' ? 'dark' : 'light')} 
                className="flex-1 flex items-center justify-center space-x-2 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
                {user.theme === 'light' ? <><Moon className="w-4 h-4" /> <span>Dark</span></> : <><Sun className="w-4 h-4" /> <span>Light</span></>}
            </button>
            <button 
                onClick={onLogout}
                className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Sign Out"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-2">
           <Terminal className="w-6 h-6 text-blue-500" />
           <span className="font-bold text-lg text-slate-800 dark:text-white">PyFlow</span>
        </div>
        <div className="flex items-center space-x-3">
            <button 
                onClick={() => onThemeChange(user.theme === 'light' ? 'dark' : 'light')} 
                className="p-2 text-slate-500 dark:text-slate-400"
            >
                {user.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute right-0 top-16 bottom-0 w-72 bg-white dark:bg-slate-800 p-4 shadow-xl flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
             
             <div className="flex items-center space-x-3 mb-6 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <img src={user.avatar} className="w-10 h-10 rounded-full" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user.name}</p>
                    <button onClick={() => { onChangeView(AppView.PROFILE); setIsMobileMenuOpen(false); }} className="text-xs text-blue-500 flex items-center mt-1">
                        <Settings className="w-3 h-3 mr-1" /> Edit Profile
                    </button>
                </div>
             </div>

             <nav className="space-y-2 flex-1">
               {navItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleNavClick(item.id)}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                     currentView === item.id 
                     ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                     : 'text-slate-600 dark:text-slate-400'
                   }`}
                 >
                   <item.icon className="w-5 h-5" />
                   <span>{item.label}</span>
                 </button>
               ))}
             </nav>
             <button 
                onClick={onLogout}
                className="mt-6 w-full flex items-center justify-center space-x-2 p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl font-medium"
            >
                <LogOut className="w-4 h-4" /> <span>Sign Out</span>
            </button>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
