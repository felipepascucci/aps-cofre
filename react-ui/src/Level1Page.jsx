import React,{useState} from 'react';
import { Link, useLocation } from 'react-router-dom';

function Level1Page() {
  const location = useLocation();
  const userName = location.state?.userName || 'Usuário';
  const [showConfidential, setShowConfidential] = useState(false);
  const toggleConfidential = () => {
      setShowConfidential(!showConfidential);
  };
  const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    margin: '8px 0',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e0e6ed',
    transition: '0.3s'
   };
}
 return(
   <div className="card-container" style={{ textAlign: 'center', backgroundColor: '#ffffff', marginTop: '40px'}}>
      <h1 style={{color: 'black'}}>Acesso Autorizado</h1>
      <h1 style={{ fontSize:'2rem',color: '#1565c0',marginBottom: '15px'}}>
      Bem-vindo, {userName}
      </h1>
     <div className= "status status-allowed" style={{fontSize: '1.5em', backgroundColor: '#e3f2fd', color:'#1e2a44', display:'inline-block', marginBottom:'1.5px'}}>
          <i classeName="fa-solid fa-user-slash"></i>
          Acesso de Nivel 1 - Geral concedido.
      </div>
      <button
        onClick={toggleConfidential}
        style={{
          backgroundColor: '#1565c0',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '0.95rem',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: '0.3s',S
          boxShadow: '0 4px 10px rgba(21, 101, 192, 0.3)',
        }}
        >
          {showConfidential ? (
            <> 
              <EyeOff size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Ocultar Documentos
           </>
          ):(
           <>
           <Eye size={16} style={{ verticalAlign: 'middle', marginRight: '8px', textAlign: 'center' }} /> Visualizar documentos
           </>
    
        )}
      </button>
  
      {showConfidential && (
        <div style={{ 
          marginTop: '25px', 
                background: '#f8fafc',
                border: '1px solid #e0e6ed',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left'
          }}>
          <h3 style= {{color:'#1e2a44', marginBottom:'10px'}}>Documentos Confidenciais de Nível 2</h3>
          <ul style= {{ listStyleType:'none', paddingLeft:'0' }}>
            <li style={{listItemStyle}}>Relatório Financeiro Q3-2025.pdf</li>
            <li >Estratégia de Expansão Global.docx</li>
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

export default Level1Page;