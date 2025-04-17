import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  // Supondo que o nome do usuário esteja armazenado em um contexto
  // const { user } = useContext(AuthContext);
  // Substitua a linha abaixo pela forma como você acessa o nome do usuário
  const loggedInUserName = 'Rafael'; // Valor padrão, substitua pela sua lógica

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
      {/* Logo (igual ao da tela de login) - Mantenha este como estava, precisaremos da sua descrição para ajustar */}
      <div className="flex items-center text-6xl font-light mb-20 mt-12">
        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">EC</span>
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] shadow-md flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-70"></div>
          <div className="w-8 h-8 rounded-full bg-white/80"></div>
        </div>
      </div>

      {/* Greeting with User's Name */}
      <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">
        {greeting}, {loggedInUserName}
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-md mb-16 leading-relaxed">
        A calma não está no mundo,
        <br />
        está dentro de você.
      </p>

      {/* Navigation */}
      <nav className="flex gap-12 mb-20">
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">
          Hoje
        </button>
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">
          Explorar
        </button>
        <button className="text-gray-600 text-lg font-medium hover:text-[#6366F1] transition-colors">
          Músicas
        </button>
      </nav>

      {/* Chat Card with ECO Bubble Icon */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] max-w-md w-full">
        <div className="flex items-center gap-4 mb-6">
          {/* Bolha ECO (igual à da tela de mensagem) */}
          <div className="relative w-12 h-12 rounded-full bg-white/60 shadow-lg flex items-center justify-center overflow-hidden">
            {/* Gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E0E0E0]/30 via-white/50 to-[#F0F0F0]/30 rounded-full"></div>
            {/* Brilho superior esquerdo */}
            <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/80 blur-sm"></div>
            {/* Pequenos pontos de luz */}
            <div className="absolute top-2 right-2 w-0.5 h-0.5 rounded-full bg-white/70"></div>
            <div className="absolute bottom-2 left-2 w-0.5 h-0.5 rounded-full bg-white/70"></div>
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
