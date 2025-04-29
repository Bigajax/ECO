import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'supabaseClient';
import { Moon, Compass, Music, Eye } from 'lucide-react';
import { FaUser, FaLock, FaEye as FaEyeIcon, FaEyeSlash } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

// Defina as cores Serilda e Quartzo
const serildaBlue = '#74CBD4';
const quartzoPink = '#F2B8B5';

// Componente principal da HomePage (usado para pegar a logo e estilo)
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>('');
    const [userFirstName, setUserFirstName] = useState<string>('');
    const [logo, setLogo] = useState<React.ReactNode>(null);

    // Componente da Logo ECO (Mantido igual ao da HomePage)
    const ECOLogo = () => (
        <span
            className="text-4xl font-bold text-black drop-shadow-lg transition-all duration-300 hover:scale-105  cursor-pointer"
        >
            ECO
        </span>
    );

    const navigateToEcoBubble = useCallback(() => {
        navigate('/eco-bubble');
    }, [navigate]);

    // Função para exibir o ícone da bolha
    const BubbleIcon = () => (
        <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[conic-gradient(at_top_left,_#A248F5,_#DABDF9,_#F8F6FF,_#E9F4FF,_#B1D3FF)] shadow-lg shadow-indigo-200 animate-pulse-slow">
                <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full animate-spin-slower rounded-full border-2 border-dotted border-white/30 opacity-30" />
                </div>
            </div>
        </div>
    );

    // Função para obter a saudação com base no horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            return 'Bom dia';
        } else if (hour >= 12 && hour < 18) {
            return 'Boa tarde';
        } else {
            return 'Boa noite';
        }
    };

    useEffect(() => {
        const verifySession = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
            } else {
                try {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', user.id)
                        .single();

                    if (profileError) {
                        console.error("Erro ao buscar perfil:", profileError);
                        setUserName('Utilizador');
                        setUserFirstName('Utilizador');
                    } else if (profile) {
                        const firstName = profile.full_name.split(' ')[0];
                        setUserName(profile.full_name);
                        setUserFirstName(firstName);
                    } else {
                        setUserName('Utilizador');
                        setUserFirstName('Utilizador');
                    }
                } catch (error) {
                    console.error("Erro ao buscar perfil:", error);
                    setUserName('Utilizador');
                    setUserFirstName('Utilizador');
                }
                setLoading(false);
            }
        };

        verifySession();
        setLogo(<ECOLogo />);
    }, [navigate]);

    if (loading) return <div>Carregando...</div>;

    const greeting = getGreeting();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#c5e8ff] via-[#e9f1ff] to-[#ffd9e6] animate-gradient-x p-6">
            <div className="flex justify-center mb-12 pt-8">
                {logo}
            </div>
            <div className="text-center mb-8">
                <h2 className="text-4xl text-gray-700">
                    {greeting}, {userFirstName}
                </h2>
            </div>
            <div className="flex justify-center gap-12 mb-12">
                <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
                    <div className="p-3">
                        <Moon size={24} />
                    </div>
                    <span>Hoje</span>
                </button>
                <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
                    <div className="p-3">
                        <Compass size={24} />
                    </div>
                    <span>Explorar</span>
                </button>
                <button className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
                    <div className="p-3">
                        <Music size={24} />
                    </div>
                    <span>Músicas</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/95 cursor-pointer border border-gray-100">
                    <h3 className="text-3xl text-gray-700 mb-2 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                        <BubbleIcon />
                        Olá!
                    </h3>
                    <p className="text-gray-600 mb-6">Dê o primeiro passo para um novo mundo!</p>
                    <button
                        onClick={navigateToEcoBubble}
                        className="w-full bg-black text-white rounded-full py-4 px-6 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-lg"
                    >
                        Conversar com a ECO
                    </button>
                </div>
                <div className="group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100"
                    style={{ backgroundColor: '#f8f8f8' }}
                >
                    <div
                        className="h-48 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105"
                        style={{
                            backgroundImage: `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 group-hover:bg-black/20 transition-colors">
                            <p className="text-white text-xl text-center group-hover:scale-[1.02] transition-transform">
                                O céu não se importa com a altura em que a pipa voa - ele só dá espaço para que ela dance.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 flex justify-end group-hover:bg-white/95 transition-colors">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                            <Eye size={20} />
                            <span>Ver detalhes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Componente da Logo ECO (usando o mesmo da HomePage)
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

                <div className="text-center mt-4 space-y-3">
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full py-3 bg-white text-black rounded-full font-medium transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Criar conta
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenTour}
                        className="w-full py-3  bg-white text-black rounded-full font-medium transition-all duration-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" // Estilo do botão Iniciar Tour
                    >
                        Iniciar Tour
                    </button>
                </div>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">ou</span>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">v1.0</p>
        </div>
    );
};

export default LoginPage;

