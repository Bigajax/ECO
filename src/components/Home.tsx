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

      {/* Logo ECO com bolha animada */}
      <div className="flex items-center text-6xl font-light mb-20 mt-12">
        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">EC</span>
        <div className="relative w-12 h-12 mx-auto flex items-center justify-center ml-2">
          <div className="w-12 h-12 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
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
          <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
              <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
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
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-full py-4 px-8 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 **transform translate-y-0** hover:-translate-y-0.5 hover:opacity-95"
          onClick={handleReceberOrientacaoClick}
        >
          Receber orientação
        </button>
      </div>
    </div>
  );
}

export default Home;
