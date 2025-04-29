import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingBubble from './components/LoadingBubble';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import IntroductionPage from './app/IntroductionPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento inicial da aplicação (e verifica se o usuário está autenticado)
    const timer = setTimeout(() => {
      // Aqui você colocaria sua lógica real de verificação de autenticação
      // Por exemplo:
      // const usuarioAutenticado = localStorage.getItem('token');
      // setIsLoading(usuarioAutenticado ? false : false); //Mudei para false para mostrar a tela de home
      setIsLoading(false); // Remova esta linha quando tiver a lógica de autenticação
    }, 1500); // Reduzi o tempo de simulação para 1.5 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <LoadingBubble
          size="xl"
          label="Carregando Aplicação..."
          className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50"
        />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/eco-bubble" element={<EcoBubbleInterface />} />
            <Route path="/introduction" element={<IntroductionPage />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
