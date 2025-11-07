import React,{useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Eye, EyeOff, ArrowLeft} from 'lucide-react';
import {FaEye} from 'react-icons/fa';
import { FaFolder } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { FaUserTie } from 'react-icons/fa';
import DocumentViewerModal from './DocumentViewerModal';

const DOCUMENTS = [
    { nome: "Relatório", uri: "/docs/RELATORIO.pdf"},
];

function Level1Page() {
  const location = useLocation();
  const userName = location.state?.userName || 'Usuário';
  const [showConfidential, setShowConfidential] = useState(false);
  const toggleConfidential = () => {
      setShowConfidential(!showConfidential);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [docToView, setDocToView] = useState(null);
  const handleView = (doc) => {
        setDocToView(doc);
        setModalIsOpen(true);
    };
  const handleClose = () => {
        setModalIsOpen(false);
        setDocToView(null);
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
    transition: '0.3s',
    color: '#1e2a44'
  };

 return(
   <div className="card-container" style={{ textAlign: 'center', backgroundColor: '#ffffff', marginTop: '40px'}}>
      <h1 style={{color: 'black'}}>Acesso Autorizado</h1>
      <h1 style={{ fontSize:'2rem',color: '#1565c0',marginBottom: '15px'}}>
      Bem-vindo, {userName}
      </h1>
     <div className= "status status-allowed" style={{fontSize: '1.5em', backgroundColor: '#e3f2fd', color:'#1e2a44', display:'inline-block'}}>
     <FaUserTie style={{ marginRight: '10px' }} />
            Acesso de Nivel 1 - Geral concedido
     </div>
      <button
        onClick={toggleConfidential}
        style={{
          marginTop: '30px',
          backgroundColor: '#1565c0',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '0.95rem',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: '0.3s',
          boxShadow: '0 4px 10px rgba(21, 101, 192, 0.3)',
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto', 
          marginRight: 'auto'
          }}
        >
          {showConfidential ? (
            <> 
              <EyeOff size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Ocultar Documentos
           </>
          ):(
           <>
           <Eye size={16} style={{ verticalAlign: 'middle', marginRight: '8px'}} /> Visualizar documentos
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

export default Level1Page;