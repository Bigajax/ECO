// src/main.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Login from './Login';

function Main() {
  const [logado, setLogado] = useState(false);

  return (
    <React.StrictMode>
      {logado ? <App /> : <Login onLoginSuccess={() => setLogado(true)} />}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
