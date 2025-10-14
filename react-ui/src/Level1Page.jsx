import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Level1Page() {
  const location = useLocation();
  const userName = location.state?.userName || 'Usuário';

  return (
    <div className="card-container" style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'var(--success-color)' }}>Acesso Autorizado</h1>
      <h2>Bem-vindo, {userName}!</h2>
      <div className="status status-allowed" style={{ fontSize: '1.5em' }}>
        Acesso de Nível 1 (Geral) concedido.
      </div>
      <Link to="/" style={{ color: 'var(--text-light)', marginTop: '30px', display: 'inline-block' }}>
        Voltar para a Câmera
      </Link>
    </div>
  );
}

export default Level1Page;