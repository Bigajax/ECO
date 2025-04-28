import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<React.ReactNode>(null); // Adiciona estado para a logo
  const navigate = useNavigate();

  // Componente da Logo ECO (mesmo componente usado na HomePage)
  const ECOLogo = () => (
    <div className="flex justify-center mb-8"> {/* Adiciona um pouco de margem abaixo da logo */}
      <span
        className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg transition-all duration-300 hover:scale-105 hover:text-shadow-2xl cursor-pointer"
      >
        ECO
      </span>
    </div>
  );

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Erro ao buscar sessão:', error);
      // Redireciona apenas se houver uma sessão ativa (token presente)
      if (data?.session?.access_token) {
        navigate('/home'); // Alterei para '/home' para consistência com App.tsx
      }
    };

    verifySession();
    setLogo(<ECOLogo />); // Define a logo no estado
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message || 'Erro ao fazer login');
    } else if (data?.session?.user) { // Verifique se há um usuário na sessão após o login
      setEmail('');
      setPassword('');
      navigate('/home'); // Alterei para '/home' para consistência com App.tsx
    }

    setLoading(false);
  };

  const handleOpenTour = () => {
    navigate('/introduction'); // Aqui definimos a rota para a página de introdução
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 px-4 py-12">
      {/* Adiciona a logo no topo */}
      {logo}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {/* Novo botão para abrir o tour */}
        <button
          type="button"
          onClick={handleOpenTour}
          className="w-full py-3 mt-4 rounded-lg text-indigo-600 font-bold border border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          Abrir o tour
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          Esqueceu a senha? <a href="#" className="text-indigo-600 underline">Recuperar</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
