import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Removendo a importação do CSS, pois pode estar causando o erro de build
// import './EcoBubbleInterface.css';
import { sendMessageToOpenAI } from '../../sendMessageToOpenAI';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria';
import { supabase } from '../../supabaseClient';
import MemoryButton from './MemoryButton';

const seryldaBlue = '#6495ED';
const quartzPink = '#F7CAC9';

interface Message {
    text: string;
    isUser: boolean;
}

interface OpenAIResponse {
    text: string;
    audio?: string;
    sentimento?: string;
    resumo?: string;
    emocao?: string;
    intensidade?: number;
}

interface MemoryData {
    usuario_id: string;
    conteudo: string;
    sentimento: string | null;
    resumo_eco: string | null;
    emocao_principal: string | null;
    intensidade: number | null;
}

function EcoBubbleInterface() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEcoSpeaking, setIsSpeaking] = useState<boolean>(false);
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
    const [isMemoryButtonVisible, setIsMemoryButtonVisible] = useState(false);
    // Removido: const [memoryToSave, setMemoryToSave] = useState<MemoryData | null>(null);


    const handleGoBack = useCallback(() => {
        console.log("handleGoBack chamado");
        navigate('/home');
    }, [navigate]);

    const startVibration = useCallback(() => {
        console.log("startVibration chamado");
        setIsSpeaking(true);
    }, []);

    const stopVibration = useCallback(() => {
        console.log("stopVibration chamado");
        setIsSpeaking(false);
    }, []);

      const handleSaveMemory = useCallback(async (memoryData: MemoryData) => {
        console.log("handleSaveMemory chamado", { memoryData, userId });
        if (userId) {
            try {
                const sucessoAoSalvar = await salvarMensagemComMemoria({ ...memoryData, usuario_id: userId });
                console.log("salvarMensagemComMemoria resultado:", sucessoAoSalvar);
                if (sucessoAoSalvar) {
                    alert("Memória salva com sucesso!"); // Substituir por notificação UI
                    setIsMemoryButtonVisible(false);
                }
            } catch (error) {
                console.error("Erro ao salvar memória", error);
                alert("Erro ao salvar memória");
            }
        }
    }, [userId]);

    const handleMemoryButtonClick = useCallback(() => {
        console.log("handleMemoryButtonClick chamado");
        // Coletar os dados relevantes para salvar na memória
        if (latestUserMessage.current && userId) {
            const lastAIResponse = conversation.findLast(msg => !msg.isUser)?.text;
              const sentimento = conversation.findLast(msg => !msg.isUser && msg.text.includes("Sentimento:"))?.text.split("Sentimento:").pop()?.trim() || null;
            const resumo_eco = conversation.findLast(msg => !msg.isUser && msg.text.includes("Resumo:"))?.text.split("Resumo:").pop()?.trim() || null;
            const emocao_principal = conversation.findLast(msg => !msg.isUser && msg.text.includes("Emoção:"))?.text.split("Emoção:").pop()?.trim() || null;
            const intensidade = conversation.findLast(msg => !msg.isUser && msg.text.includes("Intensidade:"))?.text.split("Intensidade:").pop()?.trim() ? parseFloat(conversation.findLast(msg => !msg.isUser && msg.text.includes("Intensidade:"))?.text.split("Intensidade:").pop()?.trim()!) : null;

            const memoryData: MemoryData = {
                usuario_id: userId,
                conteudo: latestUserMessage.current,
                sentimento: sentimento,
                resumo_eco: resumo_eco,
                emocao_principal: emocao_principal,
                intensidade: intensidade,
            };
            handleSaveMemory(memoryData);
        } else {
            console.warn("Nenhuma mensagem de usuário recente ou ID de usuário disponível para salvar na memória.");
        }
    }, [userId, conversation, handleSaveMemory]);

    const toggleMemoryButtonVisibility = useCallback(() => {
        console.log("toggleMemoryButtonVisibility chamado");
        setIsMemoryButtonVisible((prev) => !prev);
    }, []);


    useEffect(() => {
        const getUserIdAndName = async () => {
            console.log("useEffect [getUserIdAndName] chamado");
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                console.log("supabase.auth.getUser() resultado:", user);
                if (user) {
                    setUserId(user.id);
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', user.id)
                        .single();
                    console.log("supabase.from('profiles').select('full_name').eq('user_id', user.id).single() resultado:", { profile, profileError });

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
            } catch (error) {
                console.error("Erro ao obter usuário", error);
            }
        };

        getUserIdAndName();

        return () => {
            console.log("useEffect [getUserIdAndName] cleanup chamado");
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            stopVibration();
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [navigate, stopVibration]);

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
            console.log("handleSendMessage chamado com mensagem:", message);

            let messageToSendToAI = userMessage;
            let conversationToSend = conversation.map((msg) => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text,
            }));

            try {
                const aiResponse = await sendMessageToOpenAI(messageToSendToAI, userName, conversationToSend);
                console.log("sendMessageToOpenAI resultado:", aiResponse);
                const ecoText = aiResponse?.text || '...';
                const audioUrl = aiResponse?.audio;
                setConversation((prev) => {
                    let ecoFinalText = ecoText;
                    if (!ecoText?.startsWith('ECO:')) {
                        ecoFinalText = `ECO: ${ecoText}`;
                    }
                    const ecoMessage = isFirstMessage.current
                        ? { text: `ECO: Olá, ${userName}! ${ecoFinalText.substring(5).trimStart()}`, isUser: false }
                        : { text: ecoFinalText, isUser: false };
                    return [...prev, ecoMessage];
                });
                setAudioPlayer(audioUrl ? new Audio(audioUrl) : null);
                setIsPlaying(false);

                if (isFirstMessage.current && conversation.length > 0) {
                    isFirstMessage.current = false;
                }


            } catch (error: any) {
                console.error("Erro ao obter resposta da IA:", error);
                setConversation((prev) => [...prev, { text: `ECO: Erro ao obter resposta: ${error.message}`, isUser: false }]);
            } finally {
                setIsSending(false);
            }
        }
    }, [message, isSending, userId, userName, conversation, stopVibration]);


    useEffect(() => {
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

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !isSending && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [isSending, handleSendMessage]
    );

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
        <div className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200">
                <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                    
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
                <div
                    onClick={toggleMenu}
                    className={`w-44 h-44 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl relative flex items-center justify-center cursor-pointer`}
                >
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white/60 blur-sm"></div>
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

            <div
                className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg mb-4 conversation-container p-6 h-[400px] overflow-y-auto"
                ref={conversationContainerRef}
            >
                {conversation.map((msg, index) => {
                    const messageText = msg.text.replace(/(\r\n|\n|\r)/gm, "<br/>");
                    return (
                        <div
                            key={index}
                            className={`flex flex-col w-fit max-w-[98%] rounded-lg p-4 my-2 ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
                            style={{ marginLeft: msg.isUser ? 'auto' : '10px', backgroundColor: 'white' }}
                        >
                            <div className="flex items-start gap-2" style={{ maxWidth: '98%' }}>
                                {!msg.isUser && <BubbleIcon />}
                                <p
                                    className="text-sm break-words text-black"
                                    style={{ wordBreak: 'break-word', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}
                                >
                                    {!msg.isUser && msg.text.startsWith("ECO: ") ? "" : (!msg.isUser ? <span className="font-semibold">ECO: </span> : "")}
                                    <span dangerouslySetInnerHTML={{ __html: messageText }} />
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg p-3 w-full max-w-lg flex flex-col items-center rounded-b-2xl shadow-lg">
                <div className="relative flex items-center gap-2 w-full input-controls-container">
                    <div className="flex items-center gap-2 w-full" style={{ flexDirection: 'row-reverse' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', order: 4, alignSelf: 'flex-end' }}>
                            <button
                                className="plus-button"
                                onClick={toggleMemoryButtonVisibility}
                                aria-label="Mostrar opções de memória"
                                style={{ marginTop: '8px' }}
                            >
                                <Lucide.Plus size={20} />
                            </button>
                            {isMemoryButtonVisible && (
                                <div
                                    className="memory-button-wrapper visible"
                                    style={{ position: 'relative' }}
                                >
                                    <MemoryButton
                                        onMemoryButtonClick={handleMemoryButtonClick}
                                        size="md"
                                    />
                                </div>
                            )}
                        </div>
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Sua reflexão..."
                            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-900 resize-none outline-none transition-all duration-200 min-h-[40px] max-h-[120px] placeholder-gray-400"
                            style={{
                                height: Math.min(120, Math.max(40, 20 + message.split('\n').length * 20)),
                                width: 'calc(100% - 100px)',
                                order: 2,
                            }}
                        />
                        <button
                            className={`mic-button p-2 rounded-full transition-all duration-200 ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            onClick={handleMicClick}
                            aria-label={isListening ? "Parar gravação" : "Iniciar gravação"}
                            style={{ order: 1 }}
                        >
                            <Lucide.Mic size={20} />
                        </button>
                        <button
                            className={`send-button p-2 rounded-full transition-all duration-300 ${message.trim()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending || !userId}
                            aria-label="Enviar mensagem"
                            style={{ order: 0 }}
                        >
                            <Lucide.Send size={20} />
                        </button>
                    </div>
                </div>

                <div className="mt-2 flex justify-around items-center w-full text-xs text-gray-500">
                    <button
                        onClick={handleFeedbackClick}
                        className="feedback-button flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                    >
                        <Lucide.ThumbsUp size={14} />
                        <span>Feedback</span>
                    </button>

                    <button
                        onClick={handleSuggestionsClick}
                        className="feedback-button flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                    >
                        <Lucide.MessageSquare size={14} />
                        <span>Sugestões</span>
                    </button>
                </div>
            </div>

            {audioPlayer && (
                <div className="absolute bottom-28 left-4 bg-white/80 backdrop-blur-lg rounded-md shadow-md p-2">
                    <button
                        onClick={() => {
                            if (audioPlayer) {
                                if (isPlaying) {
                                    audioPlayer.pause();
                                } else {
                                    audioPlayer.play().catch((error) => console.error('Erro ao reproduzir áudio:', error));
                                }
                                setIsPlaying(!isPlaying);
                            }
                        }}
                        className="focus:outline-none"
                    >
                        {isPlaying ? <Lucide.Pause size={20} /> : <Lucide.Play size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EcoBubbleInterface;

