
import React, { useState } from 'react';
import { REGIONS_DATA } from '../../constants';
import HeritageGallery from './HeritageGallery';

const RegionExplorer: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const activeRegion = REGIONS_DATA.find(r => r.id === selectedRegionId);

  if (selectedRegionId && activeRegion) {
      return (
          <div className="h-full flex flex-col">
              <div className="bg-gray-900 text-white p-6 shrink-0 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Burkina_Faso_landscape_near_Dano.jpg/1280px-Burkina_Faso_landscape_near_Dano.jpg')] bg-cover bg-center"></div>
                   <div className="relative z-10 container mx-auto flex justify-between items-start">
                       <div>
                           <button onClick={() => setSelectedRegionId(null)} className="text-sm text-gray-300 hover:text-white mb-2 flex items-center gap-1">
                                ← Retour aux régions
                           </button>
                           <h2 className="text-3xl font-black text-[#FCD116]">{activeRegion.name}</h2>
                           <p className="text-lg text-gray-300">Capitale : <span className="font-bold text-white">{activeRegion.capital}</span></p>
                           <p className="mt-2 max-w-2xl text-sm opacity-90">{activeRegion.description}</p>
                       </div>
                       <div className="text-right hidden md:block">
                           <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                               <p className="text-xs uppercase tracking-wider text-gray-400">Population</p>
                               <p className="font-bold">{activeRegion.population}</p>
                               <p className="text-xs uppercase tracking-wider text-gray-400 mt-2">Climat</p>
                               <p className="font-bold">{activeRegion.climate}</p>
                           </div>
                       </div>
                   </div>
              </div>
              <div className="flex-1 overflow-hidden">
                  <HeritageGallery regionFilter={activeRegion.name} />
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-3">
             Explorateur des <span className="text-[#EF3340]">13 Régions</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
            Le Burkina Faso est riche de sa diversité. Sélectionnez une région pour découvrir ses spécificités, sa capitale et son patrimoine.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
        {REGIONS_DATA.map((region) => (
            <div 
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#FCD116] hover:-translate-y-1 transition-all cursor-pointer group"
            >
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#FCD116]/20 transition-colors">
                    <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#009E60] transition-colors">{region.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Capitale : {region.capital}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{region.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default RegionExplorer;
