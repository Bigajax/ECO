// src/components/EcoBubbleInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EcoBubbleInterface.css';
import { sendMessageToOpenAI } from '../../sendMessageToOpenAI';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria';
import { supabase } from '../../supabaseClient';

const seryldaBlue = '#6495ED';
const quartzPink = '#F7CAC9';

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEcoSpeaking, setIsEcoSpeaking] = useState(false);
  const latestUserMessage = useRef<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleGoBack = useCallback(() => navigate('/home'), [navigate]);
  const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
  const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        navigate('/login');
      }
    };

    getUserId();

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      stopVibration();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [navigate]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.scrollTop = inputRef.current.scrollHeight;
  }, [message]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() && !isSending && message.trim() !== latestUserMessage.current && userId) {
      setIsSending(true);
      const userMessage = message;
      setMessage('');
      latestUserMessage.current = userMessage;
      setConversation((prev) => [...prev, { text: userMessage, isUser: true }]);
      stopVibration();
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      try {
        const aiResponse = await sendMessageToOpenAI(userMessage);
        const ecoText = aiResponse?.text || '...';
        const audioUrl = aiResponse?.audio;
        setConversation((prev) => {
          if (!prev.length || prev[prev.length - 1].text !== ecoText) {
            return [...prev, { text: ecoText, isUser: false }];
          }
          return prev;
        });
        setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
        setIsPlaying(false);

        if (aiResponse?.text && userId) {
          await salvarMensagemComMemoria({
            usuario_id: userId,
            conteudo: userMessage,
            sentimento: aiResponse.sentimento || null,
            resumo_eco: aiResponse.resumo || null,
            emocao_principal: aiResponse.emocao || null,
            intensidade: aiResponse.intensidade || null,
          });
        }
      } catch (error: any) {
        setConversation((prev) => [...prev, { text: `ECO: Erro ao obter resposta: ${error.message}`, isUser: false }]);
      } finally {
        setIsSending(false);
      }
    }
  }, [message, isSending, latestUserMessage, setConversation, stopVibration, typingIntervalRef, sendMessageToOpenAI, setAudioPlayer, setIsPlaying, userId, salvarMensagemComMemoria]);

  const togglePlayPause = useCallback(() => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch((error) => console.error('Erro ao reproduzir áudio:', error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioPlayer, isPlaying]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value), []);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isSending && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [isSending, handleSendMessage]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleMicClick = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Reconhecimento de voz não é suportado no seu navegador.');
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
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = (event: any) => console.error('Erro no reconhecimento de voz:', event.error);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  const handleStopRecording = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const BubbleIcon = () => (
    <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
        <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-4 flex flex-col items-center">
      <button onClick={handleGoBack} className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-2">
        <Lucide.ArrowLeft size={20} />
        Voltar
      </button>

      <div className="relative mb-8">
        <div onClick={toggleMenu} className={`w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl relative flex items-center justify-center cursor-pointer ${isEcoSpeaking ? 'eco-bubble-vibrate' : ''}`}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm"></div>
        </div>

        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-md p-4 grid grid-cols-2 gap-4">
            <button className="p-2 hover:opacity-75 transition-opacity">
              <Lucide.Moon className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <Lucide.Heart className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <Lucide.Book className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:opacity-75 transition-opacity">
              <Lucide.Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg mb-4 conversation-container p-4 max-h-[400px] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col w-fit max-w-[98%] rounded-lg p-4 my-2 text-black ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
            style={{ marginLeft: msg.isUser ? 'auto' : '10px' }}
          >
            <div className="flex items-start gap-2" style={{ maxWidth: '98%' }}>
              {!msg.isUser && <BubbleIcon />}
              <p className="text-sm break-words" style={{ fontSize: '1.1rem' }}>
                {!msg.isUser && <span className="font-semibold">ECO: </span>}
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg p-4 w-full max-w-lg flex items-center rounded-b-2xl shadow-lg">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Sua reflexão..."
          className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          disabled={isSending || !userId}
        >
          <Lucide.Send size={20} />
        </button>
        <button
          onClick={handleMicClick}
          className={`ml-2 p-2 rounded-full ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-300 text-gray-600 hover:bg-gray-400 transition-colors'
          } focus:outline-none focus:ring-2 focus:ring-gray-300`}
        >
          <Lucide.Mic size={20} />
        </button>
      </div>
      {audioPlayer && (
        <div className="absolute bottom-16 left-4 bg-white/80 backdrop-blur-lg rounded-md shadow-md p-2">
          <button onClick={togglePlayPause} className="focus:outline-none">
            {isPlaying ? <Lucide.Pause size={20} /> : <Lucide.Play size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}

export default EcoBubbleInterface;
