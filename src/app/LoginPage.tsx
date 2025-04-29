import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

// Defina as cores Serilda e Quartzo
const serildaBlue = '#74CBD4';
const quartzoPink = '#F2B8B5';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

    // Componente da Logo ECO (igual ao da HomePage)
    const ECOLogo = () => (
        <span
            className="text-4xl font-bold bg-gradient-to-r from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] text-transparent bg-clip-text drop-shadow-lg transition-all duration-300 hover:scale-105 hover:text-shadow-2xl cursor-pointer"
        >
            ECO
        </span>
    );

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Erro ao buscar sessão:', error);
      if (data?.session?.access_token) {
        navigate('/home');
      }
    };

    verifySession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message || 'Erro ao fazer login');
    } else if (data?.session?.user) {
      setEmail('');
      setPassword('');
      navigate('/home');
    }

    setLoading(false);
  };

  const handleOpenTour = () => {
    navigate('/introduction');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6"
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <ECOLogo /> {/* Use o componente ECOLogo aqui */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUser className="text-gray-400" style={{ color: serildaBlue }} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail ou usuário"
              required
              className="appearance-none block w-full px-3 py-3 pl-10 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" style={{ color: serildaBlue }} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="appearance-none block w-full px-3 py-3 pl-10 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" style={{ color: serildaBlue }} />}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' // Alterado para preto
            }`}
            style={{
              backgroundColor: loading ? '#gray-400' :  `linear-gradient(to right, ${serildaBlue}, ${quartzoPink})`,
              color: !loading ? 'white' : undefined,
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <BiLoaderCircle className="animate-spin mr-2" style={{ color: 'white' }} />
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500" style={{ color: serildaBlue }}>
            Esqueceu a senha?
          </a>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenTour}
          className="w-full py-3 mt-4 rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Iniciar Tour
        </button>
      </div>
      <p className="mt-4 text-xs text-gray-500">v1.0</p>
    </div>
  );
};

export default LoginPage;
