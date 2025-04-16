import MicrophoneButton from './MicrophoneButton';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import Bubble3D from './Bubble3D';
import { sendMessageToOpenAI } from '../api/chat';
import MicrophoneButton from './MicrophoneButton'; // <-- Adicionado aqui

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

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    setMessages(prev => [...prev, message]);

    try {
      const reply = await sendMessageToOpenAI(message);
      setMessages(prev => [...prev, reply]);
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      setMessages(prev => [...prev, "Erro ao conectar com a IA..."]);
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

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Bubble3D />

        {!isReflecting ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg"
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
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg space-y-4"
          >
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl p-3 text-sm text-white/90 
                    ${index % 2 === 0
                      ? 'bg-white/10 self-end text-right'
                      : 'bg-white/5 self-start text-left'
                    }`}
                >
                  {msg}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Campo de digitação */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="O que você está sentindo agora?"
                className="w-full h-20 bg-transparent border-none outline-none resize-none text-white placeholder-gray-400 text-sm"
              />
              <div className="flex justify-between items-center pt-2 gap-2">
                <MicrophoneButton
                  onTranscript={(text) => setMessage((prev) => prev + ' ' + text)}
                />
                <div className="flex justify-end pt-2 gap-2">
  <MicrophoneButton setMessage={setMessage} />
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
