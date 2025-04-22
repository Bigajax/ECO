import React, { useState, useEffect } from 'react';
import { Moon, Compass, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const loggedInUserName = 'Rafael'; // Substitua pela lógica real para obter o nome do usuário logado
  const reflectionDate = '22 de abril';
  const reflectionText = `"Estas são as características da alma racional: consciência de si mesmo, autoavaliação e autodeterminação. Ela ceifa a própria colheita. [...] Triunfa em seu próprio objetivo [...]"
MARCO AURÉLIO, MEDITAÇÕES, 11.1-2`;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6 flex flex-col items-center">
      {/* Logo ECO com bolha animada */}
      <div className="flex items-center text-4xl md:text-6xl font-light mb-4 mt-8">
        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">EC</span>
        <div className="relative w-8 h-8 md:w-12 md:h-12 mx-auto flex items-center justify-center ml-2">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Frase "A calma não está no mundo..." */}
      <p className="text-lg text-gray-700 mb-8 text-center">
        A calma não está no mundo, <br />
        está dentro de você.
      </p>

      {/* Navegação Centralizada */}
      <div className="flex justify-center gap-6 md:gap-10 mb-10">
        <button onClick={() => console.log('Hoje clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Moon size={32} md:size={36} />
          </div>
          <span className="mt-2 text-sm md:text-base">Hoje</span>
        </button>
        <button onClick={() => console.log('Explorar clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Compass size={32} md:size={36} />
          </div>
          <span className="mt-2 text-sm md:text-base">Explorar</span>
        </button>
        <button onClick={() => console.log('Músicas clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Music size={32} md:size={36} />
          </div>
          <span className="mt-2 text-sm md:text-base">Músicas</span>
        </button>
      </div>

      {/* Card com bolha estilizada e saudação dinâmica */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] max-w-md w-full mb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="relative w-8 h-8 md:w-12 md:h-12 mx-auto flex items-center justify-center">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
              <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl text-gray-900 font-medium mb-1">{greeting}, {loggedInUserName}.</h2>
            <p className="text-gray-700 text-sm md:text-base">
              Estou aqui se precisar de uma conversa <br />
              para começar seu dia.
            </p>
          </div>
        </div>

        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-3 md:py-4 px-4 md:px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          onClick={() => navigate('/eco-bubble')}
        >
          Conversar com a ECO
        </button>
      </div>

      {/* Reflection Card with Date and Text - ALTERAÇÕES AQUI */}
      <div className="group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100 max-w-6xl w-full">
        <div
          className="h-auto min-h-[150px] bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105" /* Aumentando a altura mínima e removendo altura fixa */
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg')`
          }}
        >
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 group-hover:bg-black/50 transition-colors"> {/* Aumentando a opacidade do fundo */}
            <p className="text-white text-sm mb-2">{reflectionDate}</p>
            <p className="text-white text-lg font-light text-center" style={{ fontSize: '1.2em', lineHeight: '1.7' }}> {/* Aumentando o tamanho da fonte e a altura da linha */}
              {reflectionText}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 flex justify-end group-hover:bg-white/95 transition-colors">
          <button className="text-purple-500 hover:text-purple-700 transition-colors font-medium focus:outline-none">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
