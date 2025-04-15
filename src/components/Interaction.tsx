import Bubble3D from '@/components/Bubble3D'; // ajuste o caminho se necessário
import { sendMessageToOpenAI } from '../api/chat';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

interface InteractionProps {
  message: string;
  setMessage: (message: string) => void;
  onBack: () => void;
}

function Interaction({ message, setMessage, onBack }: InteractionProps) {
  const [isReflecting, setIsReflecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsSending(true);
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendMessageToOpenAI(userMessage);
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      setMessages((prev) => [...prev, "Erro ao conectar com a IA..."]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col p-4">
      <button 
        onClick={onBack}
        className="text-white/70 hover:text-white flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* BOLHA FIXA NO TOPO CENTRAL */}
      {isReflecting && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <Bubble3D />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-24">
        {!isReflecting ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <button
              onClick={() => setIsReflecting(true)}
              className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center
                         hover:bg-white/15 transition-all"
            >
              <h2 className="text-xl font-light mb-2">Momento de Reflexão</h2>
              <p className="text-gray-400 text-sm">
                Clique para compartilhar seus pensamentos e sentimentos
              </p>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md space-y-3"
          >
            {/* Chat scroll */}
            {messages.length > 0 && (
              <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md rounded-lg p-2 text-sm text-white/90"
                  >
                    {msg}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Caixa de texto */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="O que você está sentindo agora?"
                className="w-full h-12 bg-transparent border-none outline-none resize-none
                         text-white placeholder-gray-400 text-sm leading-tight"
              />
              <div className="flex justify-end mt-1">
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
      </div>
    </div>
  );
}

export default Interaction;

