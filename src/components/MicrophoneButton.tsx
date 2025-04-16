import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  setMessage: (text: string) => void;
}

const MicrophoneButton = ({ setMessage }: MicrophoneButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não é suportado no seu navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <button
      onClick={handleMicClick}
      className={`p-2 rounded-full transition-all ${
        isListening ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
      }`}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
};

export default MicrophoneButton;
