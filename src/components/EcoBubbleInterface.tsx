import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Mic, ArrowLeft, Pause, Play } from 'lucide-react';
// TENTE ESTA IMPORTAÇÃO (ou ajuste conforme a estrutura de pastas em node_modules):
import { Bubble } from 'lucide-react/dist/esm/icons';
import { useNavigate } from 'react-router-dom';
import './EcoBubbleInterface.css';
import { FiMoon, FiHeart, FiBook, FiSettings } from 'react-icons/fi';
import { sendMessageToOpenAI } from '../../src/sendMessageToOpenAI'; // IMPORTAÇÃO ADICIONADA

// Defina as cores azul Serylda e rosa quartzo diretamente no componente
const seryldaBlue = '#6495ED';
const quartzPink = '#F7CAC9';

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
  const [isEcoSpeaking, setIsEcoSpeaking] = useState(false);
  const latestUserMessage = useRef<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
  const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      stopVibration();
    };
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() && !isSending && message.trim() !== latestUserMessage.current) {
      setIsSending(true);
      const userMessage = message;
      setMessage('');
      latestUserMessage.current = userMessage;

      console.log("handleSendMessage: Mensagem do usuário:", userMessage);
      setConversation((prev) => {
        const newState = [...prev, `Você: ${userMessage}`];
        console.log("handleSendMessage: Estado conversation após mensagem do usuário:", newState);
        return newState;
      });
      setEcoResponseText('');
      stopVibration();
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      console.log("handleSendMessage: Chamando sendMessageToOpenAI com:", userMessage);

      try {
        const aiResponse = await sendMessageToOpenAI(userMessage);
        const ecoText = aiResponse?.text || '...';
        console.log("handleSendMessage: Resposta da API:", ecoText);
        console.log("handleSendMessage: Audio da API:", aiResponse?.audio); // VERIFICAR ESTE LOG
        const audioUrl = aiResponse?.audio;
        setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
        setIsPlaying(false);
      } catch (error: any) {
        console.error("handleSendMessage: Erro da API:", error);
        setConversation((prev) => {
          const newState = [...prev, `ECO: Erro ao obter resposta: ${error.message}`];
          console.log("handleSendMessage: Estado conversation após erro:", newState);
          return newState;
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
        console.log("togglePlayPause: Pausado"); // VERIFICAR ESTE LOG
      } else {
        audioPlayer.play().catch(error => {
          console.error("Erro ao tentar reproduzir áudio:", error); // VERIFICAR ESTE LOG
        });
        console.log("togglePlayPause: Tocando"); // VERIFICAR ESTE LOG
      }
      setIsPlaying(!isPlaying);
      console.log("togglePlayPause: isPlaying agora:", !isPlaying); // VERIFICAR ESTE LOG
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
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-4 flex flex-col items-center">
      <button onClick={handleGoBack} className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="relative mb-8">
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl relative flex items-center justify-center cursor-pointer ${
            isEcoSpeaking ? 'eco-bubble-vibrate' : ''
          }`}
          onClick={toggleMenu}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm"></div>
        </div>

        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-md p-4 grid grid-cols-2 gap-4">
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiMoon className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiHeart className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiBook className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <FiSettings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg mb-4 conversation-container p-4 max-h-[400px] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col w-fit max-w-[80%] rounded-lg p-2 my-1 text-black ${
              msg.startsWith('Você:') ? 'bg-white ml-auto' : 'bg-white mr-auto'
            }`}
          >
            <p className="text-sm">
              {msg.startsWith('ECO:') ? (
                <>
                  <Bubble className="inline-block mr-1 align-text-bottom" size={16} />
                  {msg}
                </>
              ) : (
                msg
              )}
            </p>
          </div>
        ))}
      </div>

      {audioPlayer && (
        <button onClick={togglePlayPause} className="mb-4 p-2 hover:bg-white/30 rounded-full transition-colors">
          {isPlaying ? <Pause className="w-6 h-6 text-gray-700" /> : <Play className="w-6 h-6 text-gray-700" />}
        </button>
      )}

      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Sua reflexão..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white outline-none placeholder-gray-500 text-black"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors focus:outline-none"
            disabled={isSending}
          >
            <Image className="w-6 h-6 text-gray-600 hover:scale-105 transition-transform" />
          </button>
          <button
            className="p-2 hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors focus:outline-none"
            disabled
          >
            <Mic className="w-6 h-6 text-gray-600 hover:scale-105 transition-transform" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">Compartilhe sua reflexão e deixe a ECO te espelhar.</p>
      </div>
    </div>
  );
}

export default EcoBubbleInterface;
