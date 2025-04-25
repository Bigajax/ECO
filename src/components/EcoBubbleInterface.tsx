// Arquivo: src/components/EcoBubbleInterface/EcoBubbleInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EcoBubbleInterface.css';
import { sendMessageToOpenAI } from '../../sendMessageToOpenAI';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria';
import { supabase } from '../../supabaseClient';
import MemoryButton from './MemoryButton'; // Certifique-se que o arquivo se chama MemoryButton.tsx

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
    const [userName, setUserName] = useState<string | null>(null);
    const isFirstMessage = useRef(true);
    const conversationContainerRef = useRef<HTMLDivElement | null>(null);
    const conversationLengthRef = useRef(conversation.length);
    const [isMemoryButtonVisible, setIsMemoryButtonVisible] = useState(false); // Novo estado para visibilidade do botão de memória

    const handleGoBack = useCallback(() => navigate('/home'), [navigate]);
    const startVibration = useCallback(() => setIsEcoSpeaking(true), []);
    const stopVibration = useCallback(() => setIsEcoSpeaking(false), []);
    const handleMemoryButtonClick = useCallback(() => {
        navigate('/memories');
    }, [navigate]);
    const toggleMemoryButtonVisibility = useCallback(() => setIsMemoryButtonVisible(prev => !prev), []); // Função para alternar a visibilidade

    useEffect(() => {
        const getUserIdAndName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("User:", user);
            if (user) {
                setUserId(user.id);
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('user_id', user.id)
                    .single();

                console.log("Profile:", profile);
                console.log("Profile Error:", profileError);

                if (profileError) {
                    console.error("Erro ao buscar perfil:", profileError);
                    setUserName("usuário");
                    return;
                }

                if (profile) {
                    setUserName(profile.full_name);
                } else {
                    setUserName("usuário");
                }
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
        console.log("Current userName:", userName);
    }, [userName]);

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
        if (message.trim() && !isSending && message.trim() !== latestUserMessage.current && userId) {
            setIsSending(true);
            const userMessage = message;
            setMessage('');
            latestUserMessage.current = userMessage;
            setConversation((prev) => [...prev, { text: userMessage, isUser: true }]);
            stopVibration();
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

            console.log("Sending message with userName:", userName, "isFirstMessage:", isFirstMessage.current);

            let messageToSendToAI = userMessage;
            let conversationToSend = conversation.map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text,
            }));

            try {
                const aiResponse = await sendMessageToOpenAI(
                    messageToSendToAI,
                    userName,
                    conversationToSend // Passa o histórico formatado
                );
                const ecoText = aiResponse?.text || '...';
                const audioUrl = aiResponse?.audio;
                setConversation((prev) => {
                    let ecoFinalText = ecoText;
                    if (!ecoText?.startsWith('ECO:')) {
                        ecoFinalText = `ECO: ${ecoText}`;
                    }
                    const ecoMessage = isFirstMessage.current
                        ? { text: `ECO: Olá, ${userName}! ${ecoFinalText.substring(5).trimStart()}`, isUser: false } // Remove "ECO:" duplicado se presente e trim
                        : { text: ecoFinalText, isUser: false };
                    return [...prev, ecoMessage];
                });
                setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
                setIsPlaying(false);

                if (isFirstMessage.current && conversation.length > 0) {
                    isFirstMessage.current = false;
                }

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
    }, [message, isSending, latestUserMessage, setConversation, stopVibration, typingIntervalRef, sendMessageToOpenAI, setAudioPlayer, isPlaying, userId, salvarMensagemComMemoria, userName]);

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
        }
    }, [isListening]);

    const handleFeedbackClick = useCallback(() => {
        alert('Obrigado pelo seu feedback!');
    }, []);

    const handleSuggestionsClick = useCallback(() => {
        alert('Obrigado pelas suas sugestões!');
    }, []);

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

            <div className="relative mb-8 flex flex-col items-center">
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

            <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg mb-4 conversation-container p-4 max-h-[400px] overflow-y-auto" ref={conversationContainerRef}>
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

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg p-3 w-full max-w-lg flex flex-col items-center rounded-b-2xl shadow-lg">
                <div className="relative flex items-center gap-2 w-full input-controls-container"> {/* Adicionada a classe input-controls-container */}
                    <button
                        className="plus-button"
                        onClick={toggleMemoryButtonVisibility}
                        aria-label="Mostrar opções de memória"
                    >
                        <Lucide.Plus size={20} />
                    </button>
                    {isMemoryButtonVisible && (
                        <div className="memory-button-wrapper visible">
                            <MemoryButton onMemoryButtonClick={handleMemoryButtonClick} size="md" />
                        </div>
                    )}
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Sua reflexão..."
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-900 resize-none outline-none transition-all duration-200 min-h-[40px] max-h-[120px] placeholder-gray-400"
                        style={{ height: Math.min(120, Math.max(40, 20 + message.split('\n').length * 20)) + 'px' }}
                    />
                    <button
                        className={`mic-button p-2 rounded-full transition-all duration-200 ${
                            isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={handleMicClick}
                        aria-label={isListening ? "Parar gravação" : "Iniciar gravação"}
                    >
                        <Lucide.Mic size={20} />
                    </button>
                    <button
                        className={`send-button p-2 rounded-full transition-all duration-300 ${
                            message.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        } ${isSending ? 'scale-90' : 'scale-100'}`}
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending || !userId}
                        aria-label="Enviar mensagem"
                    >
                        <Lucide.Send size={20} />
                    </button>
                </div>

                {/* Feedback section */}
                <div className="mt-2 flex justify-around items-center w-full text-xs text-gray-500">
                    <button onClick={handleFeedbackClick} className="feedback-button flex items-center gap-1 hover:text-gray-700 transition-colors duration-200">
                        <Lucide.ThumbsUp size={14} />
                        <span>Feedback</span>
                    </button>

                    <button onClick={handleSuggestionsClick} className="feedback-button flex items-center gap-1 hover:text-gray-700 transition-colorstransition-colors duration-200">
                        <Lucide.MessageSquare size={14} />
                        <span>Sugestões</span>
                    </button>
                </div>
            </div>

           {audioPlayer && (
                <div className="absolute bottom-28 left-4 bg-white/80 backdrop-blur-lg rounded-md shadow-md p-2">
                    <button onClick={togglePlayPause} className="focus:outline-none">
                        {isPlaying ? <Lucide.Pause size={20} /> : <Lucide.Play size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EcoBubbleInterface;
