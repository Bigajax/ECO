// src/components/EcoBubbleInterface.tsx
import React, { useState } from 'react';
import { Image, Mic } from 'lucide-react';
import { sendMessageToOpenAI } from '../sendMessageToOpenAI'; // Importe a função da API

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false); // Para indicar se a mensagem está sendo enviada

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsSending(true);
      setConversation((prevConversation) => [...prevConversation, `Você: ${message}`]);
      try {
        const response = await sendMessageToOpenAI(message);
        setConversation((prevConversation) => [...prevConversation, `ECO: ${response}`]);
      } catch (error: any) {
        setConversation((prevConversation) => [...prevConversation, `ECO: Erro ao obter resposta: ${error.message}`]);
      } finally {
        setIsSending(false);
        setMessage(''); // Limpa o input após enviar (com ou sem erro)
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-100 to-blue-300 flex flex-col items-center justify-center p-4">
      {/* Floating ECO Bubble */}
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl mb-12 relative">
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
