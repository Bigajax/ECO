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
