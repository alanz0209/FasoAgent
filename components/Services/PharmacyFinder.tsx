
import React, { useState } from 'react';
import { fetchPharmacies } from '../../services/geminiService';
import { Pharmacy } from '../../types';

const PharmacyFinder: React.FC = () => {
  const [city, setCity] = useState('Ouagadougou');
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    try {
      const results = await fetchPharmacies(city);
      setPharmacies(results);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2 text-gray-900">Pharmacies de Garde</h2>
            <p className="text-gray-500">Trouvez les pharmacies ouvertes cette semaine à proximité.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-[#009E60] focus:border-[#009E60]"
                >
                    <option value="Ouagadougou">Ouagadougou</option>
                    <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                    <option value="Koudougou">Koudougou</option>
                    <option value="Ouahigouya">Ouahigouya</option>
                    <option value="Banfora">Banfora</option>
                    <option value="Kaya">Kaya</option>
                    <option value="Dédougou">Dédougou</option>
                    <option value="Fada N'Gourma">Fada N'Gourma</option>
                </select>
                <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${
                        loading ? 'bg-gray-300' : 'bg-[#009E60] hover:bg-green-700 shadow-md'
                    }`}
                >
                    {loading ? 'Recherche en cours...' : 'Rechercher'}
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
                * Les données sont fournies par l'IA à partir des publications en ligne. Vérifiez toujours par téléphone.
            </p>
        </div>

        {searched && (
            <div className="space-y-4">
                {pharmacies.length > 0 ? (
                    pharmacies.map((pharmacy, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="bg-green-50 p-3 rounded-full text-[#009E60]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{pharmacy.name}</h3>
                                <p className="text-gray-600 mb-1">{pharmacy.location}</p>
                                {pharmacy.phone && (
                                    <a href={`tel:${pharmacy.phone}`} className="inline-flex items-center gap-1 text-[#009E60] font-medium text-sm hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {pharmacy.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">Aucune pharmacie trouvée par l'IA pour cette recherche.</p>
                        <p className="text-sm text-gray-400 mt-2">Essayez de consulter <a href="https://lefaso.net/spip.php?rubrique23" target="_blank" className="text-[#EF3340] underline">LeFaso.net</a> directement.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyFinder;
