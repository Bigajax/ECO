import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToOpenAI } from '../../sendMessageToOpenAI';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria';
import { supabase } from '../../supabaseClient';
import MemoryButton from './MemoryButton';
import styled from 'styled-components';

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

const ConversationContainer = styled.div`
    width: 100%;
    max-width: 640px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    padding: 1.5rem;
    height: 400px;
    overflow-y: auto;
`;

const MessageWrapper = styled.div<{ isUser: boolean }>`
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 98%;
    border-radius: 0.75rem;
    padding: 1rem;
    margin: 0.5rem 0;
    margin-left: ${props => props.isUser ? 'auto' : 'unset'};
    margin-right: ${props => props.isUser ? 'unset' : 'auto'};
    background-color: white;
`;

const TextStyle = styled.p`
    font-size: 0.95rem;
    word-break: break-word;
    white-space: pre-wrap;
    color: black;
`;

const InputControlsContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
`;

const RowReverse = styled.div`
    flex-direction: row-reverse;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
`;

const PlusButton = styled.button`
    margin-top: 0.5rem;
`;

const MemoryButtonWrapper = styled.div`
    position: relative;
`;

const Input = styled.textarea`
    width: calc(100% - 100px);
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    color: #1f2937;
    resize: none;
    outline: none;
    transition: all 0.2s ease;
    min-height: 2.5rem;
    max-height: 7.5rem;
    placeholder-color: #9ca3af;
    order: 2;
    height: ${props => props.style?.height || 'auto'};
`;

const MicButton = styled.button`
    padding: 0.5rem;
    border-radius: 9999px;
    transition: all 0.2s ease;
    order: 1;
    ${props => props.isListening
        ? 'background-color: red; color: white; animation: pulse 2s infinite;'
        : 'color: #6b7280; &:hover { color: #374151; background-color: #f9fafb; }'
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

const SendButton = styled.button`
    padding: 0.5rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    order: 0;
    background-color: ${props => props.disabled ? '#f3f4f6' : '#3b82f6'};
    color: ${props => props.disabled ? '#9ca3af' : 'white'};
    &:hover {
        background-color: ${props => props.disabled ? '#f3f4f6' : '#2563eb'};
    }
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const FeedbackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6b7280;
    transition: color 0.2s ease;
    &:hover {
        color: #374151;
    }
`;

const BubbleIcon = () => (
    <div className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200">
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
                
            </div>
        </div>
    </div>
);

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

            <ConversationContainer ref={conversationContainerRef}>
                {conversation.map((msg, index) => {
                    const messageText = msg.text.replace(/(\r\n|\n|\r)/gm, "<br/>");
                    return (
                        <MessageWrapper key={index} isUser={msg.isUser}>
                            <div className="flex items-start gap-2" style={{ maxWidth: '98%' }}>
                                {!msg.isUser && <BubbleIcon />}
                                <TextStyle dangerouslySetInnerHTML={{ __html: messageText }} />
                            </div>
                        </MessageWrapper>
                    );
                })}
            </ConversationContainer>

            <div style={{position: 'sticky', bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', padding: '0.75rem', width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem', boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)' }}>
                <InputControlsContainer>
                    <RowReverse>
                        <div style={{ display: 'flex', alignItems: 'flex-start', order: 4, alignSelf: 'flex-end' }}>
                            <PlusButton
                                className="plus-button"
                                onClick={toggleMemoryButtonVisibility}
                                aria-label="Mostrar opções de memória"
                            >
                                <Lucide.Plus size={20} />
                            </PlusButton>
                            {isMemoryButtonVisible && (
                                <MemoryButtonWrapper className="memory-button-wrapper visible">
                                    <MemoryButton
                                        onMemoryButtonClick={handleMemoryButtonClick}
                                        size="md"
                                    />
                                </MemoryButtonWrapper>
                            )}
                        </div>
                        <Input
                            ref={inputRef}
                            value={message}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Sua reflexão..."
                            style={{
                                height: Math.min(7.5 * 16, Math.max(2.5 * 16, 20 + message.split('\n').length * 20)),
                            }}
                        />
                        <MicButton
                            className="mic-button"
                            onClick={handleMicClick}
                            aria-label={isListening ? "Parar gravação" : "Iniciar gravação"}
                            isListening={isListening}
                        >
                            <Lucide.Mic size={20} />
                        </MicButton>
                        <SendButton
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending || !userId}
                        >
                            <Lucide.Send size={20} />
                        </SendButton>
                    </RowReverse>
                </InputControlsContainer>

                <div className="mt-2 flex justify-around items-center w-full text-xs text-gray-500">
                    <FeedbackButton
                        onClick={handleFeedbackClick}
                        className="feedback-button"
                    >
                        <Lucide.ThumbsUp size={14} />
                        <span>Feedback</span>
                    </FeedbackButton>

                    <FeedbackButton
                        onClick={handleSuggestionsClick}
                        className="feedback-button"
                    >
                        <Lucide.MessageSquare size={14} />
                        <span>Sugestões</span>
                    </FeedbackButton>
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

