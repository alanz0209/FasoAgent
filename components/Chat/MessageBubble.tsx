
import React, { useState } from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

// Simple formatter to parse Markdown-like syntax (Bold and Lists)
const formatText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Check for bullet points
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanLine = isBullet ? line.trim().substring(2) : line;

    // Parse bold (**text**)
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    
    const formattedContent = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={partIdx}>{part}</span>;
    });

    if (isBullet) {
      return (
        <li key={lineIdx} className="ml-4 list-disc pl-1 mb-1 marker:text-[#EF3340]">
          {formattedContent}
        </li>
      );
    }

    // Standard paragraph or empty line
    return line.trim() === '' ? (
      <br key={lineIdx} />
    ) : (
      <p key={lineIdx} className="mb-2 last:mb-0">
        {formattedContent}
      </p>
    );
  });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = 'fr-FR'; // Force French
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(message.text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-700 group`}>
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm transition-all hover:shadow-md ${
          isUser 
            ? 'bg-[#009E60] text-white rounded-tr-none' 
            : message.isError 
              ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-none border-l-4 border-l-[#EF3340]'
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none border-l-4 border-l-[#EF3340]'
        }`}
      >
        <div className="leading-relaxed text-sm md:text-base">
          {isUser ? message.text : formatText(message.text)}
        </div>
        
        {/* Actions Bar for AI Messages */}
        {!isUser && !message.isError && (
          <div className="mt-3 pt-2 border-t border-gray-50 flex items-center gap-2 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {/* TTS Button */}
              <button 
                onClick={handleSpeak}
                className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-[10px] font-medium
                    ${isSpeaking ? 'bg-[#FCD116] text-gray-900' : 'bg-gray-100 text-gray-500 hover:text-[#009E60] hover:bg-green-50'}
                `}
                title="Écouter la réponse"
              >
                  {isSpeaking ? (
                     <>
                        <span className="animate-pulse">🔊</span>
                     </>
                  ) : (
                     <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span className="hidden sm:inline">Écouter</span>
                     </>
                  )}
              </button>

              {/* Copy Button */}
              <button 
                onClick={handleCopy}
                className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-[10px] font-medium
                    ${isCopied ? 'bg-[#009E60] text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}
                `}
                title="Copier le texte"
              >
                  {isCopied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">Copié</span>
                      </>
                  ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Copier</span>
                      </>
                  )}
              </button>
          </div>
        )}

        {/* Loading Indicator for Image */}
        {!isUser && message.isGeneratingImage && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Illustration en cours...</span>
            </div>
        )}

        {/* Generated Image Section */}
        {!isUser && message.generatedImageUrl && (
            <div className="mt-4 relative group animate-in fade-in zoom-in duration-500">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <img 
                        src={message.generatedImageUrl} 
                        alt="Illustration générée par IA" 
                        className="w-full h-auto object-cover max-h-64 hover:scale-105 transition-transform duration-500"
                    />
                </div>
                 <div className="absolute top-2 right-2 bg-[#009E60]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-1a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7a1 1 0 10-2 0v2h-2z" clipRule="evenodd" />
                    </svg>
                    Généré par IA
                </div>
            </div>
        )}

        {/* Grounding / Sources Section */}
        {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Sources Vérifiées
            </p>
            <div className="flex flex-wrap gap-2">
              {message.groundingSources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-50 hover:bg-[#FCD116]/20 hover:text-black hover:border-[#FCD116] text-gray-600 px-2 py-1.5 rounded-md border border-gray-200 transition-all truncate max-w-[200px] flex items-center gap-1"
                >
                   <span className="w-1 h-1 rounded-full bg-[#009E60]"></span>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
