import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { FaUser, FaLock, FaEye as FaEyeIcon, FaEyeSlash } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Componente da Logo ECO
    const ECOLogo = () => (
        <span
            className="text-4xl font-bold text-black drop-shadow-lg transition-all duration-300 hover:scale-105  cursor-pointer"
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
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-xl">
                <div className="flex justify-center mb-12">
                    <ECOLogo />
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaUser className="text-gray-400" style={{ color: 'black' }} />
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

                    <div className="mt-6 text-center text-sm">
                        <a href="#" className="font-medium text-black hover:text-indigo-500">
                            Esqueceu a senha?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-full py-4 px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-lg"
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

                <div className="text-center mt-4 space-y-4">
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full py-3 bg-white text-black rounded-full font-medium transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Criar conta
                    </button>
                    <div className="relative">
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
                        className="w-full py-3 bg-white text-black rounded-full font-medium transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Iniciar Tour
                    </button>
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">v1.0</p>
        </div>
    );
};

export default LoginPage;
