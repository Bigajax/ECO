import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';
import { Moon, Compass, Music, Eye } from 'lucide-react';

// Componente principal da HomePage
const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const [loading, setLoading] = useState(true); // Estado para controlar carregamento da página
  const [userName, setUserName] = useState<string>(''); // Estado para armazenar o nome do usuário
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [bubbleTitle, setBubbleTitle] = useState<string>("Olá!"); // Título do cartão
  const [bubbleText, setBubbleText] = useState<string>("Dê o primeiro passo para um novo mundo!"); // Subtítulo do cartão
  const [buttonText, setButtonText] = useState<string>("Conversar com a ECO"); // Texto do botão
  const [logo, setLogo] = useState<string>(''); // Estado para armazenar a URL da logo

  const navigateToEcoBubble = useCallback(() => {
    navigate('/eco-bubble'); // Navegação para a rota da EcoBubbleInterface
  }, [navigate]);

  // Função para exibir o ícone da bolha
  const BubbleIcon = () => (
    <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
        <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
        </div>
      </div>
    </div>
  );

  // Função para obter a saudação com base no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  // useEffect para carregar a logo
  useEffect(() => {
    // Importar a imagem como um módulo
    // Correção: Use um caminho relativo padrão para importar a imagem
    import('./caminho/para/sua/logo.png') // Substitua pelo caminho correto da sua logo
      .then(logo => {
        setLogo(logo.default); // Define o estado com a URL da imagem
      })
      .catch(error => {
        console.error("Erro ao carregar a logo:", error);
        setLogo('/placeholder_logo.png'); // Define um valor padrão em caso de erro
      });
  }, []);


  // useEffect para verificar se o usuário está autenticado e obter o nome
  useEffect(() => {
    console.log('HomePage useEffect triggered');

    const verifySession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Session in HomePage:', user);
      console.log('session?.user in HomePage:', user);

      if (!user) {
        console.log('No user session, navigating to /login from HomePage');
        navigate('/login');
      } else {
        console.log('User session found in HomePage');
        // Busca o nome do usuário no banco de dados
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
            setUserName('Usuário'); // Define um nome padrão
            setUserFirstName('Usuário');
          } else if (profile) {
            // Pega o primeiro nome
            const firstName = profile.full_name.split(' ')[0];
            console.log("Nome completo do usuário:", profile.full_name);
            console.log("Primeiro nome do usuário:", firstName);
            setUserName(profile.full_name);
            setUserFirstName(firstName);
          } else {
            setUserName('Usuário'); // Define um nome padrão caso não encontre o perfil
            setUserFirstName('Usuário');
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
          setUserName('Usuário');
          setUserFirstName('Usuário');
        }
        setLoading(false);
      }
    };

    verifySession();

  }, [navigate]);

  // Tela de carregamento enquanto verifica a sessão
  if (loading) return <div>Carregando...</div>;

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6">
      {/* Logo do app */}
      <div className="flex justify-center mb-12 pt-8">
        {/* Removendo a logo */}
      </div>

      {/* Saudação personalizada */}
      <div className="text-center mb-8">
        <h2 className="text-4xl text-gray-700">
          {greeting}, {userFirstName}
        </h2>
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
          <h3 className="text-3xl text-gray-700 mb-2 group-hover:text-purple-600 transition-colors flex items-center gap-2">
            <BubbleIcon />
            {bubbleTitle}
          </h3>
          <p className="text-gray-600 mb-6">{bubbleText}</p>
          <button
            onClick={navigateToEcoBubble}
            className="w-full bg-gradient-to-r from-[#6495ED] to-[#F7CAC9] text-white rounded-full py-4 px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            {buttonText}
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
                O céu não se importa com a altura em que a pipa voa - ele só dá espaço para que ela dance.
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
