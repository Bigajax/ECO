import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EcoBubbleInterface.css';
import { FiMoon, FiHeart, FiBook, FiSettings } from 'react-icons/fi';
import { sendMessageToOpenAI } from '../../src/sendMessageToOpenAI';

const seryldaBlue = '#6495ED';
const quartzPink = '#F7CAC9';

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<
    { text: string; isUser: boolean }[]
  >([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEcoSpeaking, setIsEcoSpeaking] = useState(false);
  const latestUserMessage = useRef<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // DECLARE typingIntervalRef HERE using useRef
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null); // Referência para a textarea

  const handleGoBack = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
  const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      stopVibration();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    // Rola a textarea para baixo sempre que o valor de 'message' mudar
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [message]);

  const handleSendMessage = useCallback(async () => {
    if (
      message.trim() &&
      !isSending &&
      message.trim() !== latestUserMessage.current
    ) {
      setIsSending(true);
      const userMessage = message;
      setMessage('');
      latestUserMessage.current = userMessage;

      console.log('handleSendMessage: Mensagem do usuário:', userMessage);
      setConversation((prev) => [...prev, { text: userMessage, isUser: true }]);
      stopVibration();
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      try {
        const aiResponse = await sendMessageToOpenAI(userMessage);
        const ecoText = aiResponse?.text || '...';
        const audioUrl = aiResponse?.audio;
        console.log('handleSendMessage: Resposta da API:', ecoText);
        console.log('handleSendMessage: Audio da API:', audioUrl);
        setConversation((prev) => [...prev, { text: ecoText, isUser: false }]);
        setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
        setIsPlaying(false);
      } catch (error: any) {
        console.error('handleSendMessage: Erro da API:', error);
        setConversation((prev) => [
          ...prev,
          { text: `ECO: Erro ao obter resposta: ${error.message}`, isUser: false },
        ]);
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
        audioPlayer.play().catch((error) => console.error('Erro ao reproduzir áudio:', error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioPlayer, isPlaying]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isSending && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [isSending, handleSendMessage],
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMicClick = useCallback(() => {
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
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
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
  }, [isListening, setMessage]);

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
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-2"
      >
        <Lucide.ArrowLeft size={20} />
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
            className={`flex flex-col w-fit max-w-[98%] rounded-lg p-3 my-2 text-black mr-auto`}
            style={{ marginLeft: '10px' }}
          >
            <div className="flex items-start gap-2">
              {!msg.isUser && <BubbleIcon />}
              <p className="text-sm break-words">
                {!msg.isUser && <span className="font-semibold">ECO: </span>}
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        {conversation.map((msg, index) => (
          msg.isUser && (
            <div
              key={index}
              className={`flex flex-col w-fit max-w-[80%] rounded-lg p-3 my-2 text-black ml-auto`}
            >
              <p className="text-sm break-words">{msg.text}</p>
            </div>
          )
        ))}
      </div>

      {audioPlayer && (
        <button
          onClick={togglePlayPause}
          className="mb-4 p-2 hover:bg-white/30 rounded-full transition-colors"
        >
          {isPlaying ? (
            <Lucide.Pause className="w-6 h-6 text-gray-700" />
          ) : (
            <Lucide.Play className="w-6 h-6 text-gray-700" />
          )}
        </button>
      )}

      <div className="w-full max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4">
        {isListening ? (
          // Interface de gravação de áudio minimalista com visualizador simulado
          <div className="flex flex-col items-center">
            <div className="flex items-center w-full justify-center py-2">
              <div className="audio-visualizer">
                <span style={{ '--i': 1, '--color': '#ff6b6b' }}></span>
                <span style={{ '--i': 2, '--color': '#ffa502' }}></span>
                <span style={{ '--i': 3, '--color': '#ffda79' }}></span>
                <span style={{ '--i': 4, '--color': '#77dd77' }}></span>
                <span style={{ '--i': 5, '--color': '#20b2aa' }}></span>
                <span style={{ '--i': 6, '--color': '#6495ed' }}></span>
                <span style={{ '--i': 7, '--color': '#ba55d3' }}></span>
                <span style={{ '--i': 8, '--color': '#f08080' }}></span>
              </div>
            </div>
            <button
              onClick={handleStopRecording}
              className="mt-4 p-2 hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors focus:outline-none"
            >
              <Lucide.StopCircle className="w-8 h-8 text-gray-700" /> {/* Ícone de parar */}
            </button>
            <p className="text-gray-500 text-sm mt-2">Gravando áudio...</p>
          </div>
        ) : (
          // Interface normal de digitação
          <div className="flex items-center gap-3" style={{ minHeight: '50px' }}> {/* AUMENTANDO A ALTURA MÍNIMA */}
            <textarea
              ref={inputRef} // Adicionando a referência à textarea
              placeholder="Sua reflexão..."
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white outline-none placeholder-gray-500 text-black expanded-input resize-none" /* Usando textarea e adicionando resize-none */
              style={{ padding: '12px', minHeight: '50px', maxHeight: '200px', overflowY: 'auto' }} /* Ajustando o padding e adicionando altura mínima e máxima com scroll */
              disabled={isSending || isListening}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors focus:outline-none"
              disabled={isSending || isListening || !message.trim()}
            >
              <Lucide.Send className="w-6 h-6 text-gray-600 hover:scale-105 transition-transform" />
            </button>
            <button
              onClick={handleMicClick}
              className="p-2 hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors focus:outline-none"
              disabled={isSending}
            >
              <Lucide.Mic className="w-6 h-6 text-gray-600 hover:scale-105 transition-transform" />
            </button>
          </div>
        )}
        {!isListening && (
          <p className="text-gray-500 text-sm mt-2">
            Compartilhe sua reflexão e deixe a ECO te espelhar.
          </p>
        )}
      </div>
    </div>
  );
}

export default EcoBubbleInterface;
