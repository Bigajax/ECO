// src/components/EcoBubbleInterface.tsx
import React, { useState } from 'react';
import { Image, Mic } from 'lucide-react';

function EcoBubbleInterface() {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-100 to-blue-300 flex flex-col items-center justify-center p-4">
      {/* Floating ECO Bubble */}
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg shadow-xl mb-12 relative">
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm"></div>
      </div>

      {/* Message Input Container */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="iMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder-gray-500 text-gray-700"
          />
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Mic className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">Pressione e segure para gravar mensagem de voz</p>
      </div>
      {/* Aqui você pode adicionar a área para exibir as mensagens (Chat.tsx) */}
    </div>
  );
}

export default EcoBubbleInterface;
