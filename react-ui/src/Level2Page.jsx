import React,{useState}  from 'react';
import { Link, useLocation } from 'react-router-dom';

function Level2Page() {
  const location = useLocation();
  const userName = location.state?.userName || 'Usuário';

      {showConfidential && (
        <div style={{ 
          marginTop: '25px', 
          background: '#f8fafc',
          border: '1px solid #e0e6ed',
          borderRadius: '12px',
          padding: '20px', 
          textAlign: 'left'
        }}>
          <h3 style= {{color:'#1e2a44', marginBottom:'10px'}}>
          <FaFolder style={{ marginRight: '8px', color: '#1e2a44' }} />
          Documentos Confidenciais</h3>
          <ul style= {{listStyleType:'none', paddingLeft:'0' }}>
               {DOCUMENTS.map((doc, index) => (
                   <li key={index} style={listItemStyle}>
                   <span>📄{doc.nome}</span>
            <FaEye size={20} style={{ cursor: 'pointer', color: '#1565c0' }}
            onClick={() => handleView(doc)}
            title={`Visualizar ${doc.nome}`}
            
            />
           </li>
           ))}
          </ul>
          <p style={{ fontSize: '0.8em', color: '#c62828' }}>⚠️Atenção: O compartilhamento destes documentos com terceiros é estritamente proibido.</p>
      </div>
      )}
      <DocumentViewerModal
          isOpen={modalIsOpen}
          onClose={handleClose}
          document={docToView}
      />
       <Link to="/" style={{ color: 'var(--text-light)', marginTop: '30px', display: 'inline-block', color: '#666'}}>
      <MdArrowBack style={{ marginRight: '5px' }} />
        Voltar para a Câmera
      </Link>
    </div>
  );
}
export default Level2Page;