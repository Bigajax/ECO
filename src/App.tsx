// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import HomePage from './app/HomePage';
// Importe outros componentes de página aqui

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Adicione outras rotas da sua aplicação aqui */}
        {/* Por exemplo: */}
        {/* <Route path="/signup" element={<SignupPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
