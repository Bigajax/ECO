import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  const loggedInUserName = 'Rafael'; // Substitua pela lógica real

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  const handleReceberOrientacaoClick = () => {
    navigate('/eco-bubble');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9DEFA] via-[#FBFCDB] to-[#E9DEFA] flex flex-col items-center p-8">
      {/* Logo ECO */}
      <div className="flex items-center text-6xl font-light mb-20 mt-12">
        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">EC</span>
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
          {/* Bolha translúcida */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-white/0 backdrop-blur-sm shadow-inner shadow-white/20">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-40" />
            <div className="absolute w-full h-full animate-pulse-slow rounded-full" />
            {/* Pontos ao redor da bolha */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full animate-spin-slow rounded-full border-dotted border-2 border-white/20 opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Saudação */}
      <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">
        {greeting}, {loggedInUserName}
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-md mb-16 leading-relaxed">
        A calma não está no mundo,
        <br />
        está dentro de você.
      </p>

      {/* Navegação */}
      <nav className="flex gap-12 mb-20">
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">Hoje</button>
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">Explorar</button>
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">Músicas</button>
      </nav>

      {/* Card com bolha estilizada */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] max-w-md w-full">
        <div className="flex items-center gap-4 mb-6">
          {/* Bolha translúcida no ícone */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-white/0 backdrop-blur-sm shadow-inner shadow-white/20">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-40" />
              <div className="absolute w-full h-full animate-pulse-slow rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-spin-slower rounded-full border-dotted border-2 border-white/20 opacity-30" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-gray-900 font-medium mb-1">Olá, {loggedInUserName}.</h2>
            <p className="text-gray-600">
              Estou aqui se precisar de uma conversa para começar seu dia.
            </p>
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-full py-4 px-8 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 hover:opacity-95"
          onClick={handleReceberOrientacaoClick}
        >
          Receber orientação
        </button>
      </div>
    </div>
  );
}

export default Home;
