// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
import SignupPage from './app/SignupPage';
import EcoBubbleInterface from './components/EcoBubbleInterface'; // ✅ Importe o componente EcoBubbleInterface

function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona da raiz para /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/eco-bubble" element={<EcoBubbleInterface />} /> {/* ✅ Adicione a rota para EcoBubbleInterface */}
      </Routes>
    </Router>
  );
}

export default App;
