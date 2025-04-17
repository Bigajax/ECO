import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './app/login';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* Você pode adicionar mais rotas aqui no futuro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
