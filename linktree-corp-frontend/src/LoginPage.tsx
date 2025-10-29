import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      navigate('/admin'); 
    } else {
      setError('Senha incorreta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="bg-card p-8 rounded-lg border border-border shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary"></h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Senha de Acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
          
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full p-3 font-bold rounded-md bg-accent hover:bg-accent/90 text-accent-foreground transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;