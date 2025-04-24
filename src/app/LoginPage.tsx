// Arquivo: src/app/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // IMPORTAÇÃO CORRIGIDA!

const LoginPage: React.FC = () => {
<<<<<<< Updated upstream
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('LoginPage - Sessão:', session);
      console.log('LoginPage - Erro ao obter sessão:', error);
      if (session?.user) {
        console.log('LoginPage - Usuário autenticado, navegando para /home');
        navigate('/home');
      } else {
        console.log('LoginPage - Usuário não autenticado, permanecendo na tela de login.');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'Erro ao fazer login. Verifique seus dados.');
      } else {
        navigate('/home');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x">
      <div className="w-full max-w-md">
        {/* Logo e nome */}
        <div className="flex justify-center mb-16 scale-in-center">
          <div className="flex items-center text-4xl md:text-6xl font-light">
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
        </div>

        {/* Formulário */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl p-8 shadow-lg fade-in-bottom">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="pt-2 text-right">
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </button>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white font-semibold focus:outline-none ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                }`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div className="mt-6 border-t pt-6 text-center">
            <span className="bg-white px-3 -mt-3 inline-block text-gray-500">ou</span>
          </div>

          {/* Botões sociais */}
          <div className="space-y-4 mt-6">
            <button
              type="button"
              className="w-full py-3 rounded-md text-gray-700 font-semibold border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
              onClick={async () => console.log('Google login')}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Entrar com o Google
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-md text-gray-700 font-semibold border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
              onClick={async () => console.log('Apple login')}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                <path d="M16.365 1.43c.07.423-.065.88-.413 1.393-.345.51-.844.903-1.5 1.177-.11-.434-.064-.884.14-1.35.21-.467.528-.86.96-1.17.437-.316.81-.48 1.13-.5.07.116.132.256.183.42zM19 15.34c-.235.54-.49 1.028-.763 1.465-.4.623-.747 1.06-1.04 1.305-.413.365-.86.547-1.34.547-.35 0-.77-.103-1.26-.306-.48-.2-.92-.3-1.313-.3-.42 0-.88.1-1.377.3-.51.203-.96.31-1.35.32-.48.01-.937-.168-1.37-.532-.29-.26-.645-.7-1.06-1.324-.46-.66-.88-1.456-1.26-2.387-.38-.94-.57-1.843-.57-2.707 0-1.25.29-2.338.88-3.26.586-.92 1.36-1.42 2.32-1.49.47-.02 1.07.12 1.8.42.52.2.86.31 1.02.32.11 0 .52-.13 1.25-.39.67-.24 1.24-.34 1.71-.3 1.26.1 2.2.65 2.81 1.65-1.12.67-1.68 1.61-1.67 2.81 0 .95.34 1.74 1.01 2.36.3.27.65.49 1.06.66-.09.27-.18.52-.27.76z" />
              </svg>
              Entrar com a Apple
            </button>
          </div>

          {/* Link para cadastro */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Você ainda não tem um perfil?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700"
              >
                Criar meu perfil
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

=======
  console.log('LoginPage component rendered'); // LOG ADICIONADO

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginPage useEffect triggered'); // LOG ADICIONADO
    const checkAuth = async () => {
      const response = await supabase.auth.getSession();
      console.log('Response do getSession:', response); // ADICIONE ESTE LOG
      const { data: { session } } = response;
      console.log('Session no useEffect:', session);
      if (session && session.user) {
        console.log('Usuário já logado, redirecionando para /home');
        navigate('/home');
      }
    };

    checkAuth();

    return () => {};
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Supabase Client:', supabase);
    console.log('Tentando login com:', { email, password });

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Erro ao fazer login:', error);
        setError(error.message || 'Erro ao fazer login. Verifique seus dados.');
      } else {
        console.log('Login realizado com sucesso!');
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setError(err?.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-16 scale-in-center">
          <div className="flex items-center text-4xl md:text-6xl font-light">
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
        </div>

        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl p-8 shadow-lg fade-in-bottom">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="pt-2 text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white font-semibold focus:outline-none ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                }`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t pt-6 text-center">
            <span className="bg-white px-3 -mt-3 inline-block text-gray-500">ou</span>
          </div>

          <div className="space-y-4 mt-6">
            <button
              className="w-full py-3 rounded-md text-gray-700 font-semibold border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
              onClick={() => console.log('Google login')}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Entrar com o Google
            </button>

            <button
              className="w-full py-3 rounded-md text-gray-700 font-semibold border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
              onClick={() => console.log('Apple login')}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2.5a4.38,4.38,0,0,0-3,.19,4.38,4.38,0,0,0-1.06,2.69A4.38,4.38,0,0,0,14.94,5.19Zm3.85,9.06a4.83,4.83,0,0,0,2.33-3.06,4.83,4.83,0,0,0-3,.19,4.83,4.83,0,0,0-2.33,3.06A4.83,4.83,0,0,0,18.79,14.25ZM17.5,8.19a6.9,6.9,0,0,0-2.94-2.94,6.9,6.9,0,0,0-3.81,0A6.9,6.9,0,0,0,7.81,8.19a6.9,6.9,0,0,0,0,3.81,6.9,6.9,0,0,0,2.94,2.94,6.9,6.9,0,0,0,3.81,0,6.9,6.9,0,0,0,2.94-2.94A6.9,6.9,0,0,0,17.5,8.19Zm-5.75,9.56a4.38,4.38,0,0,0,2.69-1.06,4.38,4.38,0,0,0,.19-3,4.38,4.38,0,0,0-2.69,1.06A4.38,4.38,0,0,0,11.75,17.75Zm-6.31-3.5a4.83,4.83,0,0,0,3.06,2.33,4.83,4.83,0,0,0-.19-3,4.83,4.83,0,0,0-3.06-2.33A4.83,4.83,0,0,0,5.44,14.25ZM8.19,6.5a4.38,4.38,0,0,0,1.06,2.69,4.38,4.38,0,0,0,3,.19A4.38,4.38,0,0,0,11.19,6.5,4.38,4.38,0,0,0,8.19,6.5Z" />
              </svg>
              Entrar com a Apple
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Você ainda não tem um perfil?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700"
              >
                Criar meu perfil
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

>>>>>>> Stashed changes
export default LoginPage;
