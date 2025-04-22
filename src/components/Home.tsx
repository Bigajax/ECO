import React from 'react';
import { Moon, Compass, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const loggedInUserName = 'Rafael'; // Substitua pela lógica real

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6 flex flex-col items-center">
      {/* Logo ECO com bolha animada */}
      <div className="flex items-center text-4xl md:text-6xl font-light mb-8 mt-8">
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

      {/* Navegação Centralizada */}
      <div className="flex justify-center gap-8 md:gap-12 mb-10">
        <button onClick={() => console.log('Hoje clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Moon size={40} md:size={48} />
          </div>
          <span className="mt-2">Hoje</span>
        </button>
        <button onClick={() => console.log('Explorar clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Compass size={40} md:size={48} />
          </div>
          <span className="mt-2">Explorar</span>
        </button>
        <button onClick={() => console.log('Músicas clicado')} className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-2 md:p-3">
            <Music size={40} md:size={48} />
          </div>
          <span className="mt-2">Músicas</span>
        </button>
      </div>

      {/* Card com bolha estilizada */}
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
            <h2 className="text-xl md:text-2xl text-gray-900 font-medium mb-1">Olá, {loggedInUserName}.</h2>
            {/* Frase "Estou aqui se precisar de uma conversa para começar seu dia." removida */}
          </div>
        </div>

        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-3 md:py-4 px-4 md:px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          onClick={() => navigate('/eco-bubble')}
        >
          Receber orientação
        </button>
      </div>

      {/* Reflection Card */}
      <div className="group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100 max-w-6xl w-full">
        <div
          className="h-48 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg')`
          }}
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 group-hover:bg-black/20 transition-colors">
            {/* Frase "O céu não se importa..." removida anteriormente */}
          </div>
        </div>
        <div className="bg-white p-4 flex justify-end group-hover:bg-white/95 transition-colors">
          {/* Removi o botão "Ver detalhes" conforme solicitado */}
        </div>
      </div>
    </div>
  );
}

export default Home;
