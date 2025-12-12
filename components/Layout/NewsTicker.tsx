
import React, { useEffect, useState } from 'react';
import { fetchHeadlines } from '../../services/geminiService';

const NewsTicker: React.FC = () => {
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const loadHeadlines = async (force = false) => {
      if (force) setIsRefreshing(true);

      try {
        const data = await fetchHeadlines(force);
        if (data && data.length > 0) {
            setHeadlines(data);
        } else {
            // Keep previous if fail, or set default if empty
            if (headlines.length === 0) {
                 setHeadlines(["Actualité en cours de chargement...", "Bienvenue sur le portail numérique du Burkina Faso"]);
            }
        }
      } catch (e) {
        console.warn("Failed to load news ticker");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

  useEffect(() => {
    // Initial load
    loadHeadlines();

    // Refresh every 5 minutes (300,000 ms) to get fresh and shuffled news
    const intervalId = setInterval(() => {
        loadHeadlines(true); // force refresh
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  // Only hide if initial load is happening and we have no content
  if (loading && headlines.length === 0) return null;

  return (
    <>
    <div className="bg-[#FCD116] border-b border-[#EF3340]/10 text-gray-900 h-10 flex items-center relative overflow-hidden shadow-sm z-40">
      {/* Label Static */}
      <div className="absolute left-0 top-0 bottom-0 z-20 bg-[#FCD116] px-3 flex items-center shadow-lg pr-4 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4 after:bg-gradient-to-r after:from-[#FCD116] after:to-transparent after:-mr-4">
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF3340] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF3340]"></span>
            </span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-[#EF3340]">ALERTE INFO</span>
        </div>
      </div>

      {/* Seamless Scrolling Content */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center w-full mask-gradient">
         <div className="animate-scroll-seamless flex items-center">
            {/* We duplicate the content to create a seamless loop effect (0% to -50% translate) */}
            {[...headlines, ...headlines].map((headline, idx) => (
                <span key={idx} className="mx-6 text-xs md:text-sm font-semibold flex items-center whitespace-nowrap">
                    {headline}
                    <span className="ml-6 text-[#EF3340] text-lg leading-none">•</span>
                </span>
            ))}
         </div>
      </div>

      {/* Action Buttons (Refresh + See All) */}
      <div className="absolute right-0 top-0 bottom-0 z-20 bg-[#FCD116] px-2 flex items-center gap-1 shadow-[-5px_0_10px_rgba(0,0,0,0.1)] pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-4 before:bg-gradient-to-l before:from-[#FCD116] before:to-transparent before:-ml-4">
          <button 
            onClick={() => loadHeadlines(true)}
            disabled={isRefreshing}
            className={`p-1.5 rounded-full transition-all ${isRefreshing ? 'animate-spin text-[#009E60]' : 'bg-white/50 hover:bg-white text-[#EF3340] hover:text-[#009E60]'}`}
            title="Actualiser les infos"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
          </button>

          <button 
            onClick={() => setShowAll(true)}
            className="bg-white/50 hover:bg-white text-[#EF3340] hover:text-[#009E60] p-1.5 rounded-full transition-all"
            title="Voir toutes les actualités"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
          </button>
      </div>
    </div>

    {/* Modal List View */}
    {showAll && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAll(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#EF3340] px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="text-[#FCD116]">★</span> Actualités en direct
                    </h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => loadHeadlines(true)} 
                            disabled={isRefreshing}
                            className={`hover:bg-white/20 rounded-full p-1 ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button onClick={() => setShowAll(false)} className="hover:bg-white/20 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <ul className="space-y-3">
                        {headlines.map((headline, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                <span className="text-[#009E60] font-bold text-lg leading-none mt-0.5">•</span>
                                <span className="text-gray-800 text-sm font-medium leading-relaxed">{headline}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">Sources : AIB, Sidwaya, LeFaso.net</p>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default NewsTicker;
