// src/app/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../components/supabaseClient';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Bem-vindo à Página Inicial!</h1>
    </div>
  );
};

export default HomePage;
