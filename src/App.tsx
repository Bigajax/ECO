// src/App.tsx
import React from 'react';
import Slide from './app/IntroductionPage'; // Importe o componente Slide
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import IntroductionPage from './app/IntroductionPage';

// Dados de exemplo para o componente Slide (para teste isolado)
const testSlideData = {
  title: "Teste",
  text: ["Linha 1", "Linha 2"],
  color: "#007BA7",
  bubblePosition: "floating",
  background: "linear-gradient(145deg, #F8F5F0 0%, #F8F5F0 100%)",
  onNext: () => {},
  onPrev: () => {},
  isFirst: true,
  isLast: false,
};

function App() {
  // Descomente a linha abaixo para testar o componente Slide isoladamente
  // return (
  //   <div className="App">
  //     <Slide {...testSlideData} />
  //   </div>
  // );

  // Comente o bloco abaixo (o return com as rotas) para testar o Slide isoladamente
  return (
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
  );
}

export default App;
