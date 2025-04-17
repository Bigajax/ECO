import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './app/login';
import Home from './components/Home';
import EcoBubbleInterface from './components/EcoBubbleInterface'; // Importe o novo componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/eco-bubble" element={<EcoBubbleInterface />} /> {/* Adiciona a nova rota */}
        {/* Você pode adicionar mais rotas aqui no futuro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
