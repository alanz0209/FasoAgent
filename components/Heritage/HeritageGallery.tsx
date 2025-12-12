
import React, { useState, useEffect, useRef } from 'react';
import { HERITAGE_SITES } from '../../constants';
import { HeritageSite } from '../../types';
import { generateBurkinaImage } from '../../services/geminiService';

interface HeritageGalleryProps {
  regionFilter?: string;
}

const HeritageGallery: React.FC<HeritageGalleryProps> = ({ regionFilter }) => {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  // Filter sites based on props
  const displayedSites = regionFilter 
    ? HERITAGE_SITES.filter(site => site.tags.includes(regionFilter) || site.location.includes(regionFilter))
    : HERITAGE_SITES;

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedSite) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSite]);

  const handleOpenModal = (site: HeritageSite) => {
    setSelectedSite(site);
  };

  const handleCloseModal = () => {
    setSelectedSite(null);
  };

  const handleGenerateImage = async (site: HeritageSite, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating[site.id]) return;

    setIsGenerating(prev => ({ ...prev, [site.id]: true }));
    try {
        const imageBase64 = await generateBurkinaImage(site.name + ". " + site.description);
        if (imageBase64) {
            setGeneratedImages(prev => ({ ...prev, [site.id]: imageBase64 }));
        } else {
            alert("Impossible de générer l'image pour le moment.");
        }
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la génération de l'image.");
    } finally {
        setIsGenerating(prev => ({ ...prev, [site.id]: false }));
    }
  };

  const handleResetImage = (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedImages(prev => {
        const newState = { ...prev };
        delete newState[siteId];
        return newState;
    });
  };

  const handleShare = async (site: HeritageSite, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: `Découverte Burkina Faso : ${site.name}`,
      text: `${site.name} - ${site.location}\n${site.description}`,
      url: site.websiteUrl || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erreur lors du partage:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Informations copiées dans le presse-papier !');
      } catch (err) {
        console.error('Impossible de copier:', err);
      }
    }
  };

  const getDisplayImage = (site: HeritageSite) => {
      if (generatedImages[site.id]) return generatedImages[site.id];
      if (site.imageUrl) return site.imageUrl;
      return null;
  };

  const CardWithGlare = ({ children, onClick, className }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Disable 3D effect on mobile touch devices usually, but ok to keep if subtle
        if (!cardRef.current || window.matchMedia("(hover: none)").matches) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
        cardRef.current.style.setProperty('--glare-x', `${x}px`);
        cardRef.current.style.setProperty('--glare-y', `${y}px`);
        cardRef.current.style.setProperty('--glare-opacity', '1');
    };

    const handleMouseLeave = () => {
        setTransform('');
        if (cardRef.current) {
             cardRef.current.style.setProperty('--glare-opacity', '0');
        }
    };

    return (
        <div 
            ref={cardRef}
            className={`relative transition-all duration-200 ${className} group`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ 
                transform, 
                transition: transform ? 'none' : 'transform 0.5s ease-out' 
            }}
        >
             <div 
                className="absolute inset-0 z-30 pointer-events-none rounded-xl mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)',
                    opacity: 'var(--glare-opacity, 0)',
                    transition: 'opacity 0.2s ease',
                }}
             />
             {children}
        </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 h-full overflow-y-auto">
      {!regionFilter && (
        <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-[#EF3340]">Patrimoine</span> <span className="text-[#009E60]">Culturel & Naturel</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Découvrez les trésors du Burkina Faso.
            </p>
        </div>
      )}

      {displayedSites.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Aucun site touristique majeur répertorié pour cette région dans notre base de données.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {displayedSites.map((site) => {
            const displayImage = getDisplayImage(site);
            const isAI = !!generatedImages[site.id];
            const hasOriginal = !!site.imageUrl;
            
            return (
                <CardWithGlare key={site.id} onClick={() => handleOpenModal(site)} className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-2xl border border-gray-100 flex flex-col h-full overflow-hidden">
                <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                    {/* AI Controls */}
                    <div className="absolute top-3 left-3 z-20 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {displayImage && (
                            <button
                                onClick={(e) => handleGenerateImage(site, e)}
                                disabled={isGenerating[site.id]}
                                className={`p-2 rounded-full shadow-md transition-all ${isGenerating[site.id] ? 'bg-white' : 'bg-white/90 hover:bg-[#009E60] hover:text-white'}`}
                            >
                                {isGenerating[site.id] ? (
                                    <svg className="animate-spin h-5 w-5 text-[#EF3340]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                )}
                            </button>
                        )}
                        {isAI && hasOriginal && (
                            <button onClick={(e) => handleResetImage(site.id, e)} className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-[#EF3340]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {displayImage ? (
                        <>
                            <img 
                            src={displayImage} 
                            alt={site.name} 
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {isAI && (
                                <div className="absolute bottom-4 left-4 bg-[#009E60]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                    Généré par IA
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <p className="text-sm text-gray-500 mb-3">Aucune image</p>
                            <button onClick={(e) => handleGenerateImage(site, e)} className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#EF3340] to-[#009E60]">
                            Générer par IA
                            </button>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm z-20">
                        {site.location}
                    </div>
                </div>
                
                <div className="p-4 md:p-6 flex-1 flex flex-col bg-white">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{site.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3 md:line-clamp-none">
                    {site.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                    {site.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#009E60]/10 text-[#009E60] border border-[#009E60]/20 text-[10px] md:text-xs px-2 py-1 rounded font-medium">
                        #{tag}
                        </span>
                    ))}
                    </div>
                    <div className="mt-auto flex gap-2">
                    <button onClick={() => handleOpenModal(site)} className="flex-1 bg-[#009E60] hover:bg-[#EF3340] text-white py-2 rounded-lg text-sm font-medium">
                        En savoir plus
                    </button>
                    <button onClick={(e) => handleShare(site, e)} className="px-3 bg-gray-100 text-gray-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                    </div>
                </div>
                </CardWithGlare>
            );
            })}
        </div>
      )}

      {selectedSite && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 md:zoom-in duration-200">
                <button onClick={handleCloseModal} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="h-48 md:h-80 w-full relative bg-gray-100">
                    <img src={getDisplayImage(selectedSite) || ''} alt={selectedSite.name} className="w-full h-full object-cover"/>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedSite.name}</h2>
                        <div className="text-white/90 text-sm font-medium">{selectedSite.location}</div>
                    </div>
                </div>
                <div className="p-6 md:p-8 pb-20 md:pb-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedSite.tags.map((tag, idx) => (
                            <span key={idx} className="bg-[#009E60]/10 text-[#009E60] px-3 py-1 rounded-full text-xs font-bold">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="prose prose-lg text-gray-700 mb-8">
                        <p>{selectedSite.detailedDescription || selectedSite.description}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Sources Vérifiables</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(selectedSite.externalLinks || (selectedSite.websiteUrl ? [{label: 'Lien Officiel', url: selectedSite.websiteUrl}] : [])).map((link, idx) => (
                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{link.label}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            ))}
                            {/* Museum Link */}
                            {selectedSite.museumUrl && (
                                <a href={selectedSite.museumUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-[#FCD116]/10 border border-[#FCD116] rounded-lg">
                                    <span className="text-sm font-bold text-gray-800">Visiter le Musée (Site web)</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FCD116]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HeritageGallery;