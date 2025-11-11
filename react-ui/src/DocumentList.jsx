import React, { useState, useMemo } from 'react'
import { FaEye, FaFolder, FaFilePdf } from 'react-icons/fa'
import { Eye, EyeOff } from 'lucide-react'
import { ALL_DOCUMENTS } from './documentDatabase'
import DocumentViewerModal from './DocumentViewerModal'

function DocumentList({ userLevel }) {
  const [showConfidential, setShowConfidential] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [docToView, setDocToView] = useState(null)

  const accessibleDocs = useMemo(() => {
    const filtered = ALL_DOCUMENTS.filter(doc => doc.level <= userLevel)
    const grouped = filtered.reduce((acc, doc) => {
      const levelKey = `Nível ${doc.level}`
      if (!acc[levelKey]) {
        acc[levelKey] = []
      }
      acc[levelKey].push(doc)
      return acc
    }, {})
    return grouped
  }, [userLevel])

  const getFilename = (uri) => {
    return uri.split('/').pop()
  }

  const toggleConfidential = () => {
    setShowConfidential(!showConfidential)
  }

  const handleView = (doc) => {
    setDocToView({
      ...doc,
      name: getFilename(doc.uri) 
    })
    setModalIsOpen(true)
  }

  const handleClose = () => {
    setModalIsOpen(false)
    setDocToView(null)
  }

  return (
    <>
      <button
        onClick={toggleConfidential}
        style={{
          marginTop: '30px', backgroundColor: '#1565c0', color: '#fff',
          border: 'none', padding: '12px 24px', fontSize: '0.95rem',
          borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
          boxShadow: '0 4px 10px rgba(21, 101, 192, 0.3)', display: 'flex',
          alignItems: 'center', marginLeft: 'auto', marginRight: 'auto'
        }}
      >
        {showConfidential ? (
          <><EyeOff size={16} style={{ marginRight: '8px' }} /> Ocultar Documentos</>
        ) : (
          <><Eye size={16} style={{ marginRight: '8px'}} /> Visualizar Documentos</>
        )}
      </button>

      {showConfidential && (
        <div className="document-list-container">
          
          {Object.keys(accessibleDocs).map(levelName => (
            <div key={levelName} className="document-folder">
              <h3 className="folder-header">
                <FaFolder style={{ marginRight: '8px' }} />
                Documentos - {levelName}
              </h3>
              <ul className="document-list">
                {accessibleDocs[levelName].map((doc) => (
                  <li key={doc.uri} className="document-list-item">
                    <span className="document-name">
                      <FaFilePdf style={{ color: 'var(--denied-color)'}} />
                      {getFilename(doc.uri)}
                    </span>
                    <FaEye
                      size={20}
                      className="view-icon"
                      onClick={() => handleView(doc)}
                      title={`Visualizar ${getFilename(doc.uri)}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <p style={{ fontSize: '0.8em', color: '#c62828', marginTop: '15px' }}>
            ⚠️ Atenção: O compartilhamento destes documentos com terceiros é estritamente proibido.
          </p>
        </div>
      )}

      <DocumentViewerModal
        isOpen={modalIsOpen}
        onClose={handleClose}
        document={docToView}
      />
    </>
  )
}

export default DocumentList






