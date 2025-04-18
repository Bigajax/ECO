import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Mic, ArrowLeft, Pause, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToOpenAI } from '../sendMessageToOpenAI';
import './EcoBubbleInterface.css';
import { FiMoon, FiHeart, FiBook, FiSettings } from 'react-icons/fi';

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ecoResponseText, setEcoResponseText] = useState('');
  const ecoResponseIndex = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestUserMessage = useRef<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  // Removendo as funções e chamadas de vibração
  // const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
  // const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);

  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1]?.startsWith('ECO:')) {
      const latestEcoResponse = conversation[conversation.length - 1].substring(5).trim();
      setEcoResponseText('');
      ecoResponseIndex.current = 0;
      // stopVibration(); // Removido

      if (latestEcoResponse) {
        // startVibration(); // Removido
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = setInterval(() => {
          if (ecoResponseIndex.current < latestEcoResponse.length) {
            setEcoResponseText((prev) => prev + latestEcoResponse[ecoResponseIndex.current]);
            ecoResponseIndex.current++;
          } else {
            clearInterval(typingIntervalRef.current!);
            // stopVibration(); // Removido
          }
        }, 50);
      }
    } else {
      setEcoResponseText('');
      // stopVibration(); // Removido
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      // stopVibration(); // Removido
    };
  }, [conversation]); // Removidas dependências startVibration e stopVibration

  const handleSendMessage = useCallback(async () => {
    if (message.trim() && !isSending && message.trim() !== latestUserMessage.current) {
      setIsSending(true);
      const userMessage = message;
      setMessage('');
      latestUserMessage.current = userMessage;

      console.log('Enviando mensagem:', userMessage);
      setConversation((prev) => {
        const updated = [...prev, `Você: ${userMessage}`];
        console.log('Estado conversation após mensagem do usuário:', updated);
        return updated;
      });

      setEcoResponseText('');
      // stopVibration(); // Removido
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      try {
        const aiResponse = await sendMessageToOpenAI(userMessage);
        console.log('Resposta da API recebida:', aiResponse);
        const ecoText = aiResponse?.text || '...';
        setConversation((prev) => {
          const updated = [...prev, `ECO: ${ecoText}`];
          console.log('Estado conversation após resposta da ECO:', updated);
          return updated;
        });
        setAudioPlayer(aiResponse?.audio || null);
        setIsPlaying(true);
      } catch (error: any) {
        console.error('Erro ao obter resposta da API:', error);
        setConversation((prev) => {
          const updated = [...prev, `ECO: Erro ao obter resposta: ${error.message}`];
          console.log('Estado conversation após erro da ECO:', updated);
          return updated;
        });
      } finally {
        setIsSending(false);
      }
    }
  }, [message, isSending]);

  const togglePlayPause = useCallback(() => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioPlayer, isPlaying]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [isSending, handleSendMessage]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-100 to-blue-300 flex flex-col items-center p-4">
      {/* Botão Voltar */}
      <button onClick={handleGoBack} className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Bolha ECO com Menu */}
      <div className="relative mb-8">
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl relative flex items-center justify-center cursor-pointer ${
            false // Removida a lógica de vibração
          }`}
          onClick={toggleMenu}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm"></div>
          {/* Pode adicionar um ícone central aqui para indicar o menu */}
        </div>

        {/* Menu Flutuante */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-4 grid grid-cols-2 gap-4">
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiMoon className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiHeart className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiBook className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiSettings className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Caixa de conversa */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg mb-4 conversation-container">
        {conversation.map((msg, index) => (
          <p
            key={index}
            className={msg.startsWith('Você:') ? 'user-message' : 'eco-message'}
          >
            {msg.startsWith('ECO:') ? `ECO: ${ecoResponseText}` : msg}
          </p>
        ))}
      </div>

      {/* Botão de áudio */}
      {audioPlayer && (
        <button onClick={togglePlayPause} className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          {isPlaying ? <Pause className="w-6 h-6 text-gray-600" /> : <Play className="w-6 h-6 text-gray-600" />}
        </button>
      )}

      {/* Campo de entrada de mensagem */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Sua reflexão..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none placeholder-gray-500 text-gray-700"
            disabled={isSending}
          />
          <button onClick={handleSendMessage} className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={isSending}>
            <Image className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled>
            <Mic className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">Compartilhe sua reflexão e deixe a ECO te espelhar.</p>
      </div>
    </div>
  );
}

export default EcoBubbleInterface;
