import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de login bem-sucedido
    if (username && password) {
      navigate('/home'); // Vai para a página principal
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E9DEFA] via-[#FBFCDB] to-[#E9DEFA]">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-md max-w-md w-full space-y-6"
      >
        <h1 className="text-3xl font-medium text-center text-gray-800">Entrar</h1>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-xl font-medium hover:bg-indigo-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
