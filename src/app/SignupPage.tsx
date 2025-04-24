// src/app/SignupPage.tsx
import React, { useState } from 'react';
import { Mail, Lock, UserCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/home'), 2000); // Redireciona após sucesso
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-6xl font-bold tracking-wider bg-gradient-to-r from-[#6495ED] to-[#4682B4] bg-clip-text text-transparent flex items-center">
            EC<div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6495ED] to-[#4682B4] ml-1"></div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Criar minha conta</h1>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="text-sm text-gray-600 mb-1 block">Nome</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6495ED]"
                placeholder="Seu nome completo"
                required
              />
              <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm text-gray-600 mb-1 block">E-mail</label>
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
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="text-sm text-gray-600 mb-1 block">Senha</label>
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

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="text-sm text-gray-600 mb-1 block">Confirmar Senha</label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6495ED]"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Erro ou sucesso */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {success && (
            <div className="text-green-600 flex items-center gap-2 text-sm">
              <CheckCircle size={20} /> Cadastro realizado! Redirecionando...
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-medium transition-all ${
              loading
                ? 'bg-[#6495ED]/70 cursor-not-allowed'
                : 'bg-[#6495ED] hover:bg-[#4682B4]'
            }`}
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#6495ED] hover:text-[#4682B4] font-medium"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
