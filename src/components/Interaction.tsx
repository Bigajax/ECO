import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import Bubble3D from './Bubble3D';
import { sendMessageToOpenAI } from '../api/chat';
import MicrophoneButton from './MicrophoneButton';

interface InteractionProps {
  message: string;
  setMessage: (message: string) => void;
  onBack: () => void;
}

function Interaction({ message, setMessage, onBack }: InteractionProps) {
  const [isReflecting, setIsReflecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para fazer a bolha falar
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Procura uma voz feminina em português
    const voices = synth.getVoices();
    const femalePtVoice = voices.find(
      (voice) =>
        voice.lang.includes('pt') &&
        (voice.name.toLowerCase().includes('feminina') ||
         voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('br') ||
         voice.name.toLowerCase().includes('pt'))
    );

    if (femalePtVoice) {
      utterance.voice = femalePtVoice;
    }

    utterance.rate = 1; // velocidade da fala
    utterance.pitch = 1.1; // tom da voz

    synth.speak(utterance);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    setMessages(prev => [...prev, message]);
    try {
      const reply = await sendMessageToOpenAI(message);
      setMessages(prev => [...prev, reply]);
      speak(reply); // Faz a bolha falar
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      const errorMsg = "Erro ao conectar com a IA...";
      setMessages(prev => [...prev, errorMsg]);
      speak(errorMsg);
    }

    setMessage('');
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col p-6">
      <button
        onClick={onBack}
        className="text-white/70 hover:text-white flex items-center gap-2 mb-8"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <Bubble3D />

        {isReflecting && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-10 w-full max-w-lg px-4"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="O que você está sentindo agora?"
                className="w-full h-16 bg-transparent border-none outline-none resize-none text-white placeholder-gray-400 text-sm"
              />
              <div className="flex justify-between items-center pt-2 gap-2">
                <MicrophoneButton
                  onTranscript={(text) => setMessage((prev) => prev + ' ' + text)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isSending || !message.trim()}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all
                            disabled:opacity-50 disabled:hover:bg-white/20 disabled:cursor-not-allowed"
                >
                  <Send size={16} className={isSending ? 'animate-pulse' : ''} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {!isReflecting && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg mt-8"
          >
            <button
              onClick={() => setIsReflecting(true)}
              className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/15 transition-all"
            >
              <h2 className="text-2xl font-light mb-4">Momento de Reflexão</h2>
              <p className="text-gray-400">
                Clique para compartilhar seus pensamentos e sentimentos
              </p>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Interaction;
