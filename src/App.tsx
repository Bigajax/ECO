import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingBubble from './components/LoadingBubble'; // Importe o LoadingBubble
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import IntroductionPage from './app/IntroductionPage';
//import Slide from './app/IntroductionPage'; // Remova ou comente esta linha, parece não ser usada aqui

function App() {
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    // Simule o carregamento inicial da aplicação
    const timer = setTimeout(() => {
      setIsLoading(false); // Define para falso após a simulação de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpeza
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
            {/* Redireciona da raiz para /login */}
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
