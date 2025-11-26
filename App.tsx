import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcards from './components/Flashcards';
import ChatTutor from './components/Chat';
import Analyzer from './components/Analyzer';
import { AppView, Language } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [language, setLanguage] = useState<Language>('English');

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} language={language} />;
      case AppView.FLASHCARDS:
        return <Flashcards language={language} />;
      case AppView.CHAT:
        return <ChatTutor language={language} />;
      case AppView.ANALYZER:
        return <Analyzer language={language} />;
      default:
        return <Dashboard onNavigate={setCurrentView} language={language} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      language={language}
      onLanguageChange={setLanguage}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;