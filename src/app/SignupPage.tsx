import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';
import { FaUser, FaLock, FaEye as FaEyeIcon, FaEyeSlash } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Adicionado
  const [name, setName] = useState(''); // Adicionado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Adicionado

  // Componente da Logo ECO (Reutilizando do LoginPage)
  const ECOLogo = () => (
    <span
      className="text-4xl font-bold text-black drop-shadow-lg transition-all duration-300 hover:scale-105  cursor-pointer"
    >
      ECO
    </span>
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // Salva o nome do usuário
        },
      },
    });

    if (error) {
      setError(error.message || 'Erro ao criar conta');
    } else {
      // Redireciona para a página de login após o cadastro bem-sucedido
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      navigate('/login');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => { // Adicionado
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6"
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-xl">
        <div className="flex justify-center mb-12">
          <ECOLogo />
        </div>
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Campo Nome */}
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUser className="text-gray-400" style={{ color: 'black' }} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
              className="appearance-none block w-full px-3 py-3 pl-10 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* Campo Email */}
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUser className="text-gray-400" style={{ color: 'black' }} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              className="appearance-none block w-full px-3 py-3 pl-10 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Campo Senha */}
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" style={{ color: 'black' }} />
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
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEyeIcon className="text-gray-400" style={{ color: 'black' }} />}
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" style={{ color: 'black' }} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              className="appearance-none block w-full px-3 py-3 pl-10 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEyeIcon className="text-gray-400" style={{ color: 'black' }} />}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-4 px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-lg"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <BiLoaderCircle className="animate-spin mr-2" style={{ color: 'white' }} />
                Criando conta...
              </div>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        <div className="text-center mt-4 space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-white text-black rounded-full font-medium transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Já possui conta? Entrar
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">v1.0</p>
    </div>
  );
};

export default SignupPage;
