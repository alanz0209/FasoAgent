
import React from 'react';
import { TRUSTED_SOURCES } from '../../constants';

const SourceList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Mission Section */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 flex items-center justify-center flex-wrap gap-2">
            À Propos de 
            <span className="inline-flex items-center gap-1 bg-white px-4 py-1.5 rounded-2xl shadow-md border border-gray-100 transform -rotate-1">
                <span className="text-[#EF3340]">FASO</span>
                <span className="text-[#FCD116] text-2xl drop-shadow-sm">★</span>
                <span className="text-[#009E60]">AGENT</span>
            </span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          <strong className="inline-flex items-center font-black"><span className="text-[#EF3340]">FASO</span><span className="text-[#FCD116] mx-0.5">★</span><span className="text-[#009E60]">AGENT</span></strong> est une intelligence artificielle souveraine dédiée au Burkina Faso. 
          Sa mission est de démocratiser l'accès à l'information nationale, de promouvoir notre richesse culturelle 
          et d'offrir une assistance précise ancrée dans les réalités du pays.
        </p>
      </div>

      {/* Trusted Sources Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-10 relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF3340] to-[#009E60]"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
           <span className="text-[#FCD116] text-xl">★</span> Nos Sources de Confiance
        </h2>
        <p className="text-gray-600 mb-8">
            Pour garantir la fiabilité, la souveraineté et la pertinence de l'information, FASOAGENT s'appuie exclusivement sur les institutions nationales et les médias de référence reconnus :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRUSTED_SOURCES.map((source, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-[#FCD116] hover:bg-white hover:shadow-sm transition-all duration-200 group relative">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm mt-1 transition-colors
                        ${idx % 3 === 0 ? 'bg-[#EF3340]' : idx % 3 === 1 ? 'bg-[#FCD116] text-gray-900' : 'bg-[#009E60]'}
                    `}>
                        {source.category.substring(0, 1)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold text-gray-900 text-base group-hover:text-[#EF3340] transition-colors">{source.name}</h3>
                             {source.url && (
                                 <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#009E60] transition-colors p-1"
                                    title="Visiter le site"
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                 </a>
                             )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            {source.category}
                        </span>
                        <p className="text-sm text-gray-600 leading-snug">
                            {source.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Verification / Disclaimer Section */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 flex flex-col md:flex-row items-start gap-4">
        <div className="bg-yellow-100 p-2 rounded-full text-[#b39200] mt-1 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-lg">Note importante sur la vérification</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            Bien que FASOAGENT soit conçu pour fournir des informations exactes en se basant sur les sources listées ci-dessus, il s'agit d'un système d'intelligence artificielle. 
            Il est fortement recommandé de <strong>vérifier les informations critiques</strong> (alertes de sécurité, procédures administratives, santé) directement auprès des autorités compétentes ou sur les sites officiels des médias cités.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SourceList;
