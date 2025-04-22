import React, { useState } from 'react';
import { Moon, Compass, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Importe o arquivo CSS para estilos personalizados

function Home() {
  const navigate = useNavigate();
  const loggedInUserName = 'Rafael'; // Substitua pela lógica real
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

      {/* Navegação - Ícone de Menu */}
      <button
        className="fixed top-6 right-6 bg-white/80 backdrop-blur-md rounded-full p-2 hover:bg-white/90 transition-colors shadow-md z-10"
        onClick={toggleMenu}
      >
        <Compass size={24} className="text-gray-600" />
      </button>

      {/* Menu Lateral (condicionalmente renderizado) */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white/90 backdrop-blur-md shadow-lg p-6 z-20 flex flex-col items-start">
          <button onClick={toggleMenu} className="mb-8 self-end">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu</h3>
          <button
            onClick={() => {
              // Adicione a lógica de navegação para "Hoje"
              console.log('Hoje clicado');
              setIsMenuOpen(false);
            }}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-3"
          >
            <Moon size={20} className="mr-2" />
            Hoje
          </button>
          <button
            onClick={() => {
              // Adicione a lógica de navegação para "Explorar"
              console.log('Explorar clicado');
              setIsMenuOpen(false);
            }}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-3"
          >
            <Compass size={20} className="mr-2" />
            Explorar
          </button>
          <button
            onClick={() => {
              // Adicione a lógica de navegação para "Músicas"
              console.log('Músicas clicado');
              setIsMenuOpen(false);
            }}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-3"
          >
            <Music size={20} className="mr-2" />
            Músicas
          </button>
          {/* Você pode adicionar mais itens de menu aqui */}
        </div>
      )}

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
            <p className="text-gray-600 text-sm md:text-lg">
              Estou aqui se precisar de uma conversa para começar seu dia.
            </p>
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
            <p className="text-white text-xl text-center group-hover:scale-[1.02] transition-transform">
              O céu não se importa com a altura em que a pipa voa - ele apenas dá espaço para que ela dance.
            </p>
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
