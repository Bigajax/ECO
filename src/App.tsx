// Arquivo: src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/home';
import SignupPage from './app/SignupPage'; // Importação corrigida para SignupPage
import ProfilePage from './app/profile';
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
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
