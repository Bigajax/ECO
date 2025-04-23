// Arquivo: src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage'; // IMPORTANTE: HomePage com "H" maiúsculo
import SignupPage from './app/SignupPage';
import { AuthContextProvider } from './AuthContext'; // Importe o AuthContextProvider

function App() {
  return (
    <AuthContextProvider> {/* Envolva sua aplicação com o AuthContextProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
