import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        {/* <div className="flex justify-center mb-16 scale-in-center">
          <Logo />
        </div> */}

        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl p-8 shadow-lg fade-in-bottom">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input // Substituindo Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <input // Substituindo Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="pt-2 text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <div className="pt-2">
              <button // Substituindo Button
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

          <div className="mt-6 border-t pt-6 text-center"> {/* Substituindo Divider */}
            <span className="bg-white px-3 -mt-3 inline-block text-gray-500">ou</span>
          </div>

          <div className="space-y-4 mt-6">
            <button // Substituindo Button
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

            <button // Substituindo Button
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

            <button
              className="mt-4 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              onClick={() => console.log('Start tour')}
            >
              Iniciar tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
