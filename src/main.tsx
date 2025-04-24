import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App'; // Verifique se o caminho para App.tsx está correto

console.log('Iniciando a aplicação a partir de main.tsx...'); // Linha adicionada

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Erro na renderização em main.tsx:', error); // Linha adicionada
}
