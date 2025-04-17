// src/components/EcoBubbleInterface.tsx
import React, { useState } from 'react';
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

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isSending) {
      setIsSending(true);
      const userMessage = message;
      setMessage(''); // Limpa a caixa de mensagem imediatamente após o envio
      setConversation((prevConversation) => [...prevConversation, `Você: ${userMessage}`]);
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
      e.preventDefault(); // Evita a quebra de linha padrão no textarea
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
            {msg}
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
