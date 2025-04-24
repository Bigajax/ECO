// Arquivo: src/app/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // IMPORTAÇÃO CORRIGIDA!

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/home');
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

export default LoginPage;
// Arquivo: src/app/SignupPage.tsx
import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Importe o cliente Supabase com o caminho correto

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null); // Use 'any' ou um tipo mais específico para o erro
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error);
      } else {
        console.log('Cadastro realizado com sucesso!');
        navigate('/home'); // Redirecionar para a tela Home após o cadastro
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="text-6xl font-bold tracking-wider bg-gradient-to-r from-[#6495ED] to-[#4682B4] bg-clip-text text-transparent flex items-center">
            EC<div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6495ED] to-[#4682B4] ml-1"></div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Criar meu perfil</h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6495ED]"
                placeholder="seu@email.com"
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {error && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6495ED]"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6495ED] text-white py-3 rounded-xl hover:bg-[#4682B4] transition-colors font-medium"
            disabled={loading}
          >
            {loading ? 'Criando perfil...' : 'Criar meu perfil'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem um perfil?{' '}
            <button onClick={() => navigate('/login')} className="text-[#6495ED] hover:text-[#4682B4]">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
