import React from 'react';
import { Circle } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9DEFA] via-[#FBFCDB] to-[#E9DEFA] flex flex-col items-center p-8">
      {/* Logo */}
      <div className="flex items-center text-6xl font-light mb-20 mt-12">
        integrando tudo, ou seja, quando coloco login e senha cai nesta página... interface principal 
        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">EC</span>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-full blur-md opacity-50"></div>
          <Circle className="w-12 h-12 relative z-10 text-[#6366F1] fill-white/90" />
        </div>
      </div>

      {/* Welcome Message */}
      <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">
        Bom dia, Rafael
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

      {/* Chat Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] max-w-md w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-full blur-md opacity-30"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#6366F1]/20 flex items-center justify-center relative z-10">
              <Circle className="w-8 h-8 text-[#6366F1]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl text-gray-900 font-medium mb-1">Olá, Rafael.</h2>
            <p className="text-gray-600">
              Estou aqui se precisar de uma conversa para começar seu dia.
            </p>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-full py-4 px-8 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 hover:opacity-95">
          Receber orientação
        </button>
      </div>
    </div>
  );
}

export default Home;

