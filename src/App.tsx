import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import IntroductionPage from './app/IntroductionPage';
import EcoAudio from './components/EcoAudio'; // Importe o componente EcoAudio

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/eco-bubble" element={<EcoBubbleInterface />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/ecoaudio" element={<EcoAudio />} /> {/* Adicione a rota para EcoAudio */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
