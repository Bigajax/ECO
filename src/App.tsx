import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoadingBubble from './components/LoadingBubble';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import IntroductionPage from './app/IntroductionPage';

function App() {
  const [isLoading, setIsLoading] = useState(false); // Inicialmente false, para não mostrar no primeiro carregamento
  const location = useLocation();

  useEffect(() => {
    // Lógica para verificar se a página está carregando ou não
    const handleRouteChange = () => {
      setIsLoading(true); // Começa a carregar a página
      // Simulação de carregamento
      setTimeout(() => {
        setIsLoading(false); // Termina o carregamento
      }, 500);
    };

    handleRouteChange();

  }, [location.pathname]); // Toda vez que a rota mudar, executa o useEffect

  return (
    <div className="App">
      {isLoading ? (
        <LoadingBubble
          size="xl"
          label="Carregando Página..."
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
