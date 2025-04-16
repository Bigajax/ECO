// src/app/Login.tsx
import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui você pode colocar a chamada da sua API real
    if (email && password) {
      console.log('Login feito! (fake)');
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-100 to-blue-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="text-6xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center">
            EC<div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 ml-1"></div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Entrar com e-mail</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="seu@email.com"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-purple-600 hover:text-purple-700 text-sm">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
