
import React, { useEffect, useState } from 'react';
import { fetchOuagaWeather } from '../../services/weatherService';
import { WeatherData } from '../../types';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchOuagaWeather();
        setWeather(data);
      } catch (e) {
        console.warn("Weather widget failed to load");
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather) return null;

  // Icon logic
  const getWeatherIcon = (code: number, isDay: boolean, size = "small") => {
    const iconClass = size === "large" ? "h-16 w-16" : "h-5 w-5";
    
    // Thunderstorm
    if (code >= 95) return (
      <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-yellow-300`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    );
    // Rain
    if (code >= 60 || code === 80 || code === 81 || code === 82) return (
       <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-blue-300`} viewBox="0 0 20 20" fill="currentColor">
         <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17v2m4-2v2" />
      </svg>
    );
    // Sun / Clear
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-[#FCD116] animate-pulse-slow`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-gray-200`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white shadow-sm ml-2 md:ml-4 transition-all duration-300 group"
      >
        <div className="mr-2 transform group-hover:scale-110 transition-transform">
          {getWeatherIcon(weather.weatherCode, weather.isDay)}
        </div>
        <div className="flex flex-col leading-none items-start">
          <span className="text-[10px] font-bold text-[#FCD116] tracking-wide">OUAGA</span>
          <span className="text-sm font-bold">{Math.round(weather.temperature)}°C</span>
        </div>
      </button>

      {/* Weather Modal Details */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
           <div className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center overflow-hidden border-t-4 border-[#EF3340]">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h3 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-6">Météo en direct</h3>
              
              <div className="flex justify-center mb-4">
                 {getWeatherIcon(weather.weatherCode, weather.isDay, "large")}
              </div>
              
              <h2 className="text-6xl font-black text-gray-800 mb-2">{Math.round(weather.temperature)}°</h2>
              <p className="text-xl font-medium text-[#009E60] mb-8">{weather.description}</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                 <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-xs text-gray-400">Humidité</span>
                    <span className="font-bold text-gray-800">{weather.humidity}%</span>
                 </div>
                 <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-400">Vent</span>
                    <span className="font-bold text-gray-800">{weather.windSpeed} km/h</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default WeatherWidget;
