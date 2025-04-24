// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage'; // IMPORTANTE: HomePage com "H" maiúsculo
// import SignupPage from './app/SignupPage'; // Remova a importação do SignupPage
import { AuthContextProvider } from './AuthContext'; // Importe o AuthContextProvider

function App() {
  return (
    <AuthContextProvider> {/* Envolva SUA APLICAÇÃO INTEIRA com o AuthContextProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Rota principal agora é LoginPage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          {/* Remova a rota para SignupPage */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}
          {/* Redireciona qualquer outra rota desconhecida para a página de login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
