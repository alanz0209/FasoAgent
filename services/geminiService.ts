
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Pharmacy } from '../types';

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;
// Cache reduced to 5 minutes (300000ms) for fresher news updates
let headlinesCache: { data: string[], timestamp: number } | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    // Try multiple environment variable names for compatibility
    // Try multiple environment variable names for compatibility
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    console.log("API Key availability check", { 
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
      hasApiKey: !!process.env.API_KEY,
      firstCharsOfApiKey: apiKey ? apiKey.substring(0, 5) + '...' : 'NONE'
    });
    
    if (!apiKey) {
      console.warn("Clé API manquante. Mode dégradé activé.");
      // On ne throw pas d'erreur ici pour permettre au reste de l'app de charger, 
      // les appels échoueront proprement dans leurs try/catch respectifs.
      return null as any; 
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const initializeChat = async () => {
  try {
    console.log("Initializing chat session");
    const ai = getClient();
    if (!ai) {
      console.log("No AI client available");
      return; // Mode sans clé API
    }
    
    // Dynamic System Instruction with Date
    const currentDate = new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const dynamicSystemInstruction = `${SYSTEM_INSTRUCTION}

[CONTEXTE TEMPOREL]
Nous sommes le : ${currentDate}. Utilise cette date pour répondre aux questions sur l'actualité (ex: "aujourd'hui", "hier").

[RAPPEL CRITIQUE]
N'utilise JAMAIS de sources internationales (RFI, France24, Jeune Afrique, etc.). Tes connaissances doivent venir uniquement de : AIB, Sidwaya, LeFaso.net, RTB, Burkina24, LefasoTV, Omega (médias nationaux uniquement).`;

    console.log("Creating chat session with model gemini-2.5-flash");
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash', // OPTIMISATION: Utilisation de Flash partout pour la rapidité en local
        config: {
        systemInstruction: dynamicSystemInstruction,
        tools: [{ googleSearch: {} }], // Enable real-time info for news
        },
    });
    console.log("Chat session created successfully");
  } catch (error) {
    console.error("Erreur initialisation chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string, groundingChunks?: any[] }> => {
  // Log for debugging in production
  console.log("Attempting to send message to Gemini");
  
  if (!chatSession) {
    console.log("No chat session, initializing...");
    await initializeChat();
  }

  // Fallback si pas de session (ex: pas de clé API en local)
  if (!chatSession) {
     console.log("No chat session available, returning fallback response");
     // Simulation d'une réponse pour éviter le crash en local
     return { 
         text: "⚠️ **Mode Local (Sans Clé API)** : Je ne peux pas contacter l'IA sans clé API configurée. Veuillez ajouter `API_KEY` dans votre environnement. En attendant, je peux afficher l'interface mais je ne peux pas 'réfléchir'.",
         groundingChunks: []
     };
  }

  try {
    console.log("Sending message to Gemini API");
    console.log("Sending message to chat session", { messageLength: message.length });
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    console.log("Received response from chat session", { hasText: !!response.text, candidatesCount: response.candidates?.length || 0 });
    
    // Extract text
    const text = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    
    // Extract grounding metadata (sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    console.log("Received response from Gemini API");
    return { text, groundingChunks };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    // If session becomes invalid/stale, reset it
    chatSession = null;
    throw error;
  }
};

export const generateBurkinaImage = async (description: string): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  const model = 'gemini-2.5-flash-image';
  const prompt = `Contexte: Burkina Faso. Génère une image photoréaliste de haute qualité représentant : ${description}. Lumière naturelle, couleurs vibrantes, style documentaire ou touristique.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        // responseMimeType is not supported for nano banana
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erreur génération image:", error);
    throw error;
  }
};

// Helper to shuffle array
const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Actualités de secours réalistes pour le mode local
const FALLBACK_NEWS = [
    "Saison des pluies : Les prévisions agro-météorologiques sont favorables pour la campagne agricole",
    "Culture : Le FESPACO prépare sa prochaine édition avec de nouvelles innovations",
    "Économie : Le gouvernement lance un nouveau programme de soutien à l'entrepreneuriat des jeunes",
    "Sport : Les Étalons du Burkina intensifient leur préparation pour les éliminatoires de la CAN",
    "Santé : Campagne de vaccination nationale contre la méningite lancée par le Ministère",
    "SIAO : Succès pour le Salon International de l'Artisanat de Ouagadougou",
    "Transports : Inauguration de nouvelles infrastructures routières dans la région du Centre",
    "Éducation : Les résultats des examens scolaires en légère hausse cette année"
];

export const fetchHeadlines = async (forceRefresh = false): Promise<string[]> => {
    // Return cached headlines if less than 5 minutes old (300000ms) and not forced
    if (!forceRefresh && headlinesCache && (Date.now() - headlinesCache.timestamp < 300000)) {
        return shuffleArray([...headlinesCache.data]);
    }

    try {
        const ai = getClient();
        if (!ai) throw new Error("Pas de client AI"); // Déclenche le catch pour utiliser le fallback

        // MODIFICATION: Utilisation de Flash pour une recherche plus rapide et robuste
        const model = 'gemini-2.5-flash';
        
        // Highly specific prompt to force local sources, recency and variety
        const prompt = `
          Rôle : Tu es un agrégateur d'actualités en temps réel pour le Burkina Faso.
          Date actuelle : ${new Date().toLocaleString('fr-FR')}

          OBJECTIF : 
          Trouve exactement 5 à 8 grands titres d'actualité datant de MOINS DE 24 HEURES (ou 48h maximum si calme).
          
          CRITÈRES DE SÉLECTION (DIVERSITÉ OBLIGATOIRE) :
          Tu dois équilibrer les sujets. Ne donne pas que de la politique !
          Essaie d'inclure au moins un titre pour chaque catégorie si possible :
          1. Politique / Gouvernement
          2. Économie / Développement
          3. Société / Faits divers majeurs
          4. Sport (Étalons, championnat...)
          5. Culture (Musique, Arts, Traditions...)

          SOURCES AUTORISÉES (SOUVERAINETÉ) :
          Utilise UNIQUEMENT des informations provenant de ces domaines web burkinabè :
          - aib.media
          - sidwaya.info
          - lefaso.net
          - rtb.bf
          - burkina24.com
          - lepays.bf
          
          INTERDICTIONS :
          - NE PAS utiliser de médias étrangers (RFI, France24...).
          - Si l'info ne vient pas d'un site local, ignore-la.
          
          FORMAT DE SORTIE STRICT :
          - Retourne UNIQUEMENT une liste de titres courts sur une seule ligne.
          - Les titres doivent être séparés par ' || '.
          - Pas de numérotation, pas de date dans le texte.
          - Exemple : Le Conseil des Ministres adopte un décret || Victoire des Étalons 2-0 || Le SIAO ouvre ses portes || Hausse du prix du coton
        `;
        
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text || "";
        // Parse the response based on the separator requested
        let headlines = text.split('||').map(h => h.trim()).filter(h => h.length > 10); 
        
        if (headlines.length > 0) {
            // Randomize order to ensure "aleatoire" feel and variety in display
            headlines = shuffleArray(headlines);
            headlinesCache = { data: headlines, timestamp: Date.now() };
            return headlines;
        }
        
        throw new Error("Pas de titres trouvés ou format invalide");
    } catch (error) {
        console.warn("Utilisation des actualités de secours (Mode Local/Erreur API/Erreur Recherche)", error);
        // Return fallback news shuffled to ensure UI always has content
        const shuffledFallback = shuffleArray([...FALLBACK_NEWS]);
        headlinesCache = { data: shuffledFallback, timestamp: Date.now() };
        return shuffledFallback;
    }
};

export const fetchPharmacies = async (city: string): Promise<Pharmacy[]> => {
  const ai = getClient();
  if (!ai) return [];

  const currentDate = new Date().toLocaleDateString('fr-FR');
  const prompt = `Trouve les pharmacies de garde à ${city} (Burkina Faso) pour cette semaine ou aujourd'hui (${currentDate}). 
  Cherche sur les sites locaux comme lefaso.net, aib.media, pharmacie.bf.
  Retourne UNIQUEMENT une liste au format JSON comme ceci: [{"name": "Nom Pharmacie", "location": "Quartier/Secteur", "phone": "Numéro"}].
  Si tu ne trouves pas, retourne un tableau vide.`;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Naive JSON extraction
    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Erreur recherche pharmacie", error);
    return [];
  }
};
