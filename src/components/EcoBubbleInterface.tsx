// Arquivo: src/components/EcoBubbleInterface/EcoBubbleInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EcoBubbleInterface.css';
import { sendMessageToOpenAI } from '../../sendMessageToOpenAI';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria';
import { supabase } from '../../supabaseClient';
import MemoryButton from './MemoryButton';

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
  const recognitionRef = useRef<any>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const isFirstMessage = useRef(true);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);
  const conversationLengthRef = useRef(conversation.length);
  const [isMemoryButtonVisible, setIsMemoryButtonVisible] = useState(false);
  const [memorySavedMessageVisible, setMemorySavedMessageVisible] = useState(false);

  const handleGoBack = useCallback(() => navigate('/home'), [navigate]);
  const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
  const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);
  const handleMemoryButtonClick = useCallback(() => navigate('/memories'), [navigate]);
  const toggleMemoryButtonVisibility = useCallback(() => setIsMemoryButtonVisible(prev => !prev), []);
  const showMemorySavedMessage = useCallback(() => {
    setMemorySavedMessageVisible(true);
    setTimeout(() => setMemorySavedMessageVisible(false), 3000);
  }, []);

  useEffect(() => {
    const getUserIdAndName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        setUserName(profile?.full_name || 'usuário');
        if (profileError) console.error("Erro ao buscar perfil:", profileError);
      } else {
        navigate('/login');
      }
    };
    getUserIdAndName();
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      stopVibration();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [navigate]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [message]);

  useEffect(() => {
    if (conversationContainerRef.current && conversation.length > conversationLengthRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
      conversationLengthRef.current = conversation.length;
    }
  }, [conversation]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending || message === latestUserMessage.current || !userId) return;
    setIsSending(true);
    const userMessage = message;
    setMessage('');
    latestUserMessage.current = userMessage;
    setConversation(prev => [...prev, { text: userMessage, isUser: true }]);
    stopVibration();
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    let messageToSendToAI = userMessage;
    let conversationToSend = conversation.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text,
    }));

    try {
      const aiResponse = await sendMessageToOpenAI(messageToSendToAI, userName, conversationToSend);
      const ecoText = aiResponse?.text || '...';
      const audioUrl = aiResponse?.audio;
      setConversation(prev => {
        let ecoFinalText = ecoText.startsWith('ECO:') ? ecoText : `ECO: ${ecoText}`;
        const ecoMessage = isFirstMessage.current
          ? { text: `ECO: Olá, ${userName}! ${ecoFinalText.substring(5).trimStart()}`, isUser: false }
          : { text: ecoFinalText, isUser: false };
        return [...prev, ecoMessage];
      });
      setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
      setIsPlaying(false);
      if (isFirstMessage.current && conversation.length > 0) isFirstMessage.current = false;
      if (aiResponse?.text && userId) {
        const sucessoAoSalvar = await salvarMensagemComMemoria({
          usuario_id: userId,
          conteudo: userMessage,
          sentimento: aiResponse.sentimento || null,
          resumo_eco: aiResponse.resumo || null,
          emocao_principal: aiResponse.emocao || null,
          intensidade: aiResponse.intensidade || null,
        });
        if (sucessoAoSalvar) showMemorySavedMessage();
      }
    } catch (error: any) {
      setConversation(prev => [...prev, { text: `ECO: Erro ao obter resposta: ${error.message}`, isUser: false }]);
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, userId, userName, conversation, showMemorySavedMessage]);

  useEffect(() => {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(err => console.error('Erro ao reproduzir áudio:', err));
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioPlayer]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value), []);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

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
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => console.error('Erro no reconhecimento de voz:', e);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [isListening]);

  return (
    <div className="eco-bubble-interface">
      {/* UI do componente */}
    </div>
  );
}

export default EcoBubbleInterface;
