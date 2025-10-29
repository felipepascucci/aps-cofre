import React,{useState}  from 'react';
import { Link, useLocation } from 'react-router-dom';

function Level2Page() {
  const location = useLocation();
  const userName = location.state?.userName || 'Usuário';

      {showConfidential && (
        <div style={{ 
          marginTop: '25px', 
          border: '5px solid #ccc',
          borderRadius: '10px',
          borderColor: '#007bff',
          padding: '20px', 
          textAlign: 'left',
          backgroundColor: '#ffffff' 
        }}>
          <h3 style= {{color:'black'}}>Documentos Confidenciais de Nível 2</h3>
          <ul style= {{color:'black'}}>
            <li>Relatório Financeiro Q3-2025.pdf</li>
            <li>Estratégia de Expansão Global.docx</li>
            <li>Contrato de Parceria Secreta.pdf</li>
            <li>Memo - Reunião do Conselho (15/10).txt</li>
          </ul>
          <p style={{ fontSize: '0.8em', color: '#666' }}>Atenção: O compartilhamento destes documentos com terceiros é estritamente proibido.</p>
      </div>
      )}
      
      <Link to="/" style={{ color: 'var(--text-light)', marginTop: '30px', display: 'inline-block', color: '#666' }}>
        Voltar para a Câmera
      </Link>
    </div>
  );
}
export default Level2Page;