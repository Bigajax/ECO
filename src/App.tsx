import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './app/login';
import Home from './components/Home';
import EcoBubbleInterface from './components/EcoBubbleInterface';
import SignUp from './components/SignUp'; // Importe o componente SignUp

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* Adicione esta linha para acessar explicitamente /login */}
        <Route path="/signup" element={<SignUp />} /> {/* Adicione a rota para SignUp */}
        <Route path="/home" element={<Home />} />
        <Route path="/eco-bubble" element={<EcoBubbleInterface />} />
        {/* Você pode adicionar mais rotas aqui no futuro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
