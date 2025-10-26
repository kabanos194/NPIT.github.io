
import React, { useState, useRef, useEffect } from 'react';
import Chat from './components/Chat';
import VoiceChat from './components/VoiceChat';
import { 
    ChatIcon, MicrophoneIcon, NpitLogoIcon, LanguageIcon,
    FlagUSIcon, FlagESIcon, FlagDEIcon, FlagFRIcon, FlagPLIcon,
    FlagITIcon, FlagPTIcon, FlagJPIcon, FlagINIcon, FlagCNIcon,
    FlagKRIcon, FlagRUIcon, FlagTZIcon
} from './components/icons/Icons';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageKey } from './lib/i18n';

type Tab = 'chat' | 'voice';

const App: React.FC = () => {
  const { t, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // FIX: Corrected typo from `langMenu_current` to `langMenuRef.current`
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'voice':
        return <VoiceChat />;
      default:
        return <Chat />;
    }
  };

  const handleLanguageSelect = (lang: LanguageKey) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  }

  const TabButton = ({ tab, label, icon }: { tab: Tab; label: string; icon: React.ReactElement }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
        activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-900 text-gray-100">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 border-b border-gray-700 flex justify-between items-center relative z-20">
        <div className="flex items-center">
            <NpitLogoIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                NPIT
            </h1>
        </div>
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={t('changeLanguage')}
            aria-label={t('changeLanguage')}
          >
            <LanguageIcon />
            <span className="ml-2 text-sm font-medium">{t('language')}</span>
          </button>
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-700">
                <button onClick={() => handleLanguageSelect('en')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagUSIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('english')}
                </button>
                <button onClick={() => handleLanguageSelect('es')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagESIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('spanish')}
                </button>
                <button onClick={() => handleLanguageSelect('de')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagDEIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('german')}
                </button>
                <button onClick={() => handleLanguageSelect('fr')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagFRIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('french')}
                </button>
                <button onClick={() => handleLanguageSelect('pl')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagPLIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('polish')}
                </button>
                <button onClick={() => handleLanguageSelect('it')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagITIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('italian')}
                </button>
                <button onClick={() => handleLanguageSelect('pt')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagPTIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('portuguese')}
                </button>
                <button onClick={() => handleLanguageSelect('ja')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagJPIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('japanese')}
                </button>
                <button onClick={() => handleLanguageSelect('zh')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagCNIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('chinese')}
                </button>
                <button onClick={() => handleLanguageSelect('hi')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagINIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('hindi')}
                </button>
                <button onClick={() => handleLanguageSelect('ko')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagKRIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('korean')}
                </button>
                <button onClick={() => handleLanguageSelect('ru')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagRUIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('russian')}
                </button>
                <button onClick={() => handleLanguageSelect('sw')} className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600">
                    <FlagTZIcon className="w-5 h-auto mr-3 rounded-sm" /> {t('swahili')}
                </button>
            </div>
          )}
        </div>
      </header>
      
      <nav className="flex justify-center p-4 space-x-2 md:space-x-4 bg-gray-800/30">
        <TabButton tab="chat" label={t('chatAndImage')} icon={<ChatIcon />} />
        <TabButton tab="voice" label={t('voiceChat')} icon={<MicrophoneIcon />} />
      </nav>

      <main className="flex-1 overflow-hidden">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default App;
