
import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import WeatherWidget from '../Weather/WeatherWidget';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const GREETINGS = [
  { text: "Né y béoogo", lang: "Mooré" }, // Bonjour (Corrigé)
  { text: "Dansè", lang: "Dioula" },    // Bienvenue/Bonjour
  { text: "Fofo", lang: "Fulfulde" },   // Bienvenue
  { text: "Aw ni sogoma", lang: "Dioula" }, // Bonjour matin
  { text: "Ani kié", lang: "Bissa" }
];

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [greeting, setGreeting] = useState(GREETINGS[0]);

  // Rotate greetings every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(prev => {
        const idx = GREETINGS.indexOf(prev);
        return GREETINGS[(idx + 1) % GREETINGS.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="faso-gradient text-white shadow-lg sticky top-0 z-50 shrink-0">
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-3 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3">
        {/* Top Row: Logo & Mobile Weather */}
        <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(ViewState.ABOUT)}>
                {/* Logo Container */}
                <div className="relative px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg border md:border-2 border-[#FCD116] flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform duration-300 transform overflow-hidden">
                    {/* The Flag Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#EF3340_50%,#009E60_50%)] z-0"></div>
                    
                    {/* Icon Star */}
                    <div className="relative z-10 bg-white/20 p-1 rounded-full shadow-inner border border-white/40 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[#FCD116] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-lg md:text-2xl font-black tracking-tight leading-none flex items-center gap-0.5 md:gap-1 drop-shadow-lg">
                            <span className="text-white drop-shadow-md">FASO</span>
                            <span className="text-[#FCD116] text-lg md:text-xl mx-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">★</span>
                            <span className="text-white drop-shadow-md">AGENT</span>
                        </h1>
                        {/* Dynamic Greeting Ticker */}
                        <span className="text-[9px] md:text-xs font-bold text-white/90 uppercase tracking-wider drop-shadow-md w-full text-center truncate">
                            {greeting.text} <span className="opacity-80 font-normal hidden sm:inline">({greeting.lang})</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Weather Widget (Mobile) */}
            <div className="md:hidden transform scale-90 origin-right">
                <WeatherWidget />
            </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <nav className="flex-1 md:flex-none overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 bg-black/10 rounded-full p-1 backdrop-blur-sm min-w-max mx-auto md:mx-0">
                {[
                { id: ViewState.CHAT, label: 'Assistant' },
                { id: ViewState.HERITAGE, label: 'Patrimoine' },
                { id: ViewState.PHARMACIES, label: 'Pharmacies' },
                { id: ViewState.QUIZ, label: 'Jeu' },
                { id: ViewState.RADIOS, label: 'Radios' }
                ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-1.5 md:px-4 rounded-full transition-all duration-300 font-semibold whitespace-nowrap text-xs md:text-sm flex-shrink-0 ${
                    currentView === item.id 
                        ? 'bg-[#FCD116] text-[#EF3340] shadow-sm' // Active
                        : 'text-white/90 hover:bg-white/10 hover:text-white' // Inactive
                    }`}
                >
                    {item.label}
                </button>
                ))}
            </div>
          </nav>

          {/* Weather Widget (Desktop) */}
          <div className="hidden md:block shrink-0">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
