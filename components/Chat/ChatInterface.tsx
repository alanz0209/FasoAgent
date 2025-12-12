
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, generateBurkinaImage } from '../../services/geminiService';
import { Message, Conversation } from '../../types';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';

interface SuggestionItem {
  text: string;
  icon: string;
  color: string;
}

const ALL_SUGGESTIONS: SuggestionItem[] = [
  { text: "Quels sont les grands titres de l'actualité ?", icon: "📰", color: "border-l-[#EF3340]" },
  { text: "Raconte-moi l'histoire de la Princesse Yennenga.", icon: "🐎", color: "border-l-[#009E60]" },
  { text: "Qui est le Mogho Naaba ?", icon: "👑", color: "border-l-[#FCD116]" },
  { text: "C'est quoi le FESPACO ?", icon: "🎬", color: "border-l-[#EF3340]" },
  { text: "Quels sites touristiques visiter à Bobo-Dioulasso ?", icon: "🕌", color: "border-l-[#009E60]" },
  { text: "Donne-moi la recette du Poulet Bicyclette.", icon: "🍗", color: "border-l-[#FCD116]" },
  { text: "Quelle est la signification du drapeau ?", icon: "🇧🇫", color: "border-l-[#EF3340]" },
  { text: "Parle-moi de Thomas Sankara.", icon: "✊🏿", color: "border-l-[#009E60]" },
  { text: "C'est quand la prochaine édition du SIAO ?", icon: "🏺", color: "border-l-[#FCD116]" },
  { text: "Quelles sont les langues parlées au Burkina ?", icon: "🗣️", color: "border-l-[#EF3340]" },
  { text: "Raconte-moi les origines de l'empire Mossi.", icon: "🏰", color: "border-l-[#009E60]" },
  { text: "Les animaux du ranch de Nazinga ?", icon: "🐘", color: "border-l-[#FCD116]" },
  { text: "Comment on prépare le Tô ?", icon: "🥣", color: "border-l-[#EF3340]" },
  { text: "Explique la parenté à plaisanterie.", icon: "🤝", color: "border-l-[#009E60]" },
  { text: "Visiter les Pics de Sindou.", icon: "⛰️", color: "border-l-[#FCD116]" }
];

const getRandomSuggestions = (count: number) => {
    const shuffled = [...ALL_SUGGESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};

const DEFAULT_MESSAGE: Message = { 
  role: 'model', 
  text: "Né y béoogo ! Je suis FASOAGENT. Posez-moi vos questions sur l'actualité, l'histoire ou la culture du Burkina Faso. Je me base sur les sources nationales fiables comme l'AIB, Sidwaya ou LeFaso.net." 
};

const ChatInterface: React.FC = () => {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  
  // History State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('fasoagent_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error("Error loading history", e);
      }
    }
    setSuggestions(getRandomSuggestions(4));

    // Responsive check
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save History to LocalStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('fasoagent_history', JSON.stringify(conversations));
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- ACTIONS ---

  const startNewChat = () => {
    setMessages([DEFAULT_MESSAGE]);
    setCurrentConversationId(null);
    setSuggestions(getRandomSuggestions(4));
    if (isMobile) setIsSidebarOpen(false);
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConversationId(conv.id);
    if (isMobile) setIsSidebarOpen(false);
  };

  const deleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = conversations.filter(c => c.id !== id);
    setConversations(newHistory);
    
    // If we deleted the active conversation, switch to new chat
    if (currentConversationId === id) {
      startNewChat();
    }
  };

  const clearAllHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer tout l'historique ?")) {
      setConversations([]);
      startNewChat();
    }
  };

  // Helper to sync current messages with history list
  const saveToHistory = (msgs: Message[]) => {
    const now = Date.now();
    let updatedConversations = [...conversations];

    if (currentConversationId) {
      // Update existing conversation
      updatedConversations = updatedConversations.map(c => 
        c.id === currentConversationId 
          ? { ...c, messages: msgs, date: now } 
          : c
      );
    } else {
      // Create new conversation ONLY if there is a user message
      const firstUserMsg = msgs.find(m => m.role === 'user');
      if (firstUserMsg) {
        const newId = Date.now().toString();
        const title = firstUserMsg.text.length > 35 
          ? firstUserMsg.text.substring(0, 35) + '...' 
          : firstUserMsg.text;

        const newConv: Conversation = {
          id: newId,
          title,
          date: now,
          messages: msgs
        };
        updatedConversations = [newConv, ...updatedConversations];
        setCurrentConversationId(newId);
      }
    }
    
    // Sort by date descending
    updatedConversations.sort((a, b) => b.date - a.date);
    setConversations(updatedConversations);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputValue;
    
    if (!textToSend.trim() || isLoading) return;

    // 1. Optimistic Update (User Message)
    const userMsg: Message = { role: 'user', text: textToSend };
    const messagesAfterUser = [...messages, userMsg];
    setMessages(messagesAfterUser);
    saveToHistory(messagesAfterUser); // Create conversation entry if new
    
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. Call API
      const response = await sendMessageToGemini(userMsg.text);
      
      let finalText = response.text;
      let pendingImageGenerationDescription: string | null = null;

      // Detect Image Tag: <<IMAGE_GEN: description>>
      const imageTagRegex = /<<IMAGE_GEN:\s*(.*?)>>/;
      const match = finalText.match(imageTagRegex);

      if (match) {
        pendingImageGenerationDescription = match[1];
        // Clean text for display
        finalText = finalText.replace(match[0], '').trim();
      }
      
      const botMsg: Message = {
        role: 'model',
        text: finalText,
        groundingSources: response.groundingChunks?.flatMap(chunk => 
           chunk.web ? [{ title: chunk.web.title, uri: chunk.web.uri }] : []
        ),
        isGeneratingImage: !!pendingImageGenerationDescription
      };

      const messagesWithBot = [...messagesAfterUser, botMsg];
      setMessages(messagesWithBot);
      saveToHistory(messagesWithBot); // Update conversation with bot reply

      // 3. Handle Image Generation (Async)
      if (pendingImageGenerationDescription) {
         try {
             const generatedUrl = await generateBurkinaImage(pendingImageGenerationDescription);
             
             // Update the LAST message (which is the bot message)
             setMessages(prev => {
                 const updated = [...prev];
                 const lastMsgIndex = updated.length - 1;
                 
                 // Safety check
                 if (lastMsgIndex >= 0 && updated[lastMsgIndex].role === 'model') {
                    if (generatedUrl) {
                        updated[lastMsgIndex] = {
                            ...updated[lastMsgIndex],
                            generatedImageUrl: generatedUrl,
                            isGeneratingImage: false 
                        };
                    } else {
                        updated[lastMsgIndex] = { 
                            ...updated[lastMsgIndex], 
                            isGeneratingImage: false 
                        };
                    }
                 }
                 saveToHistory(updated); // Save image state
                 return updated;
             });
         } catch (imgError) {
             console.error("Failed to generate image automatically:", imgError);
             setMessages(prev => {
                 const updated = [...prev];
                 const lastMsgIndex = updated.length - 1;
                 if (updated[lastMsgIndex].role === 'model') {
                    updated[lastMsgIndex] = { ...updated[lastMsgIndex], isGeneratingImage: false };
                 }
                 saveToHistory(updated);
                 return updated;
             });
         }
      }

    } catch (error) {
      const errorMsg: Message = { 
        role: 'model', 
        text: "Désolé, une erreur technique est survenue. Veuillez vérifier votre connexion ou réessayer plus tard.",
        isError: true 
      };
      setMessages(prev => {
        const updated = [...prev, errorMsg];
        saveToHistory(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInputValue(text);
    // Optional: Auto-send after voice? 
    // handleSend(text); 
    // For now, let user review the text
  };

  // UI HELPERS
  const isNewConversation = messages.length <= 1;

  // Retrieve current conversation title or default
  const activeTitle = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)?.title 
    : "Nouvelle Discussion";

  return (
    // Main Container: full height, responsive width
    <div className="flex flex-col md:flex-row h-full w-full max-w-7xl mx-auto md:gap-4 relative overflow-hidden md:overflow-visible">
      
      {/* Sidebar - History */}
      {/* CORRECTION: z-[60] ensures it is ABOVE the Header (z-50) */}
      <div 
        className={`
          fixed md:static inset-y-0 left-0 z-[60] bg-white md:bg-transparent shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 w-[85%] md:w-80' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        `}
      >
        <div className="h-full flex flex-col bg-white md:rounded-r-2xl md:border-r border-gray-100 md:shadow-lg overflow-hidden md:my-4">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EF3340]"></span>
                  Discussions
                </h2>
                {isMobile && (
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-[#EF3340] p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            
            {/* New Chat Button */}
            <div className="p-4">
                <button 
                    onClick={startNewChat}
                    className={`
                        w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm font-semibold border
                        ${!currentConversationId 
                            ? 'bg-gray-100 text-[#009E60] border-gray-200 cursor-default' 
                            : 'bg-[#009E60] hover:bg-[#EF3340] text-white border-transparent hover:shadow-md'
                        }
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Discussion
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-2 py-2">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm text-center px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Aucun historique.</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div 
                            key={conv.id}
                            onClick={() => loadConversation(conv)}
                            className={`
                                group relative flex items-center p-3 rounded-xl cursor-pointer transition-all border
                                ${currentConversationId === conv.id 
                                    ? 'bg-[#FCD116]/10 border-[#FCD116] text-gray-900 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-600'
                                }
                            `}
                        >
                            <div className="truncate flex-1 pr-8">
                                <p className={`text-sm font-medium truncate ${currentConversationId === conv.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {conv.title}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    {new Date(conv.date).toLocaleDateString()}
                                </p>
                            </div>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => deleteConversation(e, conv.id)}
                                className={`
                                    absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all
                                    ${currentConversationId === conv.id ? 'text-gray-400' : 'opacity-0 group-hover:opacity-100 text-gray-300'}
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Clear All Footer */}
            {conversations.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button 
                        onClick={clearAllHistory}
                        className="w-full text-xs text-gray-500 hover:text-[#EF3340] flex items-center justify-center gap-1 py-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Tout effacer
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white md:bg-gray-50/50 relative h-full md:my-4 md:rounded-2xl overflow-hidden md:border border-gray-100">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Mobile Overlay for Sidebar - Z-55 to be above header but below sidebar */}
        {isMobile && isSidebarOpen && (
             <div className="fixed inset-0 bg-black/60 z-[55]" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Chat Header */}
        <div className="h-14 border-b border-gray-100/50 flex items-center px-4 justify-between bg-white/80 backdrop-blur-sm z-30 shrink-0 sticky top-0">
             <div className="flex items-center gap-3 w-full">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </button>
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">
                        {activeTitle}
                    </h3>
                </div>

                {/* NEW SHORTCUT BUTTON: Add New Chat Directly in Header */}
                <button 
                    onClick={startNewChat}
                    className="p-2 text-[#009E60] hover:bg-green-50 rounded-full transition-colors"
                    title="Nouvelle discussion"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
             </div>
        </div>

        {/* Messages List - Main Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin pb-32">
            
            {/* New Conversation Hero Section */}
            {isNewConversation && !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#EF3340] to-[#009E60] rounded-3xl shadow-xl flex items-center justify-center mb-6 transform rotate-3">
                         <span className="text-[#FCD116] text-4xl">★</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-2">
                        Bienvenue sur FASOAGENT
                    </h1>
                    <p className="text-gray-500 text-center max-w-md mb-10">
                        Votre assistant personnel dédié au Burkina Faso. 
                        Posez-moi vos questions sur l'actualité, la culture ou l'histoire.
                    </p>

                    <div className="w-full max-w-4xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2 text-center md:text-left">
                            Suggestions de recherche
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(suggestion.text)}
                                    className={`
                                    text-left p-4 rounded-2xl bg-white border border-gray-100 
                                    hover:border-[#009E60]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all 
                                    text-gray-700 text-sm flex items-center gap-4 group relative overflow-hidden
                                    ${suggestion.color} border-l-[6px]
                                    `}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent"></div>
                                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                                    <span className="flex-1 font-semibold relative z-10">{suggestion.text}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-[#009E60] transition-colors relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Render Messages (skip first system message visually if desired, but here we keep it) */}
            {messages.slice(isNewConversation ? 0 : 0).map((msg, idx) => (
               <MessageBubble key={idx} message={msg} />
            ))}

            {/* Typing Indicator (Typing Bubble) */}
            {isLoading && (
            <div className="flex justify-start animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 border-l-4 border-l-[#EF3340] flex items-center gap-3 max-w-[85%] md:max-w-[75%]">
                    <div className="flex space-x-1.5 items-center px-1">
                        <div className="w-2 h-2 bg-[#EF3340] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#FCD116] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#009E60] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                        FasoAgent écrit...
                    </span>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Floating Input Area - Modern Capsule Design */}
        <div className="absolute bottom-4 left-0 right-0 px-4 md:px-8 z-40">
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-2 flex items-end gap-2 ring-1 ring-gray-200 focus-within:ring-[#009E60] transition-all duration-300">
                
                {/* Voice Input Button */}
                <div className="mb-1 md:mb-1 ml-1">
                    <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
                </div>

                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez une question sur le Burkina Faso..."
                    className="w-full px-3 py-3 bg-transparent border-none focus:ring-0 resize-none h-12 max-h-32 text-gray-800 text-sm md:text-base placeholder:text-gray-400"
                    rows={1}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className={`flex items-center justify-center rounded-full transition-all h-10 w-10 md:h-12 md:w-12 shrink-0 mb-1 md:mb-0 mr-1 ${
                    !inputValue.trim() || isLoading 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#009E60] to-[#007f4d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 transform -rotate-45 translate-x-0.5 translate-y-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2 font-medium drop-shadow-sm">
                FASOAGENT peut commettre des erreurs. Vérifiez les infos auprès des sources officielles (AIB, Sidwaya).
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
