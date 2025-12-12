
import React from 'react';
import { RADIO_STATIONS } from '../../constants';

const RadioExplorer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl h-full overflow-y-auto">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 faso-text-gradient">Les Voix du Faso</h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Explorez le paysage radiophonique dynamique du Burkina Faso. Information, culture, débats et musique à travers les ondes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
        {RADIO_STATIONS.map((station) => (
          <div 
            key={station.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full"
          >
            {/* Top decorative bar */}
            <div className="h-2 w-full" style={{ backgroundColor: station.color }}></div>
            
            <div className="p-5 md:p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10" style={{ backgroundColor: station.color }}></div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke={station.color === '#FCD116' ? '#D4Af37' : station.color} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                </div>
                <div className="text-right">
                  <span className="block text-xl md:text-2xl font-bold text-gray-800">{station.frequency}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">Fréquence (Ouaga)</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#EF3340] transition-colors">{station.name}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                {station.description}
              </p>

              <div className="mt-auto space-y-2">
                {/* Watch Live TV */}
                {station.watchUrl && (
                    <a 
                      href={station.watchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#EF3340] text-white hover:bg-red-700 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Direct TV</span>
                    </a>
                )}

                {/* Listen Live Radio */}
                {station.listenUrl && (
                    <a 
                      href={station.listenUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#009E60] text-white hover:bg-green-700 shadow-sm"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span>Direct Radio</span>
                    </a>
                )}

                {/* Official Website */}
                <a 
                  href={station.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-white hover:border-[#FCD116] border border-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>Site Officiel</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon Card */}
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px] hover:bg-white hover:border-[#FCD116] hover:shadow-md transition-all group relative overflow-hidden">
             {/* Tricolor Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 flex">
                <div className="h-full w-1/3 bg-[#EF3340]"></div>
                <div className="h-full w-1/3 bg-[#FCD116]"></div>
                <div className="h-full w-1/3 bg-[#009E60]"></div>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
               <div className="flex gap-1 items-end h-8">
                   <div className="w-2 bg-[#EF3340] rounded-t-full animate-pulse h-4 group-hover:h-6 transition-all duration-300"></div>
                   <div className="w-2 bg-[#FCD116] rounded-t-full animate-pulse h-8 group-hover:h-4 transition-all duration-300" style={{animationDelay: '100ms'}}></div>
                   <div className="w-2 bg-[#009E60] rounded-t-full animate-pulse h-5 group-hover:h-7 transition-all duration-300" style={{animationDelay: '200ms'}}></div>
               </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Bientôt disponible</h3>
            <p className="text-sm text-gray-500 px-4">
                D'autres radios nationales seront ajoutées progressivement.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RadioExplorer;
