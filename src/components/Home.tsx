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
      
      {/* Logo ECO (importado do Login) */}
      <div className="flex justify-center mb-8 mt-12">
        <div className="text-6xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center">
          EC<div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 ml-1"></div>
        </div>
      </div>

      {/* Saudação */}
      <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">
        {greeting}, {loggedInUserName}
      </h1>

      {/* Botão de navegação */}
      <button
        onClick={handleReceberOrientacaoClick}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-all"
      >
        Receber Orientação
      </button>
    </div>
  );
}

export default Home;
