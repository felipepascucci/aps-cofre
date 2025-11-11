import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { FaUserTie } from 'react-icons/fa'
import DocumentList from './DocumentList'

function Level1Page() {
  const location = useLocation()
  const userName = location.state?.userName || 'Usuário'

  return (
    <div className="card-container" style={{ textAlign: 'center', backgroundColor: '#ffffff', marginTop: '40px', color: '#1e2a44' }}>
      <h1 style={{ color: 'black' }}>Acesso Autorizado</h1>
      <h2 style={{ fontSize: '2rem', color: '#1565c0', marginBottom: '15px' }}>
        Bem-vindo, {userName}!
      </h2>
      <div className="status status-allowed" style={{ fontSize: '1.5em', backgroundColor: '#e3f2fd', color: '#1e2a44', display: 'inline-block' }}>
        <FaUserTie style={{ marginRight: '10px' }} />
        Acesso de Nível 1 - Geral concedido
      </div>
      
      <DocumentList userLevel={1} />
      
      <Link to="/" style={{ color: '#1565c0', marginTop: '30px', display: 'inline-block', textDecoration: 'none', fontWeight: 'bold' }}>
        <MdArrowBack style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Voltar para a Câmera
      </Link> 
    </div>
  )
}

export default Level1Page