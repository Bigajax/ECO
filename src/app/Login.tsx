// src/Login.tsx
import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = () => {
    // Aqui você pode adicionar uma lógica real de autenticação
    if (email === 'teste@teste.com' && senha === '123456') {
      onLoginSuccess();
    } else {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={fazerLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition duration-200"
        >
          <LogIn className="w-5 h-5" />
          Entrar
        </button>
      </div>
    </div>
  );
}
