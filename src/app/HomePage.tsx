import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';
import { Moon, Compass, Music, Eye } from 'lucide-react';

// Componente principal da HomePage
const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const [loading, setLoading] = useState(true); // Estado para controlar carregamento da página

  // useEffect para verificar se o usuário está autenticado
  useEffect(() => {
    console.log('HomePage useEffect triggered');

    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Obtém a sessão do usuário
      console.log('Session in HomePage:', session);
      console.log('session?.user in HomePage:', session?.user);

      // Se não houver usuário autenticado, redireciona para login
      if (!session?.user) {
        console.log('No user session, navigating to /login from HomePage');
        navigate('/login');
      } else {
        console.log('User session found in HomePage, setting loading to false');
        setLoading(false); // Se houver, exibe a página
      }
    };

    verifySession(); // Chamada da função de verificação
  }, [navigate]);

  // Tela de carregamento enquanto verifica a sessão
  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-6">
      
      {/* Logo do app */}
      <div className="flex justify-center mb-12 pt-8">
        <h1 className="text-4xl font-light text-purple-600">ECO</h1>
      </div>

      {/* Saudação personalizada */}
      <div className="text-center mb-8">
        <h2 className="text-4xl text-gray-700">Boa noite, Rafael</h2>
      </div>

      {/* Navegação principal em forma de ícones */}
      <div className="flex justify-center gap-12 mb-12">
        <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-3">
            <Moon size={24} />
          </div>
          <span>Hoje</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-3">
            <Compass size={24} />
          </div>
          <span>Explorar</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
          <div className="p-3">
            <Music size={24} />
          </div>
          <span>Músicas</span>
        </button>
      </div>

      {/* Cartões principais da tela inicial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* Cartão de orientação diária */}
        <div className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/95 cursor-pointer border border-gray-100">
          <h3 className="text-3xl text-gray-700 mb-4 group-hover:text-purple-600 transition-colors">
            Olá, Rafael.
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Estou aqui se precisar de uma conversa para começar seu dia.
          </p>
          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-4 px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            Receber orientação
          </button>
        </div>

        {/* Cartão com citação/reflexão */}
        <div className="group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100">
          <div
            className="h-48 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg')`,
            }}
          >
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 group-hover:bg-black/20 transition-colors">
              <p className="text-white text-xl text-center group-hover:scale-[1.02] transition-transform">
                O céu não se importa com a altura em que a pipa voa - ele apenas dá espaço para que ela dance.
              </p>
            </div>
          </div>
          <div className="bg-white p-4 flex justify-end group-hover:bg-white/95 transition-colors">
            <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Eye size={20} />
              <span>Ver detalhes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
