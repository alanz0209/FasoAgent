
import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check browser support for Web Speech API
    const isSecureContext = window.isSecureContext;
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (isSupported && isSecureContext) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onTranscript(text);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Voice error", event.error);
        let errorMessage = "Erreur de reconnaissance vocale.";
        if (event.error === 'not-allowed') {
          errorMessage = "Permission de microphone refusée. Veuillez autoriser l'accès au microphone.";
        } else if (event.error === 'no-speech') {
          errorMessage = "Aucune parole détectée. Veuillez réessayer.";
        } else if (event.error === 'audio-capture') {
          errorMessage = "Aucun microphone trouvé. Veuillez vérifier votre équipement.";
        }
        alert(errorMessage);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur. Veuillez utiliser Chrome, Edge ou Safari.");
        return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Voice start error", error);
        alert("Erreur lors du démarrage de la reconnaissance vocale. Veuillez vérifier les permissions du microphone.");
        setIsListening(false);
      }
    }
  };

  // Show a disabled button with tooltip if not supported or not in secure context
  const isSecureContext = window.isSecureContext;
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  if (!isSupported || !isSecureContext) {
    return (
      <button
        disabled
        className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed"
        title={!isSupported 
          ? "La reconnaissance vocale n'est pas supportée par votre navigateur. Veuillez utiliser Chrome, Edge ou Safari."
          : "La reconnaissance vocale nécessite une connexion sécurisée (HTTPS)."
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    );
  }

  // If recognition is not set but should be available, return null
  if (!recognition && isSupported && isSecureContext) return null;

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`p-2 rounded-full transition-all ${
        isListening 
          ? 'bg-red-100 text-[#EF3340] animate-pulse shadow-inner' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isListening ? "Arrêter l'écoute" : "Dictée vocale"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};

export default VoiceInput;
