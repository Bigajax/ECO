import React, { useState, useEffect, useRef } from 'react';
import { Image, Mic, ArrowLeft, Pause, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToOpenAI } from '../sendMessageToOpenAI';

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ecoResponseText, setEcoResponseText] = useState('');
  const ecoResponseIndex = useRef(0);
  const vibrationInterval = useRef<NodeJS.Timeout | null>(null);
  const [isEcoSpeaking, setIsEcoSpeaking] = useState(false);

  const handleGoBack = () => {
    navigate('/home');
  };

  const startVibration = () => {
    console.log('startVibration chamado');
    setIsEcoSpeaking(true);
    if ("vibrate" in navigator) {
      vibrationInterval.current = setInterval(() => {
        console.log('Vibrando...');
        navigator.vibrate(50);
      }, 200); // Intervalo aumentado para 200ms
    } else {
      console.log('API de vibração não suportada neste navegador.');
    }
  };

  const stopVibration = () => {
    console.log('stopVibration chamado');
    setIsEcoSpeaking(false);
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
      if ("vibrate" in navigator) {
        navigator.vibrate(0);
      }
    }
  };

  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].startsWith('ECO:')) {
      const latestEcoResponse = conversation[conversation.length - 1].substring(5).trim();
      setEcoResponseText('');
      ecoResponseIndex.current = 0;
      stopVibration();

      if (latestEcoResponse) {
        startVibration();
        const intervalId = setInterval(() => {
          if (ecoResponseIndex.current < latestEcoResponse.length) {
            console.log(`Index: ${ecoResponseIndex.current}, Caracter: ${latestEcoResponse[ecoResponseIndex.current]}`);
            setEcoResponseText((prevText) => prevText + latestEcoResponse[ecoResponseIndex.current]);
            ecoResponseIndex.current++;
          } else {
            clearInterval(intervalId);
            stopVibration();
          }
        }, 50);

        return () => {
          clearInterval(intervalId);
          stopVibration();
        };
      }
    } else {
      setEcoResponseText('');
      stopVibration();
    }
  }, [conversation]);

  useEffect(() => {
    if (isEcoSpeaking && !vibrationInterval.current && "vibrate" in navigator) {
      startVibration();
    } else if (!isEcoSpeaking && vibrationInterval.current) {
      stopVibration();
    }
  }, [isEcoSpeaking]);

  const handleSendMessage = async () => {
    if (message.trim() && !isSending) {
      setIsSending(true);
      const userMessage = message;
      setMessage('');
      setConversation((prevConversation) => [...prevConversation, `Você: ${userMessage}`]);
      setEcoResponseText('');
      stopVibration();

      try {
        const aiResponse = await sendMessageToOpenAI(userMessage);
        if (aiResponse?.text) {
          setConversation((prevConversation) => [...prevConversation, `ECO: ${aiResponse.text}`]);
        } else {
          setConversation((prevConversation) => [...prevConversation, `ECO: ...`]);
        }
        setAudioPlayer(aiResponse?.audio || null);
        setIsPlaying(true);
      } catch (error: any) {
        setConversation((prevConversation) => [...prevConversation, `ECO: Erro ao obter resposta: ${error.message}`]);
      } finally {
        setIsSending(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-100 to-blue-300 flex flex-col items-center p-4">
      {/* Botão Voltar */}
      <button onClick={handleGoBack} className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Floating ECO Bubble */}
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl mb-8 relative">
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm"></div>
      </div>

      {/* Conversation Display */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 mb-4 overflow-y-auto h-64">
        {conversation.map((msg, index) => (
          <p key={index} className={`mb-2 whitespace-pre-wrap ${msg.startsWith('Você:') ? 'text-blue-700' : 'text-green-700'}`}>
            {msg.startsWith('ECO:') ? (
              <>ECO: {ecoResponseText}</>
            ) : (
              msg
            )}
          </p>
        ))}
      </div>

      {/* Audio Control Button */}
      {audioPlayer && (
        <button onClick={togglePlayPause} className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          {isPlaying ? <Pause className="w-6 h-6 text-gray-600" /> : <Play className="w-6 h-6 text-gray-600" />}
        </button>
      )}

      {/* Message Input Container */}
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
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={isSending}>
            <Mic className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">Compartilhe sua reflexão e deixe a ECO te espelhar.</p>
      </div>
    </div>
  );
}

export default EcoBubbleInterface;
