
import React, { useState } from 'react';
import Header from './components/Layout/Header';
import ChatInterface from './components/Chat/ChatInterface';
import HeritageGallery from './components/Heritage/HeritageGallery';
import SourceList from './components/About/SourceList';
import RadioExplorer from './components/Radios/RadioExplorer';
import NewsTicker from './components/Layout/NewsTicker';
import DidYouKnow from './components/FunFact/DidYouKnow';
import PharmacyFinder from './components/Services/PharmacyFinder';
import QuizFaso from './components/Game/QuizFaso';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHAT);

  const renderView = () => {
    // Simple container for view transitions
    const content = (() => {
      switch (currentView) {
        case ViewState.CHAT:
          return <ChatInterface />;
        case ViewState.HERITAGE:
          return <HeritageGallery />;
        case ViewState.RADIOS:
          return <RadioExplorer />;
        case ViewState.ABOUT:
          return <SourceList />;
        case ViewState.PHARMACIES:
          return <PharmacyFinder />;
        case ViewState.QUIZ:
          return <QuizFaso />;
        default:
          return <ChatInterface />;
      }
    })();

    return (
        <div className="animate-in fade-in duration-300 w-full h-full flex flex-col">
            {content}
        </div>
    );
  };

  return (
    // Background handling with high transparency for flag visibility
    // Use 100dvh (dynamic viewport height) to fix mobile browser bar issues
    <div className="h-[100dvh] bg-white/80 backdrop-blur-md flex flex-col transition-all duration-500 overflow-hidden">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      {/* News Ticker Bar - Fixed height */}
      <div className="shrink-0">
        <NewsTicker />
      </div>
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 w-full flex flex-col overflow-hidden relative">
        {renderView()}
      </main>

      {/* Floating Fun Fact Widget */}
      <DidYouKnow />

      {/* Footer - Only visible on specific views or if content scrolls within view, 
          but for a chat app structure, usually we keep footer minimal or inside 'About' 
          Here we make it a thin fixed bar or hide it in Chat view on mobile to save space */}
      {currentView !== ViewState.CHAT && (
          <footer className="bg-gray-900/90 backdrop-blur-md text-gray-400 py-4 text-center text-xs relative shrink-0 shadow-inner z-10">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-1/2 bg-[#EF3340]"></div>
                <div className="w-1/2 bg-[#009E60]"></div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 hover:rotate-180 transition-transform duration-700">
                <div className="w-3 h-3 bg-[#FCD116] rounded-full rotate-45 border border-gray-900"></div>
            </div>

            <p>© {new Date().getFullYear()} <span className="font-bold"><span className="text-[#EF3340]">FASO</span><span className="text-[#FCD116]">★</span><span className="text-[#009E60]">AGENT</span></span></p>
          </footer>
      )}
    </div>
  );
};

export default App;
