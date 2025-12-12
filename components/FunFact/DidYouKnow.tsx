
import React, { useState, useEffect } from 'react';
import { BURKINA_FACTS } from '../../constants';

const DidYouKnow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    const initialTimeout = setTimeout(() => showFact(), 15000); // Delayed start
    const interval = setInterval(() => showFact(), 90000); // Slower frequency

    return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
    };
  }, []);

  const showFact = () => {
    const randomFact = BURKINA_FACTS[Math.floor(Math.random() * BURKINA_FACTS.length)];
    setCurrentFact(randomFact);
    setIsVisible(true);

    setTimeout(() => {
        setIsVisible(false);
    }, 8000);
  };

  if (!currentFact) return null;

  return (
    // Raised higher on mobile (bottom-24) to avoid covering chat input or send buttons
    <div 
        className={`fixed bottom-24 md:bottom-20 right-4 md:right-8 z-50 max-w-[85%] md:max-w-sm transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
    >
        <div className="bg-white/95 backdrop-blur-md border-l-4 border-[#FCD116] shadow-2xl rounded-lg p-4 relative overflow-hidden">
            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="flex items-start gap-3">
                <div className="bg-[#EF3340]/10 p-2 rounded-full shrink-0">
                    <span className="text-lg md:text-xl">💡</span>
                </div>
                <div>
                    <h4 className="text-[#009E60] font-bold text-xs uppercase tracking-wider mb-1">Le saviez-vous ?</h4>
                    <p className="text-xs md:text-sm text-gray-800 leading-snug font-medium">
                        {currentFact}
                    </p>
                </div>
            </div>
            {isVisible && (
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#EF3340] via-[#FCD116] to-[#009E60] w-full animate-shrink"></div>
            )}
        </div>
        <style>{`
            @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
            }
            .animate-shrink {
                animation: shrink 8s linear forwards;
            }
        `}</style>
    </div>
  );
};

export default DidYouKnow;
